function StaticPageLayout({ title, children }) {
  return (
    <main className="page-shell section-space max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
      <div className="prose prose-sm text-gray-600 space-y-4">
        {children}
      </div>
    </main>
  )
}

export default StaticPageLayout
