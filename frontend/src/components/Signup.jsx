import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { Input } from './ui/input'
import { Button } from './ui/button'

const Signup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [fade, setFade] = useState(false)
  const [image, setImage] = useState('../../assets/board.png')
  const [data, setData] = useState({
    name: '',
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
    }, 2200)

    return () => clearInterval(id)
  }, [])
  const sendReq = async () => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
      }
      const res = await axios
        .post('/api/signup', userData)
        .catch((e) => console.log(e))
      const result = await res.data
      return result
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = await sendReq()
    if (user) {
      dispatch(login())
      navigate('/')
    }
  }

  return (
    <div className="w-[40%] flex h-full">
      <div className="z-10 w-2/3 m-auto">
        <span className="flex justify-center text-2xl">Sign Up</span>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <label htmlFor="name">
            Name
            <Input
              name="name"
              type="text"
              className="outline mt-3"
              value={data.name}
              onChange={(e) => handleChange(e)}
              placeholder="Enter your name"
            />
          </label>
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
          <Button className="border-2" type="submit">
            Sign up
          </Button>
        </form>
        <span className="flex justify-center my-6 gap-2">
          Already have an Account
          <Link to="/">
            <span className="text-blue-700 underline">Login</span>
          </Link>
        </span>
      </div>
      <img
        src={image}
        alt="Board"
        className={`absolute right-[-40%] top-[10%] rounded border fade-out-20 transition-opacity duration-1000 ${
          fade ? 'opacity-35' : 'opacity-100'
        }`}
      />
    </div>
  )
}

export default Signup
