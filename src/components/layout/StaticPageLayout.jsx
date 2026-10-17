import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

function StaticPageLayout({ title, children }) {
    return (
        <main className="page-shell section-space max-w-4xl">
            <Link to="/" className="mb-7 inline-flex min-h-10 items-center gap-1 rounded-full pr-3 text-sm font-semibold text-stone-600 transition hover:text-brand-blue focus-visible:outline-offset-2">
                <ChevronLeft size={18} /> Back to Home
            </Link>
            <header className="mb-7 border-b border-stone-200 pb-6 sm:mb-9 sm:pb-8">
                <p className="eyebrow mb-2">AYUSYDAH</p>
                <h1 className="text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h1>
            </header>
            <div className="surface-card px-5 py-6 text-[15px] leading-7 text-gray-600 sm:px-9 sm:py-9 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-gray-900 [&_h3]:mt-6 [&_h3]:font-bold [&_h3]:text-gray-800 [&_a]:font-semibold [&_a]:text-brand-blue [&_a]:underline-offset-4 hover:[&_a]:underline [&_li]:pl-1 [&_ol]:space-y-2 [&_ul]:space-y-2">
                {children}
            </div>
        </main>
    )
}

export default StaticPageLayout
