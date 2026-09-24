import { Link } from 'react-router-dom'

export default function NotFound() {
  return <section className="page-shell section-space max-w-2xl text-center">
    <p className="eyebrow">404</p>
    <h1 className="section-title mt-2">Page not found</h1>
    <p className="mx-auto mt-4 max-w-md text-stone-600">The page you requested is unavailable or may have moved.</p>
    <div className="mt-7 flex flex-wrap justify-center gap-3">
      <Link to="/" className="rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-blue-dark">Return home</Link>
      <Link to="/products" className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-brand-blue hover:bg-stone-50">Shop products</Link>
    </div>
  </section>
}
