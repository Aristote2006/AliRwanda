// Rwanda District Delivery Fee Configuration
// Fees are in RWF (Rwandan Francs)

const DELIVERY_FEES = {
  // Kigali City districts - lower fees
  'Gasabo': 2000,
  'Kicukiro': 2000,
  'Nyarugenge': 2000,
  
  // Eastern Province districts
  'Bugesera': 3500,
  'Gatsibo': 4000,
  'Kayonza': 4000,
  'Kirehe': 4500,
  'Ngoma': 4000,
  'Nyagatare': 4500,
  'Rwamagana': 3500,
  
  // Northern Province districts
  'Burera': 4000,
  'Gakenke': 4000,
  'Gicumbi': 3500,
  'Musanze': 4000,
  'Rulindo': 4000,
  
  // Southern Province districts
  'Gisagara': 4000,
  'Huye': 3500,
  'Kamonyi': 3500,
  'Muhanga': 3000,
  'Nyamagabe': 4500,
  'Nyanza': 3500,
  'Nyaruguru': 4500,
  'Ruhango': 3500,
  
  // Western Province districts
  'Karongi': 4500,
  'Ngororero': 4500,
  'Nyabihu': 4000,
  'Nyamasheke': 5000,
  'Rubavu': 3500,
  'Rutsiro': 4500,
  'Rusizi': 5000,
}

/**
 * Get delivery fee for a specific district
 * @param {string} district - The district name
 * @returns {number} - Delivery fee in RWF
 */
export const getDeliveryFee = (district) => {
  if (!district) {
    // Default fee if no district specified
    return 3000
  }
  
  // Normalize district name (case-insensitive, trim whitespace)
  const normalizedDistrict = district.trim().toLowerCase()
  
  // Find matching district (case-insensitive)
  const matchedDistrict = Object.keys(DELIVERY_FEES).find(
    (key) => key.toLowerCase() === normalizedDistrict
  )
  
  if (matchedDistrict) {
    return DELIVERY_FEES[matchedDistrict]
  }
  
  // Default fee for unknown districts
  return 4000
}

/**
 * Get all available districts
 * @returns {string[]} - Array of district names
 */
export const getDistricts = () => {
  return Object.keys(DELIVERY_FEES).sort()
}

/**
 * Get delivery fee range
 * @returns {object} - Object with min and max fees
 */
export const getDeliveryFeeRange = () => {
  const fees = Object.values(DELIVERY_FEES)
  return {
    min: Math.min(...fees),
    max: Math.max(...fees),
  }
}

export default DELIVERY_FEES
