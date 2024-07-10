import axios from 'axios'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { RxHamburgerMenu } from 'react-icons/rx'
import { IoIosArrowDown } from 'react-icons/io'
import useGetUser from '@/lib/useGetUser'
import Navbar from '@/components/Navbar'
import { setUser } from '../store/authSlice'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { logout } from '../store/authSlice'
import { useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster'

const Layout = () => {
  const [toggle, setToggle] = useState(true)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const getUser = useGetUser()

  const sendReq = async () => {
    const res = await axios.post('https://promanage-backend-i7zo.onrender.com/api/logout', null, {
      withCredentials: true,
    })
    if (res.status == 200) {
      return res
    }
    throw new Error('Unable to Logout')
  }
  const handleLogout = () => {
    sendReq().then(() => {
      dispatch(logout())
      navigate('/')
    })
  }

  useEffect(() => {
    const fetcher = () => {
      getUser().then((data) => dispatch(setUser(data)))
    }
    fetcher()
  }, [])

  const user = useSelector((state) => state.auth.user)

  return (
    <div className="flex flex-col h-screen font-pops ">
      <div className="flex justify-between border-b bg-white">
        <Button
          variant="ghost"
          onClick={() => {
            setToggle((prev) => !prev)
          }}
          className=" m-0"
        >
          <RxHamburgerMenu size={18} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center ">
              <Avatar className="scale-75 ">
                {user?.image && <AvatarImage src={user.image} />}
                <AvatarFallback>
                  {user ? user?.email.slice(0, 2).toUpperCase() : '--'}
                </AvatarFallback>
              </Avatar>
              <IoIosArrowDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-pops mr-1">
            <DropdownMenuLabel>
              <div className="text-sm">My Account</div>
              <div className="text-xs">{user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex overflow-auto">
        <div
          className={`transition-all  ${
            toggle
              ? 'min-[800px]:w-[20%] max-w-64 opacity-100 translate-x-0 max-[800px]:w-[25%]'
              : 'w-0 opacity-0 -translate-x-full '
          }
          `}
        >
          <Navbar user={user} />
        </div>
        <div className="w-full overflow-hidden">
          <Outlet />
        </div>
        <Toaster />
      </div>
    </div>
  )
}

export default Layout
