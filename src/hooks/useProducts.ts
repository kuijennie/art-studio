import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Product {
  _id: string
  slug: string
  name: string
  price: number
  description: string
  image: string
  tint: string
  category: string
}

export type ProductFields = Omit<Product, '_id'>

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(body || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function useProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiFetch<Product[]>('/api/products'),
  })
  return { data: data ?? [], isLoading }
}

export function useProduct(slug: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['products', slug],
    queryFn: () => apiFetch<Product>(`/api/products/${slug}`),
    enabled: !!slug,
  })
  return { data: data ?? null, isLoading }
}

export function useCreateProduct() {
  const qc = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ProductFields) =>
      apiFetch<Product>('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
  return { mutateAsync, isPending }
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<ProductFields> }) =>
      apiFetch<Product>(`/api/products/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
  return { mutateAsync, isPending }
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (slug: string) =>
      apiFetch<{ ok: boolean }>(`/api/products/${slug}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
  return { mutateAsync, isPending }
}
