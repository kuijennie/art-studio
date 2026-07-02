import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../hooks/useProducts'
import type { Product, ProductFields } from '../hooks/useProducts'

const API_BASE = 'http://localhost:3001/api'

interface MongoUser {
  _id: string
  fullname: string
  email: string
  role: 'customer' | 'admin'
  createdAt: string
  lastLogin: string | null
}

function useMongoUsers(token: string | null) {
  const [users, setUsers] = useState<MongoUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data)
        else setError(data.error ?? 'Failed to load users')
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load users')
        setLoading(false)
      })
  }, [token])

  return { users, setUsers, loading, error }
}

const EMPTY: ProductFields = {
  slug: '', name: '', price: 0, description: '', image: '', tint: '#ffffff', category: '',
}

const inputStyle: React.CSSProperties = {
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

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)',
  display: 'block',
  marginBottom: '5px',
}

function ProductForm({
  initial, onSave, onCancel, saving, error, mode,
}: {
  initial: ProductFields
  onSave: (p: ProductFields) => void
  onCancel: () => void
  saving: boolean
  error: string | null
  mode: 'add' | 'edit'
}) {
  const [form, setForm] = useState<ProductFields>(initial)
  const isMobile = useIsMobile()

  function set(key: keyof ProductFields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: key === 'price' ? Number(e.target.value) : e.target.value }))
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: isMobile ? '20px 16px' : '28px 32px', marginBottom: '40px' }}>
      <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', margin: '0 0 24px' }}>
        {mode === 'add' ? 'Add New Artwork' : `Editing - ${initial.name}`}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
        <div><label style={labelStyle}>Name *</label><input style={inputStyle} value={form.name} onChange={set('name')} placeholder="Golden Horizon" /></div>
        <div><label style={labelStyle}>Slug *</label><input style={inputStyle} value={form.slug} onChange={set('slug')} placeholder="golden-horizon" disabled={mode === 'edit'} /></div>
        <div>
          <label style={labelStyle}>Price (KSh) *</label>
          <input style={inputStyle} inputMode="numeric" value={form.price || ''} onChange={set('price')} placeholder="48000" />
        </div>
        <div>
          <label style={labelStyle}>Category *</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={set('category')}>
            <option value="">Select...</option>
            {['painting', 'print', 'photography', 'ceramics', 'mixed media', 'digital', 'textile'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Image URL *</label>
          <input style={inputStyle} value={form.image} onChange={set('image')} placeholder="https://..." />
          {form.image && <img src={form.image} alt="preview" style={{ marginTop: '12px', width: '160px', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />}
        </div>
        <div>
          <label style={labelStyle}>Tint color *</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="color" value={form.tint} onChange={set('tint')} style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }} />
            <input style={{ ...inputStyle, flex: 1 }} value={form.tint} onChange={set('tint')} placeholder="#c8a84b" />
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Description *</label>
          <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={form.description} onChange={set('description')} placeholder="Describe the artwork..." />
        </div>
      </div>
      {error && <p style={{ color: '#ff6b81', fontSize: '12px', margin: '12px 0 0' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => onSave(form)} disabled={saving} style={{ padding: '10px 28px', borderRadius: '999px', border: 'none', background: saving ? 'rgba(198,241,53,0.5)' : '#c6f135', color: '#0a0a0a', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Saving...' : mode === 'add' ? 'Add Artwork' : 'Save Changes'}
        </button>
        <button onClick={onCancel} style={{ padding: '10px 24px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { user, token, isAdmin, isLoading } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { data: products, isLoading: productsLoading } = useProducts()
  const create = useCreateProduct()
  const update = useUpdateProduct()
  const del = useDeleteProduct()

  const [tab, setTab] = useState<'products' | 'users'>('products')
  const [mode, setMode] = useState<'idle' | 'add' | 'edit'>('idle')
  const [editing, setEditing] = useState<Product | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const { users: mongoUsers, setUsers: setMongoUsers, loading: usersLoading, error: usersError } = useMongoUsers(token)

  if (isLoading) return null

  if (!user || !isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '24px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Access denied</p>
        <button onClick={() => navigate({ to: '/' })} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Back to site</button>
      </div>
    )
  }

  async function handleSave(form: ProductFields) {
    setFormError(null)
    setSuccessMsg(null)
    try {
      if (mode === 'add') {
        await create.mutateAsync(form)
        setSuccessMsg('Artwork added successfully!')
      } else if (mode === 'edit' && editing) {
        await update.mutateAsync({ slug: editing.slug, data: form })
        setSuccessMsg('Artwork updated successfully!')
      }
      setMode('idle')
      setEditing(null)
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  async function handleDeleteProduct(slug: string) {
    await del.mutateAsync(slug)
    setDeleteConfirm(null)
  }

  async function handleDeleteUser(id: string) {
    if (!token) return
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      setMongoUsers(prev => prev.filter(u => u._id !== id))
    }
  }

  async function handleRoleToggle(u: MongoUser) {
    if (!token) return
    const newRole = u.role === 'admin' ? 'customer' : 'admin'
    const res = await fetch(`${API_BASE}/users/${u._id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) {
      setMongoUsers(prev => prev.map(x => x._id === u._id ? { ...x, role: newRole } : x))
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', padding: '0 0 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '18px 16px' : '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate({ to: '/' })} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Site</button>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#fff' }}>Admin</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          {(['products', 'users'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: tab === t ? '#c6f135' : 'rgba(255,255,255,0.4)', borderBottom: tab === t ? '2px solid #c6f135' : '2px solid transparent', paddingBottom: '2px' }}>
              {t}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', maxWidth: '100%', overflowWrap: 'anywhere' }}>{user.email}</span>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 32px' }}>
        {tab === 'products' && (
          <>
            {mode === 'add' && <ProductForm initial={EMPTY} onSave={handleSave} onCancel={() => { setMode('idle'); setFormError(null) }} saving={create.isPending} error={formError} mode="add" />}
            {mode === 'edit' && editing && <ProductForm initial={editing} onSave={handleSave} onCancel={() => { setMode('idle'); setEditing(null); setFormError(null) }} saving={update.isPending} error={formError} mode="edit" />}
            {successMsg && <p style={{ color: '#c6f135', fontSize: '13px', marginBottom: '16px', background: 'rgba(198,241,53,0.08)', padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(198,241,53,0.2)' }}>{successMsg}</p>}

            <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', marginBottom: '24px', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '14px' : 0 }}>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', margin: 0 }}>Products</h1>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{products?.length ?? 0} artworks</p>
              </div>
              {mode === 'idle' && (
                <button onClick={() => setMode('add')} style={{ padding: '10px 24px', borderRadius: '999px', border: 'none', background: '#c6f135', color: '#0a0a0a', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Add Artwork
                </button>
              )}
            </div>

            {productsLoading ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Loading...</p> : (
              isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {products?.map(product => (
                    <div key={product.slug} style={{ background: deleteConfirm === product.slug ? 'rgba(255,80,80,0.06)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <img src={product.image} alt={product.name} style={{ width: '68px', height: '84px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#fff' }}>{product.name}</p>
                          <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.35)', overflowWrap: 'anywhere' }}>{product.slug}</p>
                          <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{product.category}</p>
                          <p style={{ margin: '6px 0 0', fontSize: '13px', fontWeight: 600, color: '#fff' }}>KSh {product.price.toLocaleString()}</p>
                        </div>
                      </div>
                      {deleteConfirm === product.slug ? (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                          <button onClick={() => handleDeleteProduct(product.slug)} disabled={del.isPending} style={{ padding: '8px 14px', borderRadius: '999px', border: 'none', background: '#ff4444', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Confirm</button>
                          <button onClick={() => setDeleteConfirm(null)} style={{ padding: '8px 10px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '10px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                          <button onClick={() => { setEditing(product); setMode('edit'); setFormError(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={{ padding: '8px 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => setDeleteConfirm(product.slug)} style={{ padding: '8px 14px', borderRadius: '999px', border: '1px solid rgba(255,80,80,0.3)', background: 'transparent', color: 'rgba(255,100,100,0.8)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Delete</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 110px 130px', gap: '16px', padding: '10px 16px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                    <span></span><span>Name</span><span>Category</span><span>Price</span><span>Actions</span>
                  </div>
                  {products?.map(product => (
                    <div key={product.slug} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 110px 130px', gap: '16px', alignItems: 'center', padding: '12px 16px', background: deleteConfirm === product.slug ? 'rgba(255,80,80,0.06)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                      <img src={product.image} alt={product.name} style={{ width: '52px', height: '64px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#fff' }}>{product.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{product.slug}</p>
                      </div>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{product.category}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>KSh {product.price.toLocaleString()}</span>
                      {deleteConfirm === product.slug ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleDeleteProduct(product.slug)} disabled={del.isPending} style={{ padding: '6px 14px', borderRadius: '999px', border: 'none', background: '#ff4444', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Confirm</button>
                          <button onClick={() => setDeleteConfirm(null)} style={{ padding: '6px 10px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '10px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => { setEditing(product); setMode('edit'); setFormError(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={{ padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => setDeleteConfirm(product.slug)} style={{ padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(255,80,80,0.3)', background: 'transparent', color: 'rgba(255,100,100,0.8)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Delete</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}

        {tab === 'users' && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', margin: 0 }}>Users</h1>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{mongoUsers.length} registered</p>
            </div>
            {usersLoading ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Loading...</p>
              : usersError ? <p style={{ color: '#ff6b81', fontSize: '13px' }}>{usersError}</p>
              : isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {mongoUsers.map(u => (
                    <div key={u._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(198,241,53,0.15)', border: '1px solid rgba(198,241,53,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#c6f135', flexShrink: 0 }}>
                          {u.fullname ? u.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#fff' }}>{u.fullname}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.35)', overflowWrap: 'anywhere' }}>{u.email}</p>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>Registered</p>
                          <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>Role</p>
                          <p style={{ margin: '6px 0 0', fontSize: '12px', fontWeight: 700, color: u.role === 'admin' ? '#c6f135' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{u.role}</p>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>Last Login</p>
                          <p style={{ margin: '6px 0 0', fontSize: '12px', color: u.lastLogin ? 'rgba(198,241,53,0.8)' : 'rgba(255,255,255,0.2)' }}>
                            {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'}
                          </p>
                        </div>
                      </div>
                      {u._id !== user._id && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                          <button onClick={() => handleRoleToggle(u)} title={u.role === 'admin' ? 'Demote to customer' : 'Promote to admin'} style={{ padding: '8px 12px', borderRadius: '999px', border: '1px solid rgba(198,241,53,0.3)', background: 'transparent', color: 'rgba(198,241,53,0.7)', fontSize: '10px', cursor: 'pointer' }}>
                            {u.role === 'admin' ? 'Demote' : 'Promote'}
                          </button>
                          <button onClick={() => handleDeleteUser(u._id)} style={{ padding: '8px 12px', borderRadius: '999px', border: '1px solid rgba(255,80,80,0.3)', background: 'transparent', color: 'rgba(255,100,100,0.8)', fontSize: '10px', cursor: 'pointer' }}>Delete</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {mongoUsers.length === 0 && <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No users registered yet.</p>}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 80px 160px 100px', gap: '16px', padding: '10px 16px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                    <span>Name / Email</span><span>Registered</span><span>Role</span><span>Last Login</span><span>Actions</span>
                  </div>
                  {mongoUsers.map(u => (
                    <div key={u._id} style={{ display: 'grid', gridTemplateColumns: '1fr 200px 80px 160px 100px', gap: '16px', alignItems: 'center', padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(198,241,53,0.15)', border: '1px solid rgba(198,241,53,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#c6f135', flexShrink: 0 }}>
                          {u.fullname ? u.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#fff' }}>{u.fullname}</p>
                          <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{u.email}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: u.role === 'admin' ? '#c6f135' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{u.role}</span>
                      <span style={{ fontSize: '12px', color: u.lastLogin ? 'rgba(198,241,53,0.8)' : 'rgba(255,255,255,0.2)' }}>
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {u._id !== user._id && (
                          <>
                            <button onClick={() => handleRoleToggle(u)} title={u.role === 'admin' ? 'Demote to customer' : 'Promote to admin'} style={{ padding: '5px 10px', borderRadius: '999px', border: '1px solid rgba(198,241,53,0.3)', background: 'transparent', color: 'rgba(198,241,53,0.7)', fontSize: '10px', cursor: 'pointer' }}>
                              {u.role === 'admin' ? 'Down' : 'Up'}
                            </button>
                            <button onClick={() => handleDeleteUser(u._id)} style={{ padding: '5px 10px', borderRadius: '999px', border: '1px solid rgba(255,80,80,0.3)', background: 'transparent', color: 'rgba(255,100,100,0.8)', fontSize: '10px', cursor: 'pointer' }}>Delete</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {mongoUsers.length === 0 && <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No users registered yet.</p>}
                </div>
              )}
          </>
        )}
      </div>
    </div>
  )
}
