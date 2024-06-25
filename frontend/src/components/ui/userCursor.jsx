import { PiCursorFill } from 'react-icons/pi'
import { getBgColor, getTextColor } from '@/lib/getColor'

const UserCursor = ({ email, position }) => {
  return (
    <div
      style={{ top: position?.y || 0, left: position?.x || 0 }}
      className={`pointer-events-none absolute flex items-center transition-all duration-100`}
    >
      <PiCursorFill size={20} color={getBgColor(email).substring(4, 11)} />
      <span className={`font-bold  ${getTextColor(email)}`}>
        {email.substring(0, 1).toUpperCase()}
      </span>
    </div>
  )
}

export default UserCursor
