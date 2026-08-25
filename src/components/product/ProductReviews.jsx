import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios.js'
import { useAuth } from '../../context/AuthContext.jsx'

function Stars({ value, interactive = false, onChange }) {
  return <div className="flex gap-1" aria-label={`${value} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" disabled={!interactive} onClick={() => onChange(star)} className={interactive ? 'cursor-pointer' : 'cursor-default'} aria-label={`${star} star${star !== 1 ? 's' : ''}`}><Star size={interactive ? 22 : 16} className={star <= value ? 'fill-brand-gold text-brand-gold' : 'text-stone-300'} /></button>)}</div>
}

function ProductReviews({ productId, refreshProduct }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [eligibility, setEligibility] = useState(null)
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadReviews = () => api.get(`/reviews/product/${productId}`).then((res) => setReviews(res.data)).catch(() => setReviews([]))
  useEffect(() => { loadReviews() }, [productId])
  useEffect(() => {
    if (!user) { setEligibility(null); return }
    api.get(`/reviews/eligibility/${productId}`).then((res) => setEligibility(res.data)).catch(() => setEligibility(null))
  }, [productId, user])

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/reviews', { productId, rating, title, comment })
      toast.success('Review submitted for approval')
      setEligibility({ eligible: false, reviewStatus: 'pending' })
      setTitle(''); setComment('')
      refreshProduct?.()
    } catch (err) { toast.error(err.response?.data?.message || 'Unable to submit review') } finally { setSubmitting(false) }
  }

  return <section id="reviews" className="mt-16 border-t border-stone-200 pt-12">
    <h2 className="section-title mb-2">Customer reviews</h2>
    <p className="mb-7 text-sm text-stone-500">Reviews from verified customers.</p>
    {eligibility?.eligible && <form onSubmit={submit} className="mb-8 rounded-2xl border border-stone-200 bg-stone-50 p-5"><h3 className="mb-3 font-bold text-stone-800">Write a review</h3><Stars value={rating} interactive onChange={setRating} /><input value={title} onChange={(e) => setTitle(e.target.value)} maxLength="120" placeholder="Review title (optional)" className="mt-4 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm" /><textarea value={comment} onChange={(e) => setComment(e.target.value)} minLength="5" maxLength="2000" required rows="4" placeholder="Tell us about your experience" className="mt-3 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm" /><button disabled={submitting} className="mt-3 rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit review'}</button></form>}
    {eligibility?.reviewStatus && <p className="mb-6 rounded-lg bg-stone-100 px-4 py-3 text-sm text-stone-600">Your review is {eligibility.reviewStatus}.</p>}
    {reviews.length === 0 ? <p className="text-sm text-stone-500">No published reviews yet.</p> : <div className="space-y-5">{reviews.map((review) => <article key={review._id} className="border-b border-stone-100 pb-5"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold text-stone-800">{review.user?.name || 'Verified customer'}</p><Stars value={review.rating} /></div>{review.title && <h3 className="mt-2 font-semibold text-stone-700">{review.title}</h3>}<p className="mt-1 text-sm leading-6 text-stone-600">{review.comment}</p><p className="mt-2 text-xs text-stone-400">Verified purchase · {new Date(review.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</p></article>)}</div>}
  </section>
}

export default ProductReviews
