const textColors = [
  'text-[#c7433a]',
  'text-[#3a51c7]',
  'text-[#983ac7]',
  'text-[#c73a59]',
  'text-[#3ac777]',
  'text-[#72c73a]',
  'text-[#3ac7c7]',
  'text-[#c7c73a]',
  'text-[#c7a53a]',
  'text-[#a53ac7]',
]

const bgColors = [
  'bg-[#c7433a]',
  'bg-[#3a51c7]',
  'bg-[#983ac7]',
  'bg-[#c73a59]',
  'bg-[#3ac777]',
  'bg-[#72c73a]',
  'bg-[#3ac7c7]',
  'bg-[#c7c73a]',
  'bg-[#c7a53a]',
  'bg-[#a53ac7]',
]

export function getBgColor(string) {
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % bgColors.length
  return bgColors[index]
}

export function getTextColor(string) {
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % textColors.length
  return textColors[index]
}
