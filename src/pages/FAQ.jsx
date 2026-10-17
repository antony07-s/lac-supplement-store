import { useState } from 'react'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const faqs = [
    { q: 'How long does delivery take?', a: 'Standard delivery typically takes 3-5 business days within Malaysia.' },
    { q: 'Are your products 100% natural?', a: 'Yes, all Ayusydah products are formulated using natural ingredients, clearly listed on each product page.' },
    { q: 'Can I return a product if I\'m not satisfied?', a: 'Yes, unopened products can be returned within 14 days of delivery. See our Return & Refund Policy for details.' },
    { q: 'Do you ship internationally?', a: 'Currently we ship within Malaysia only, with international shipping coming soon.' },
]

function FAQ() {
    const [openIndex, setOpenIndex] = useState(null)

    return (
        <main className="page-shell section-space max-w-4xl">
            <Link to="/" className="mb-7 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-stone-600 hover:text-brand-blue"><ChevronLeft size={17} /> Back to Home</Link>
            <header className="mb-8"><p className="eyebrow mb-2">Here to help</p><h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Frequently Asked Questions</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">Helpful answers about delivery, products, and your order.</p></header>
            <div className="space-y-3">
                {faqs.map((item, index) => (
                    <div key={item.q} className={`overflow-hidden rounded-2xl border bg-white transition-colors ${openIndex === index ? 'border-brand-blue/30 shadow-sm' : 'border-stone-200'}`}>
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            aria-expanded={openIndex === index}
                            className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-gray-800 sm:px-6"
                        >
                            {item.q}
                            <ChevronDown size={18} className={`shrink-0 text-brand-blue transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
                        </button>
                        {openIndex === index && (
                            <p className="border-t border-stone-100 px-5 py-4 text-sm leading-6 text-gray-600 sm:px-6">{item.a}</p>
                        )}
                    </div>
                ))}
            </div>
        </main>
    )
}

export default FAQ
