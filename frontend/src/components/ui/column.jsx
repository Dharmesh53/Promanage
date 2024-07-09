import { useState, useCallback, useMemo } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Card from './card'
import AddCard from './addCard'
import { DropIndicator } from './card'
import { useSelector } from 'react-redux'
import { debounce } from '@/lib/utils'

const Column = ({
  title,
  bgColor,
  txtColor,
  cards,
  column,
  setCards,
  userBoard,
}) => {
  const [active, setActive] = useState(false)
  const project = useSelector((state) => state.project?.project?.project)
  const user = useSelector((state) => state.auth?.user)
  const { id } = useParams()

  const handleSave = useMemo(
    () =>
      debounce(async (newCards) => {
        try {
          await axios.put(
            `http://localhost:5000/api/project/updateTask/${id}`,
            newCards
          )
        } catch (error) {
          console.log(error.message)
        }
      }, 1000),
    [id]
  )

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData('cardId', card._id)
  }

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData('cardId')

    setActive(false)
    clearHighlights()

    const indicators = getIndicators()
    const { element } = getNearestIndicator(e, indicators)

    const before = element.dataset.before || '-1'

    if (before !== cardId) {
      let copy = [...cards]

      let cardToTransfer = copy.find((c) => c._id === cardId)
      if (!cardToTransfer) return
      cardToTransfer = { ...cardToTransfer, status: column }

      copy = copy.filter((c) => c._id !== cardId)

      const moveToBack = before === '-1'

      if (moveToBack) {
        copy.push(cardToTransfer)
      } else {
        const insertAtIndex = copy.findIndex((el) => el._id === before)
        if (insertAtIndex === undefined) return

        copy.splice(insertAtIndex, 0, cardToTransfer)
      }

      setCards(() => {
        handleSave(copy)
        return copy
      })
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    highlightIndicator(e)

    setActive(true)
  }

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect()

        const offset = e.clientY - (box.top + DISTANCE_OFFSET)

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child }
        } else {
          return closest
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    )

    return el
  }

  const getIndicators = useCallback(() => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`))
  }, [column])

  const clearHighlights = useCallback(
    (els) => {
      const indicators = els || getIndicators()

      indicators.forEach((i) => {
        i.style.opacity = '0'
      })
    },
    [getIndicators]
  )

  const highlightIndicator = useCallback(
    (e) => {
      const indicators = getIndicators()

      clearHighlights(indicators)

      const el = getNearestIndicator(e, indicators)

      el.element.style.opacity = '1'
    },
    [clearHighlights, getIndicators]
  )
  const handleDragLeave = () => {
    clearHighlights()
    setActive(false)
  }

  const filteredCards = cards.filter((c) => c.status === column)

  return (
    <div className="w-[24.6%] h-[80vh]  shrink-0 relative">
      <div
        className={`flex items-center absolute w-full justify-between font-medium ${bgColor} ${txtColor} rounded p-2`}
      >
        <h3>{title}</h3>
        <span>{filteredCards.length}</span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full rounded p-2 pt-12 flex flex-col overflow-y-scroll transition-colors ${
          active ? 'bg-neutral-200/40' : 'bg-neutral-50'
        }`}
      >
        {filteredCards.map((c) => {
          return (
            <Card
              key={c._id}
              {...c}
              setCards={setCards}
              userBoard={userBoard}
              handleDragStart={handleDragStart}
            />
          )
        })}
        <DropIndicator beforeId={null} column={column} />
        {user?.email === project?.createdBy && (
          <AddCard column={column} setCards={setCards} userBoard={userBoard} />
        )}
      </div>
    </div>
  )
}

export default Column
