import { useState, useEffect } from 'react'
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
  const [image, setImage] = useState('../../assets/board.png')
  const [fade, setFade] = useState(false)
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const [isDisabled, setIsDisabled] = useState(false)

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  useEffect(() => {
    const images = [
      '../../assets/board.png',
      '../../assets/canvas.png',
      '../../assets/home.png',
    ]

    let idx = 0

    const id = setInterval(() => {
      setFade(true)

      setTimeout(() => {
        setFade(false)
        setImage(images[idx])
        idx = ++idx % images.length
      }, 600)
    }, 3000)

    return () => clearInterval(id)
  }, [])

  const sendReq = async () => {
    try {
      const userData = {
        email: data.email,
        password: data.password,
      }
      const res = await axios.post('/api/login', userData)
      const result = await res.data
      return result
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsDisabled(true)
    const user = await sendReq()
    if (user) {
      dispatch(login())
      navigate('/')
    }
    setIsDisabled(false)
  }

  return (
    <div className="w-full flex h-full overflow-hidden">
      <div className="z-10  m-auto">
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
              className="flex-grow"
              onClick={() =>
                setData({ email: 'demo1@test.com', password: 'demo1' })
              }
              disabled={isDisabled}
            >
              Use Demo account 1
            </Button>
            <Button
              variant="secondary"
              className="flex-grow"
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
          Don't have an Account
          <Link to="/signup">
            <span className="text-blue-700 underline"> Signup</span>
          </Link>
        </span>
      </div>
      <div className="pt-32 mr-[-40rem] scale-120 ">
        <img
          src={image}
          alt="Board"
          className={`transition-opacity fade-out-20 border rounded duration-1000 ${
            fade ? 'opacity-35' : 'opacity-100'
          }`}
        />
      </div>
    </div>
  )
}

export default Login
