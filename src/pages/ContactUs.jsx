import { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin } from 'lucide-react'
import api from '../api/axios.js'

function ContactUs() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (submitting) return
        const normalized = {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            subject: form.subject.trim(),
            message: form.message.trim(),
        }
        if (!normalized.name || !/^\S+@\S+\.\S+$/.test(normalized.email) || !normalized.subject || !normalized.message) {
            toast.error('Please complete every field with valid details.')
            return
        }
        setSubmitting(true)
        try {
            await api.post('/contact', normalized)
            toast.success('Thank you. Your enquiry has been sent and our team will respond shortly.')
            setForm({ name: '', email: '', subject: '', message: '' })
        } catch (err) {
            toast.error(err.response?.data?.message || 'The enquiry service is taking too long. Please try again shortly.')
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
                        <a href="mailto:lsmu@hotmail.com" className="hover:text-brand-blue hover:underline">
                            lsmu@hotmail.com
                        </a>
                    </p>
                    <p className="flex items-center gap-3">
                        <Phone size={18} className="text-brand-blue" />
                        <a href="tel:+601172232047" className="hover:text-brand-blue hover:underline">
                            +6011 7223 2047
                        </a>
                    </p>
                    <p className="flex items-center gap-3">
                        <MapPin size={18} className="text-brand-blue" />
                        Kuala Lumpur, Malaysia
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                <label htmlFor="contact-name" className="sr-only">Name</label>
                <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    minLength="2"
                    maxLength="100"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
                <label htmlFor="contact-email" className="sr-only">Email</label>
                <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    maxLength="254"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
                <label htmlFor="contact-subject" className="sr-only">Subject</label>
                <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                    maxLength="200"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
                <label htmlFor="contact-message" className="sr-only">Message</label>
                <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    required
                    rows={4}
                    maxLength="5000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-blue text-white font-semibold py-3 rounded-full transition duration-200 hover:-translate-y-0.5 hover:bg-brand-blue-dark disabled:opacity-70"
                >
                    {submitting ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </main>
    )
}

export default ContactUs
