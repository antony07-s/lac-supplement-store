import { useCallback, useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios.js'
import { useAuth } from '../../context/AuthContext.jsx'

function Stars({ value, interactive = false, onChange, size = 16 }) {
  return <div className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" disabled={!interactive} onClick={() => onChange?.(star)} className={interactive ? 'cursor-pointer rounded focus:outline-none focus:ring-2 focus:ring-brand-blue' : 'cursor-default'} aria-label={`${star} star${star === 1 ? '' : 's'}`}><Star size={size} className={star <= value ? 'fill-brand-gold text-brand-gold' : 'text-stone-300'} /></button>)}</div>
}

const initialForm = { rating: 5, title: '', comment: '' }

function ProductReviews({ productId, averageRating = 0, totalRatings = 0, refreshProduct }) {
  const { user } = useAuth()
  const [data, setData] = useState({ reviews: [], total: 0, breakdown: [5, 4, 3, 2, 1].map((star) => ({ star, count: 0 })), hasMore: false })
  const [sort, setSort] = useState('recent'); const [filter, setFilter] = useState(''); const [page, setPage] = useState(1)
  const [eligibility, setEligibility] = useState(null); const [form, setForm] = useState(initialForm); const [formOpen, setFormOpen] = useState(false); const [submitting, setSubmitting] = useState(false)

  const loadReviews = useCallback(async (nextPage = 1, append = false) => {
    try {
      const res = await api.get(`/reviews/product/${productId}`, { params: { page: nextPage, sort, ...(filter && { rating: filter }) } })
      setData((current) => ({ ...res.data, reviews: append ? [...current.reviews, ...res.data.reviews] : res.data.reviews }))
      setPage(nextPage)
    } catch { setData((current) => ({ ...current, reviews: [] })) }
  }, [filter, productId, sort])
  const loadEligibility = useCallback(() => user && api.get(`/reviews/eligibility/${productId}`).then((res) => setEligibility(res.data)).catch(() => setEligibility(null)), [productId, user])
  // The request is intentionally started when the product, sort, or filter changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadReviews() }, [loadReviews])
  useEffect(() => { loadEligibility() }, [loadEligibility])

  const startEdit = () => { const review = eligibility?.review; if (!review) return; setForm({ rating: review.rating, title: review.title || '', comment: review.comment }); setFormOpen(true) }
  const submit = async (event) => {
    event.preventDefault(); setSubmitting(true)
    try {
      if (eligibility?.review) await api.put(`/reviews/mine/${eligibility.review._id}`, form)
      else await api.post('/reviews', { productId, ...form })
      toast.success(eligibility?.review ? 'Review updated and sent for approval.' : 'Review submitted for approval.')
      setForm(initialForm); setFormOpen(false); await Promise.all([loadEligibility(), loadReviews()]); refreshProduct?.()
    } catch (err) { toast.error(err.response?.data?.message || 'Unable to save your review.') } finally { setSubmitting(false) }
  }
  const remove = async () => {
    if (!eligibility?.review || !window.confirm('Delete your review?')) return
    try { await api.delete(`/reviews/mine/${eligibility.review._id}`); toast.success('Your review was deleted.'); setForm(initialForm); setFormOpen(false); await Promise.all([loadEligibility(), loadReviews()]); refreshProduct?.() } catch (err) { toast.error(err.response?.data?.message || 'Unable to delete your review.') }
  }
  const denominator = totalRatings || 1

  return <section id="reviews" className="mt-16 border-t border-stone-200 pt-12">
    <h2 className="section-title">Reviews &amp; ratings</h2>
    <div className="mt-6 grid gap-7 rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-7 md:grid-cols-[180px_1fr]">
      <div><p className="text-4xl font-bold text-stone-900">{Number(averageRating || 0).toFixed(1)}</p><div className="mt-2"><Stars value={Math.round(averageRating)} size={20} /></div><p className="mt-2 text-sm text-stone-500">{totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}</p></div>
      <div className="space-y-2">{data.breakdown.map(({ star, count }) => <button key={star} type="button" onClick={() => setFilter(String(star))} className="flex w-full items-center gap-3 text-sm text-stone-600"><span className="w-11 text-right">{star} star</span><span className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200"><span className="block h-full rounded-full bg-brand-gold" style={{ width: `${(count / denominator) * 100}%` }} /></span><span className="w-7 text-right">{count}</span></button>)}</div>
    </div>
    <div className="mt-7 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-stone-500">Reviews from verified customers.</p>{user && eligibility?.eligible && !formOpen && <button onClick={() => setFormOpen(true)} className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue-dark">Write a review</button>}</div>
    {user && eligibility?.review && !formOpen && <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-600"><span>Your review is {eligibility.reviewStatus}.</span><button onClick={startEdit} className="font-semibold text-brand-blue hover:underline">Edit</button><button onClick={remove} className="font-semibold text-rose-600 hover:underline">Delete</button></div>}
    {user && formOpen && <form onSubmit={submit} className="mt-6 rounded-2xl border border-stone-200 bg-white p-5"><h3 className="font-bold text-stone-800">{eligibility?.review ? 'Edit your review' : 'Write a review'}</h3><div className="mt-3"><Stars value={form.rating} interactive size={24} onChange={(rating) => setForm((current) => ({ ...current, rating }))} /></div><input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} maxLength="120" placeholder="Review title (optional)" className="mt-4 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" /><textarea value={form.comment} onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))} minLength="5" maxLength="2000" required rows="4" placeholder="Tell us about your experience" className="mt-3 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" /><div className="mt-3 flex gap-3"><button disabled={submitting} className="rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">{submitting ? 'Saving…' : 'Submit review'}</button><button type="button" onClick={() => setFormOpen(false)} className="text-sm font-semibold text-stone-500">Cancel</button></div></form>}
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4"><div className="flex flex-wrap gap-2">{['', '5', '4', '3', '2', '1'].map((value) => <button key={value || 'all'} onClick={() => setFilter(value)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === value ? 'bg-brand-blue text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>{value ? `${value} stars` : 'All ratings'}</button>)}</div><select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"><option value="recent">Most recent</option><option value="highest">Highest rating</option><option value="lowest">Lowest rating</option></select></div>
    <div className="mt-6 space-y-6">{data.reviews.length === 0 ? <div className="rounded-xl bg-stone-50 px-5 py-8 text-center text-sm text-stone-500">No reviews yet. Be the first to review this product.</div> : data.reviews.map((review) => <article key={review._id} className="border-b border-stone-100 pb-6"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-semibold text-stone-800">{review.user?.name || 'Verified customer'}</p><p className="mt-1 text-xs text-emerald-700">Verified Purchase</p></div><Stars value={review.rating} /></div>{review.title && <h3 className="mt-3 font-semibold text-stone-700">{review.title}</h3>}<p className="mt-1 text-sm leading-6 text-stone-600">{review.comment}</p><p className="mt-2 text-xs text-stone-400">{new Date(review.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</p></article>)}</div>
    {data.hasMore && <button onClick={() => loadReviews(page + 1, true)} className="mt-6 rounded-full border border-brand-blue px-5 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-blue hover:text-white">Load more reviews</button>}
  </section>
}

export default ProductReviews
