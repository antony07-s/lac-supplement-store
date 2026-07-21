import { useState } from 'react'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'

function Newsletter() {
  const [email, setEmail] = useState('')

 const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success('Thanks for subscribing! Check your inbox soon.')
    setEmail('')
}

  return (
    <section className="bg-brand-blue text-center text-white"><div className="page-shell py-12">
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
          className="min-h-11 flex-1 rounded-full px-5 py-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
        <button
          type="submit"
          className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gold px-6 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <Mail size={16} />
          Submit
        </button>
      </form>

    </div></section>
  )
}

export default Newsletter
