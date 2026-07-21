import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'How long does delivery take?', a: 'Standard delivery typically takes 3-5 business days within Malaysia.' },
  { q: 'Are your products 100% natural?', a: 'Yes, all Ayusydah products are formulated using natural ingredients, clearly listed on each product page.' },
  { q: 'Can I return a product if I\'m not satisfied?', a: 'Yes, unopened products can be returned within 14 days of delivery. See our Return & Refund Policy for details.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship within Malaysia only, with international shipping coming soon.' },
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <main className="page-shell section-space max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {faqs.map((item, index) => (
          <div key={item.q} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-800"
            >
              {item.q}
              <ChevronDown
                size={18}
                className={`transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
              />
            </button>
            {openIndex === index && (
              <p className="px-5 pb-4 text-sm text-gray-600">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}

export default FAQ
