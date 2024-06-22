const colors = [
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

export default function getColor(string) {
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colors.length
  return colors[index]
}
