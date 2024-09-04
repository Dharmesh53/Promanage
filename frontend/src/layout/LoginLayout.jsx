import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  const [image, setImage] = useState(
    'https://res.cloudinary.com/dkux7gsfb/image/upload/v1725445323/board_zffmew.png'
  )
  const [fade, setFade] = useState(false)
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    const images = [
      'https://res.cloudinary.com/dkux7gsfb/image/upload/v1725445323/canvas_gt3qhk.png',
      'https://res.cloudinary.com/dkux7gsfb/image/upload/v1725445323/home_miei3s.png',
      'https://res.cloudinary.com/dkux7gsfb/image/upload/v1725445323/board_zffmew.png',
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

  return (
    <div className="flex flex-col h-screen font-pops overflow-hidden  bg-white">
      <div
        className={`flex justify-center w-full text-lg cursor-pointer select-none`}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span
          className={` flex justify-center p-1 px-6  bg-white z-20 heading transition-all duration-200 ${expanded ? 'w-40 rounded-b-2xl' : 'w-full'}`}
        >
          Promanage
        </span>
      </div>
      <div className="w-full h-full grid-background">
        <div className="w-full grid grid-cols-1 min-[1240px]:grid-cols-3 h-full overflow-hidden ">
          <div className="z-10 p-14 col-span-1 rounded-lg m-auto max-[1240px]:bg-white max-[1240px]:border max-[1240px]:shadow-lg">
            <Outlet />
          </div>
          <div className="col-span-2 z-10 translate-x-[8rem] translate-y-[11rem] hidden min-[1240px]:block">
            <img
              src={image}
              alt="Board"
              className={`transition-opacity scale-125 bg-white fade-out-20  border-[1rem] rounded-lg duration-1000 ${
                fade ? 'opacity-35' : 'opacity-100'
              }`}
            />
          </div>
          <div className="size-[50rem] bottom-[5%] bg-white blur-3xl absolute z-0 hidden min-[1240px]:block"></div>
        </div>
      </div>
    </div>
  )
}

export default Layout
