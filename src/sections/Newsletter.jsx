import { useState } from 'react'
import { Mail } from 'lucide-react'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="bg-brand-blue px-8 py-12 text-center text-white">
      <h2 className="text-2xl font-bold mb-2">Subscribe to Get the Latest Updates</h2>
      <p className="text-sm opacity-90 mb-6">
        Be the first to know about new arrivals, exclusive deals, and wellness tips
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex justify-center gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 rounded-full px-5 py-3 text-sm text-gray-800 focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-brand-gold text-white text-sm font-semibold px-6 rounded-full hover:opacity-90 transition-opacity"
        >
          <Mail size={16} />
          Submit
        </button>
      </form>

      {submitted && (
        <p className="text-sm mt-4 text-brand-gold-light">
          Thanks for subscribing! Check your inbox soon.
        </p>
      )}
    </section>
  )
}

export default Newsletter