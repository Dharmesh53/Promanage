import { LuMousePointer2 } from 'react-icons/lu'
import getColor from '@/lib/getColor'

const UserCursor = ({ email, position }) => {
  const colorClass = getColor(email)
  return (
    <div
      style={{ top: position?.y || 0, left: position?.x || 0 }}
      className={`absolute flex items-center z-[0]`}
    >
      <LuMousePointer2 size={20} color={colorClass.substring(3)} />
      <span className={`ml-1 ${colorClass.substring(3)}`}>
        {email.substring(0, 1).toUpperCase()}
      </span>
    </div>
  )
}

export default UserCursor
