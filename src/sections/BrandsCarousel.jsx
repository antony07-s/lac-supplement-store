import brands from '../data/brands.json'

function BrandsCarousel() {
  return (
    <section className="px-8 py-12 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Featured Brands
      </h2>
      <div className="flex gap-8 overflow-x-auto pb-4">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="shrink-0 w-40 h-24 border border-gray-200 rounded-lg bg-white flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              loading="lazy"
              className="max-h-16 max-w-[80%] object-contain grayscale hover:grayscale-0 transition-all"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default BrandsCarousel