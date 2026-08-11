export const navigationItems = [
  { label: 'HOME', to: '/' },
  { label: 'SHOP', to: '/products' },
  { label: 'HEALTH CONCERNS', to: '/category/Health%20Concerns' },
  { label: 'AYURVEDA', to: '/category/Ayurveda' },
  { label: 'BEAUTY & HAIR', to: '/category/Beauty%20%26%20Hair' },
  { label: 'FOOD & NUTRITION', to: '/category/Food%20%26%20Nutrition' },
  { label: 'BRANDS', to: '/category/Brands' },
]

export const navDropdowns = {
  'HEALTH CONCERNS': { featured: [{ label: 'Bones & Joints' }, { label: 'Digestive Health' }, { label: 'Immune Support' }, { label: 'Energy' }], links: ['Bones & Joints', 'Digestive Health', 'Immune Support', 'Energy', 'Heart Health', 'Sleep Support'] },
  AYURVEDA: { featured: [{ label: 'Ashwagandha' }, { label: 'Turmeric' }, { label: 'Herbal Care' }], links: ['Ashwagandha', 'Turmeric', 'Herbal Care', 'Traditional Wellness'] },
  'BEAUTY & HAIR': { featured: [{ label: 'Collagen' }, { label: 'Hair Care' }, { label: 'Skin Care' }], links: ['Collagen', 'Hair Care', 'Skin Care', 'Beauty Supplements'] },
  'FOOD & NUTRITION': { featured: [{ label: 'Bars' }, { label: 'Honey' }, { label: 'Drinks' }, { label: 'Ready to Eat' }], links: ['Bars', 'Honey', 'Drinks', 'Ready to Eat', 'Shakes'] },
  BRANDS: { featured: [{ label: 'Ayusydah' }, { label: 'PureLeaf' }, { label: 'VitaCore' }, { label: 'WellSpring' }], links: ['Ayusydah', 'PureLeaf', 'VitaCore', 'WellSpring'] },
}
