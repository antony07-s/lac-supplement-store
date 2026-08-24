const fields = [
  ['botanicalName', 'Botanical Name', 'text'],
  ['whyChoose', 'Why Choose Ayusydah?', 'textarea'],
  ['suitableFor', 'Suitable For', 'text'],
  ['suggestedUse', 'Suggested Use', 'textarea'],
  ['disclaimer', 'Food Supplement Only / Disclaimer', 'textarea'],
  ['videoUrl', 'Product Video URL (optional)', 'url'],
]

export default function ProductContentFields({ form, onChange }) {
  return <section className="space-y-4 rounded-xl border border-stone-200 p-4">
    <div><h2 className="text-sm font-bold text-stone-800">Product content</h2><p className="mt-1 text-xs text-stone-500">Optional structured details display professionally on the product page.</p></div>
    <label className="block text-xs font-semibold text-stone-600">Key Benefits <span className="font-normal">(one benefit per line)</span><textarea name="keyBenefitsText" value={form.keyBenefitsText || ''} onChange={onChange} rows={5} placeholder={'Supports everyday wellness\nConvenient daily format'} className="mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm" /></label>
    {fields.map(([name, label, type]) => <label key={name} className="block text-xs font-semibold text-stone-600">{label}{type === 'textarea' ? <textarea name={name} value={form[name] || ''} onChange={onChange} rows={3} className="mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm" /> : <input type={type} name={name} value={form[name] || ''} onChange={onChange} placeholder={name === 'videoUrl' ? 'https://...mp4 or YouTube/Vimeo URL' : ''} className="mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm" />}</label>)}
  </section>
}
