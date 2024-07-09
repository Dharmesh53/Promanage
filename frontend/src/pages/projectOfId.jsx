import Board from '@/components/Board'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import axios from 'axios'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setProject } from '../store/projectSlice'
import BurnBarrel from '@/components/ui/burnBarrel'
import ProjectDetails from '@/components/ProjectDetails'
import ProjectFiles from '@/components/ProjectFiles'
import DrawBoard from '@/components/DrawBoard'

const ProjectOfId = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [cards, setCards] = useState()

  const fetcher = useCallback(async () => {
    const res = await axios.get(`http://localhost:5000/api/project/${id}`)

    const result = res.data

    setCards(result.project.tasks)

    localStorage.setItem(`${id}`, JSON.stringify(result.project.tasks))

    dispatch(setProject(result))
  }, [id])

  useEffect(() => {
    const cardData = localStorage.getItem(`${id}`)
    setCards(cardData ? JSON.parse(cardData) : [])
    fetcher()
  }, [id, fetcher])

  return (
    <div className="h-full relative bg-white p-4">
      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="draw">Draw</TabsTrigger>
        </TabsList>
        <TabsContent value="board">
          {cards && (
            <>
              <Board cards={cards} setCards={setCards} userBoard={false} />
              <BurnBarrel setCards={setCards} />
            </>
          )}
        </TabsContent>
        <TabsContent value="overview">
          <ProjectDetails />
        </TabsContent>
        <TabsContent value="files">
          <ProjectFiles />
        </TabsContent>
        <TabsContent value="draw">
          <DrawBoard className="w-full h-[88vh]" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProjectOfId
