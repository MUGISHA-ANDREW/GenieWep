import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

/**
 * Runs `/api/send-enquiry` inside the dev server.
 *
 * In production that path is a Vercel Serverless Function; `vite dev` knows
 * nothing about `api/`, so without this the contact form would POST to the SPA
 * fallback, get `index.html` back and report a failure that only happens
 * locally. Rather than reimplement delivery, this calls the same
 * `api/_enquiry.js` the deployed function calls — a dev shim that reimplements
 * delivery is a shim that drifts, and the drift surfaces in production.
 *
 * The handler is imported per request so editing it does not need a restart,
 * and the secrets come from `.env.local` via `loadEnv` — note the bare names.
 * Vite only exposes `VITE_`-prefixed vars to the browser, which is exactly why
 * `RESEND_API_KEY` is not prefixed: it must never reach the bundle.
 */
const enquiryApiPlugin = (env) => ({
  name: 'geniewep:enquiry-api',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/api/send-enquiry', async (req, res, next) => {
      if (req.method !== 'POST') return next()

      const chunks = []
      for await (const chunk of req) chunks.push(chunk)

      try {
        /*
         * Checked by `name` below rather than `instanceof`: ssrLoadModule
         * returns a freshly evaluated module on each request, so its error
         * classes are new identities every time and `instanceof` against the
         * ones from a previous load would silently never match.
         */
        const { parseEnquiry, deliverEnquiry } =
          await server.ssrLoadModule('/api/_enquiry.js')

        const enquiry = parseEnquiry(JSON.parse(Buffer.concat(chunks).toString('utf8')))

        // Honeypot tripped: answered as success, nothing sent. Same as prod.
        if (enquiry !== null) {
          await deliverEnquiry(enquiry, { ...process.env, ...env })
        }

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ success: true }))
      } catch (error) {
        const isValidation =
          error?.name === 'EnquiryValidationError' || error instanceof SyntaxError
        const isConfig = error?.name === 'EnquiryConfigError'

        if (isConfig) {
          server.config.logger.warn(
            '\n[send-enquiry] RESEND_API_KEY is not set in .env.local — nothing was sent.',
          )
        } else if (!isValidation) {
          server.config.logger.error(`[send-enquiry] ${error?.message ?? error}`)
        }

        res.statusCode = isValidation ? 400 : isConfig ? 503 : 502
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            success: false,
            message: isValidation ? error.message : 'The message could not be delivered.',
          }),
        )
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Empty prefix: this needs the unprefixed server-side names too, and they
  // stay in this file rather than being handed to the client bundle.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), enquiryApiPlugin(env)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.js'],
      css: false,
    },
    build: {
      // Chunking is left to Rolldown's default strategy. Route-level splitting
      // already comes from the React.lazy calls in src/App.jsx, and a hand-written
      // manualChunks map tends to fight the bundler rather than help it.
      target: 'es2020',
      cssMinify: 'lightningcss',
      reportCompressedSize: false,
    },
  }
})
