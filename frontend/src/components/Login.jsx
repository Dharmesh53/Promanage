import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const [isDisabled, setIsDisabled] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError('')
  }

  const sendReq = async () => {
    try {
      const userData = {
        email: data.email,
        password: data.password,
      }
      const res = await axios.post(
        'https://promanage-8loe.onrender.com/api/login',
        userData
      )
      const result = await res.data
      return result
    } catch (error) {
      setError('Failed to log in. Please try again.')
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsDisabled(true)
    const user = await sendReq()
    if (user) {
      dispatch(login())
      navigate('/')
    } else {
      setIsDisabled(false)
    }
  }

  return (
    <>
      <span className="flex justify-center text-2xl">Login</span>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email
          <Input
            name="email"
            type="email"
            className="outline mt-3"
            value={data.email}
            onChange={(e) => handleChange(e)}
            placeholder="Enter your email"
          />
        </label>
        <label htmlFor="password">
          Password
          <Input
            name="password"
            type="password"
            className="outline mt-3"
            value={data.password}
            onChange={(e) => handleChange(e)}
            placeholder="Enter your password"
          />
        </label>
        {error && <span className="text-red-500">{error}</span>}{' '}
        <Button className="border-2" type="submit" disabled={isDisabled}>
          {isDisabled ? (
            <span className="flex">
              <Loader2 className="animate-spin-reverse mr-2" /> Logging in..
            </span>
          ) : (
            'Login'
          )}
        </Button>
        <div className="flex w-full gap-2">
          <Button
            variant="secondary"
            className=""
            onClick={() =>
              setData({ email: 'demo1@test.com', password: 'demo1' })
            }
            disabled={isDisabled}
          >
            Use Demo account 1
          </Button>
          <Button
            variant="secondary"
            className=""
            onClick={() =>
              setData({ email: 'demo2@test.com', password: 'demo2' })
            }
            disabled={isDisabled}
          >
            Use Demo account 2
          </Button>
        </div>
      </form>
      <span className="flex justify-center my-6 gap-2">
        Don't have an Account?
        <Link to="/signup">
          <span className="text-blue-700 underline"> Signup</span>
        </Link>
      </span>
    </>
  )
}

export default Login
