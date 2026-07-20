import { MapPin } from 'lucide-react'

function UtilityBar() {
  return (
    <div className="bg-gray-100 border-b border-gray-200 px-8 py-2 flex items-center justify-between text-xs text-gray-600">
      <span>Delivery Notice</span>

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
    </div>
  )
}

export default UtilityBar