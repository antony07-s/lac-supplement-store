import { useState } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'

const regions = ['Malaysia', 'India']

function UtilityBar() {
  const [regionOpen, setRegionOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('India')

  return (
    <div className="border-b border-blue-950/10 bg-[#eef4ff] text-xs text-stone-600">
      <div className="page-shell flex items-center justify-between gap-3 py-2">
        <span className="font-medium">Free delivery on orders over RM 80</span>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 hover:text-brand-blue cursor-pointer">
            <MapPin size={14} />
            Store Locator
          </span>

          <div className="relative">
            <button
              onClick={() => setRegionOpen(!regionOpen)}
              className="flex items-center gap-1 hover:text-brand-blue cursor-pointer"
            >
              {selectedRegion}
              <ChevronDown size={12} className={`transition-transform ${regionOpen ? 'rotate-180' : ''}`} />
            </button>

            {regionOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-lg py-1 z-[60]">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      setSelectedRegion(region)
                      setRegionOpen(false)
                    }}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-blue-50 hover:text-brand-blue ${
                      region === selectedRegion ? 'text-brand-blue font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UtilityBar