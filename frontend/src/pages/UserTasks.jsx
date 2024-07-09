import Board from '@/components/Board'
import axios from 'axios'
import { useEffect, useState } from 'react'
import BurnBarrel from '@/components/ui/burnBarrel'

const UserTasks = () => {
  const [userCards, setUserCards] = useState()

  const fetcher = async () => {
    const res = await axios.get(`http://localhost:5000/api/task/`)
    setUserCards(res.data.tasks)
    localStorage.setItem('userCards', JSON.stringify(res.data.tasks))
  }

  useEffect(() => {
    const cardData = localStorage.getItem('userCards')
    setUserCards(cardData ? JSON.parse(cardData) : [])
    fetcher()
  }, [])

  return (
    <div className="h-full relative bg-white p-4 pt-0">
      <div className="my-4 font-medium text-xl">Your Tasks</div>
      {userCards && (
        <>
          <Board cards={userCards} setCards={setUserCards} userBoard={true} />
          <BurnBarrel setCards={setUserCards} />
        </>
      )}
    </div>
  )
}

export default UserTasks
