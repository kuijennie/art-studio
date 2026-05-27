import { useState, useRef, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../hooks/useProducts'
import type { Product, ProductFields } from '../hooks/useProducts'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined

const EMPTY: ProductFields = {
  slug: '', name: '', price: 0, description: '', image: '', tint: '#ffffff', category: '',
}

const input: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  padding: '9px 12px',
  color: '#fff',
  fontSize: '13px',
  width: '100%',
  outline: 'none',
  fontFamily: 'inherit',
}

const label: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)',
  display: 'block',
  marginBottom: '5px',
}

function ProductForm({
  initial,
  onSave,
  onCancel,
  saving,
  error,
  mode,
}: {
  initial: ProductFields
  onSave: (p: ProductFields) => void
  onCancel: () => void
  saving: boolean
  error: string | null
  mode: 'add' | 'edit'
}) {
  const [form, setForm] = useState<ProductFields>(initial)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [pendingStorageId, setPendingStorageId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const generateUploadUrl = useConvexMutation(api.files.generateUploadUrl)
  const storageUrl = useConvexQuery(api.files.getUrl, pendingStorageId ? { storageId: pendingStorageId } : 'skip')

  useEffect(() => {
    if (storageUrl) {
      setForm(f => ({ ...f, image: storageUrl }))
    }
  }, [storageUrl])

  function set(key: keyof ProductFields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: key === 'price' ? Number(e.target.value) : e.target.value }))
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const uploadUrl = await generateUploadUrl()
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      })
      if (!res.ok) throw new Error(`Upload failed: ${res.status} ${res.statusText}`)
      const { storageId } = await res.json() as { storageId: string }
      setPendingStorageId(storageId)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
        padding: '28px 32px',
        marginBottom: '40px',
      }}
    >
      <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', margin: '0 0 24px' }}>
        {mode === 'add' ? 'Add New Artwork' : `Editing — ${initial.name}`}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={label}>Name *</label>
          <input style={input} value={form.name} onChange={set('name')} placeholder="Golden Horizon" />
        </div>
        <div>
          <label style={label}>Slug *</label>
          <input style={input} value={form.slug} onChange={set('slug')} placeholder="golden-horizon" disabled={mode === 'edit'} />
        </div>
        <div>
          <label style={label}>Price (KSh) *</label>
          <input
            style={input}
            inputMode="numeric"
            value={form.price || ''}
            onChange={set('price')}
            placeholder="48000"
          />
        </div>
        <div>
          <label style={label}>Category *</label>
          <select style={{ ...input, cursor: 'pointer' }} value={form.category} onChange={set('category')}>
            <option value="">Select…</option>
            {['painting', 'print', 'photography', 'ceramics', 'mixed media', 'digital', 'textile'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Image upload */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={label}>Image *</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

          {form.image ? (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <img
                src={form.image}
                alt="preview"
                style={{ width: '160px', height: '200px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#7dea6b', fontWeight: 600 }}>Image uploaded</p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  style={{ ...input, cursor: 'pointer', textAlign: 'left', color: 'rgba(255,255,255,0.5)', display: 'block' }}
                >
                  {uploading ? 'Uploading…' : 'Replace image'}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{
                ...input,
                cursor: uploading ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                color: uploading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)',
                display: 'block',
              }}
            >
              {uploading ? 'Uploading…' : 'Choose image file…'}
            </button>
          )}

          {uploadError && (
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#ff6b81' }}>{uploadError}</p>
          )}
        </div>

        <div>
          <label style={label}>Tint colour *</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="color" value={form.tint} onChange={set('tint')}
              style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }} />
            <input style={{ ...input, flex: 1 }} value={form.tint} onChange={set('tint')} placeholder="#c8a84b" />
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={label}>Description *</label>
          <textarea
            style={{ ...input, minHeight: '100px', resize: 'vertical' }}
            value={form.description}
            onChange={set('description')}
            placeholder="Describe what's in the artwork and its story…"
          />
        </div>
      </div>

      {error && (
        <p style={{ color: '#ff6b81', fontSize: '12px', margin: '12px 0 0' }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button
          onClick={() => onSave(form)}
          disabled={saving || uploading}
          style={{
            padding: '10px 28px', borderRadius: '999px', border: 'none',
            background: (saving || uploading) ? 'rgba(198,241,53,0.5)' : '#c6f135',
            color: '#0a0a0a', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : mode === 'add' ? 'Add Artwork' : 'Save Changes'}
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '10px 24px', borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent', color: 'rgba(255,255,255,0.6)',
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { user, isLoaded } = useUser()
  const navigate = useNavigate()
  const { data: products, isLoading } = useProducts()
  const create = useCreateProduct()
  const update = useUpdateProduct()
  const del = useDeleteProduct()

  const [mode, setMode] = useState<'idle' | 'add' | 'edit'>('idle')
  const [editing, setEditing] = useState<Product | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  if (!isLoaded) return null

  const userEmail = user?.emailAddresses[0]?.emailAddress
  const isAdmin = !ADMIN_EMAIL || userEmail === ADMIN_EMAIL

  if (!user || !isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Access denied
        </p>
        <button onClick={() => navigate({ to: '/' })} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
          ← Back to site
        </button>
      </div>
    )
  }

  async function handleSave(form: ProductFields) {
    setFormError(null)
    try {
      if (mode === 'add') {
        await create.mutateAsync(form)
      } else if (mode === 'edit' && editing) {
        await update.mutateAsync({ slug: editing.slug, data: form })
      }
      setMode('idle')
      setEditing(null)
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  async function handleDelete(slug: string) {
    await del.mutateAsync(slug)
    setDeleteConfirm(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', padding: '0 0 80px' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '40px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => navigate({ to: '/' })} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ← Site
          </button>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#fff' }}>
            Admin
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
          {userEmail}
        </span>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px' }}>

        {/* Add / Edit form */}
        {mode === 'add' && (
          <ProductForm
            initial={EMPTY}
            onSave={handleSave}
            onCancel={() => { setMode('idle'); setFormError(null) }}
            saving={create.isPending}
            error={formError}
            mode="add"
          />
        )}
        {mode === 'edit' && editing && (
          <ProductForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => { setMode('idle'); setEditing(null); setFormError(null) }}
            saving={update.isPending}
            error={formError}
            mode="edit"
          />
        )}

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', margin: 0 }}>
              Products
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
              {products?.length ?? 0} artworks
            </p>
          </div>
          {mode === 'idle' && (
            <button
              onClick={() => setMode('add')}
              style={{
                padding: '10px 24px', borderRadius: '999px', border: 'none',
                background: '#c6f135', color: '#0a0a0a', fontSize: '11px',
                fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              + Add Artwork
            </button>
          )}
        </div>

        {/* Products table */}
        {isLoading ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Loading…</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 120px 110px 130px',
              gap: '16px', padding: '10px 16px',
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
            }}>
              <span></span>
              <span>Name</span>
              <span>Category</span>
              <span>Price</span>
              <span>Actions</span>
            </div>

            {products?.map(product => (
              <div
                key={product.slug}
                style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 120px 110px 130px',
                  gap: '16px', alignItems: 'center',
                  padding: '12px 16px',
                  background: deleteConfirm === product.slug ? 'rgba(255,80,80,0.06)' : 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  transition: 'background 200ms',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '52px', height: '64px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#fff' }}>{product.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{product.slug}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: product.tint, flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{product.category}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                  KSh {product.price.toLocaleString()}
                </span>

                {deleteConfirm === product.slug ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleDelete(product.slug)}
                      disabled={del.isPending}
                      style={{ padding: '6px 14px', borderRadius: '999px', border: 'none', background: '#ff4444', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      style={{ padding: '6px 10px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '10px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => { setEditing(product); setMode('edit'); setFormError(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      style={{ padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.slug)}
                      style={{ padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(255,80,80,0.3)', background: 'transparent', color: 'rgba(255,100,100,0.8)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
