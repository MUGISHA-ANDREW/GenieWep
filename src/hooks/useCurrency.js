import { useContext } from 'react'

import { CurrencyContext } from '@/context/currency-context'

export const useCurrency = () => {
  const context = useContext(CurrencyContext)

  if (context === null) {
    throw new Error('useCurrency must be used inside a CurrencyProvider.')
  }

  return context
}

export default useCurrency
