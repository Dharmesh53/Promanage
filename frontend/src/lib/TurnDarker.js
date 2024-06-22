export default function darkenHexColor(hex, percent) {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '')

  // Parse the r, g, b values
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  // Calculate the darker shade by reducing each component by the given percentage
  r = Math.floor(r * (1 - percent / 100))
  g = Math.floor(g * (1 - percent / 100))
  b = Math.floor(b * (1 - percent / 100))

  // Convert back to hex
  const darkenedHex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`

  return darkenedHex
}
