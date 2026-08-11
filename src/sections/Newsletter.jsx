import { useState } from 'react'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios.js'
import Reveal from '../components/Frame/Reveal.jsx'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || submitting) {
      toast.error('Enter a valid email address')
      return
    }
    setSubmitting(true)
    try {
      const response = await api.post('/newsletter', { email: normalizedEmail })
      toast.success(response.data.message)
      setEmail('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'The subscription service is taking too long. Please try again shortly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-brand-blue text-center text-white">
      <Reveal direction="scale" className="page-shell py-12">
        <h2 className="text-2xl font-bold mb-2">A little wellness in your inbox</h2>
        <p className="text-sm opacity-90 mb-6">
          Be the first to know about new arrivals, exclusive deals, and wellness tips
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-md flex-col justify-center gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
           className="min-h-11 flex-1 rounded-full border border-transparent bg-white px-5 py-3 text-sm text-stone-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-brand-blue-dark transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 disabled:opacity-70"
          >
            <Mail size={16} />
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </Reveal>
    </section>
  )
}

export default Newsletter
