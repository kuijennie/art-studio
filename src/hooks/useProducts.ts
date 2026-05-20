import { useQuery } from '@tanstack/react-query'
import { products, getProduct } from '../data/products'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 80))
      return products
    },
    staleTime: Infinity,
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['products', slug],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 40))
      return getProduct(slug) ?? null
    },
    staleTime: Infinity,
  })
}
