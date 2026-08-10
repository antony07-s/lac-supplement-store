import { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin } from 'lucide-react'
import api from '../api/axios.js'

function ContactUs() {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (submitting) return
        setSubmitting(true)
        try {
            await api.post('/contact', form)
            toast.success('Message sent! We\'ll get back to you soon.')
            setForm({ name: '', email: '', message: '' })
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send message. Try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="page-shell section-space grid max-w-4xl gap-10 md:grid-cols-2">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>
                <div className="space-y-4 text-sm text-gray-600">
                    <p className="flex items-center gap-3">
                        <Mail size={18} className="text-brand-blue" />
                        support@ayusydah.com
                    </p>
                    <p className="flex items-center gap-3">
                        <Phone size={18} className="text-brand-blue" />
                        +60 3-1234 5678
                    </p>
                    <p className="flex items-center gap-3">
                        <MapPin size={18} className="text-brand-blue" />
                        Kuala Lumpur, Malaysia
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-blue"
                />
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-blue"
                />
                <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    required
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-blue"
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-blue text-white font-semibold py-3 rounded-full hover:bg-brand-blue-dark transition-colors disabled:opacity-70"
                >
                    {submitting ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </main>
    )
}

export default ContactUs