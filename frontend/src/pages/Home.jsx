import React, { useEffect, useState } from 'react'

const Home = () => {
  const [time, setTime] = useState()

  useEffect(() => {
    const d = new Date()
    setTime(d.getHours())
  }, [])

  return (
    <div className="flex justify-center items-center h-[80vh] home">
      <div className="flex flex-col text-center">
        <span className="text-8xl font-medium">
          Good{' '}
          {5 <= time && time < 12
            ? 'Morning'
            : 12 <= time && time < 18
              ? 'Afternoon'
              : 'Evening'}
        </span>
        <span className="text-2xl font-medium text-amber-400">
          Let's get some work done
        </span>
      </div>
    </div>
  )
}

export default Home
