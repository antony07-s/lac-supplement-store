function PromoBanner({ title, subtitle, ctaText, bgColor = 'bg-brand-blue' }) {
  return (
    <section className={`${bgColor} text-center text-white`}><div className="page-shell py-12">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-2">{title}</h2>
      <p className="mx-auto max-w-xl text-sm leading-6 opacity-90 mb-5">{subtitle}</p>
      <button className="min-h-11 rounded-full bg-brand-gold px-6 text-sm font-bold text-white hover:opacity-90 transition-opacity">
        {ctaText}
      </button>
    </div></section>
  )
}

export default PromoBanner
