import { MapPin } from 'lucide-react'

function UtilityBar() {
  return (
    <div className="border-b border-blue-950/10 bg-[#eef4ff] text-xs text-stone-600"><div className="page-shell flex items-center justify-between gap-3 py-2">
      <span className="font-medium">Free delivery on orders over RM 80</span>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 hover:text-brand-blue cursor-pointer">
          <MapPin size={14} />
          Store Locator
        </span>
        <select className="bg-transparent border-none text-xs cursor-pointer hover:text-brand-blue focus:outline-none">
          <option>India</option>
          <option>Malaysia</option>
        </select>
      </div>
    </div></div>
  )
}

export default UtilityBar
