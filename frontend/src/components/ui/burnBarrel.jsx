import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { FaFire } from 'react-icons/fa'
import { IoTrashBinOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { useToast } from './use-toast'
import { debounce } from '@/lib/utils'
import axios from 'axios'

const BurnBarrel = ({ setCards }) => {
  const { toast } = useToast()
  const [active, setActive] = useState(false)
  const user = useSelector((state) => state.auth.user)
  const { id } = useParams()

  const handleSave = useMemo(
    () =>
      debounce(async (newCards, card_id) => {
        try {
          if (id != undefined) {
            await axios.put(
              `https://promanage-8loe.onrender.com/api/project/updateTask/${id}`,
              newCards
            )
          } else {
            console.log(card_id)
            await axios.delete(
              `https://promanage-8loe.onrender.com/api/task/deleteTask/${card_id}/${user?._id}`
            )
          }
        } catch (error) {
          console.log(error.message)
        }
      }, 1000),
    [id, user?._id]
  )

  const handleDragOver = (e) => {
    e.preventDefault()
    setActive(true)
  }

  const handleDragLeave = () => {
    setActive(false)
  }

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData('cardId')

    setCards((pv) => {
      const updatedCards = pv.filter((c) => {
        if (c._id === cardId && user.email !== c.createdBy && c.project) {
          toast({
            title: 'Error',
            description: "You're can't delete a task that you didn't created",
            variant: 'destructive',
          })
          return true
        }
        return c._id !== cardId
      })

      handleSave(updatedCards, cardId)
      return updatedCards
    })

    setActive(false)
  }

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-2 grid p-4 shrink-0 place-content-center cursor-pointer rounded border text-3xl ${
        active
          ? 'border-red-500/40 bg-red-800/20 text-red-500'
          : 'border-neutral-300 bg-neutral-300/20 text-neutral-400/80'
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <IoTrashBinOutline />}
    </div>
  )
}
export default BurnBarrel
