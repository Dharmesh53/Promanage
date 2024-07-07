import { useEffect, useState } from 'react'
import useGetUser from '@/lib/useGetUser'
import axios from 'axios'

axios.defaults.withCredentials = true

const Dashboard = () => {
  const getUser = useGetUser()
  const [user, setUser] = useState()

  useEffect(() => {
    getUser().then((data) => setUser(data))
  }, [])

  return (
    <div className="w-full h-full flex bg-white">
      {user && (
        <div className="flex justify-center w-full items-center">
          <div className="flex profile-box rounded p-28 gap-8 border border-neutral-300">
            <div className="inline-flex justify-center items-center rounded-full bg-neutral-200 text-xl p-4">
              {user.email.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div>{user.name}</div>
              <div>{user.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
