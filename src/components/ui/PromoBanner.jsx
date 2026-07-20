function PromoBanner({ title, subtitle, ctaText, bgColor = 'bg-brand-blue' }) {
  return (
    <section className={`${bgColor} px-8 py-10 text-center text-white`}>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-sm mb-4 opacity-90">{subtitle}</p>
      <button className="bg-brand-gold text-white text-sm font-semibold px-6 py-2 rounded-full hover:opacity-90 transition-opacity">
        {ctaText}
      </button>
    </section>
  )
}

export default PromoBanner