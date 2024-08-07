import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import axios from 'axios'
import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { Button } from './button'
import { format } from 'date-fns'
import { SlCalender } from 'react-icons/sl'
import { Calendar } from '@/components/ui/calendar'
import { motion } from 'framer-motion'
import { Input } from './input'
import { Label } from './label'
import { useSelector } from 'react-redux'
import { useToast } from './use-toast'
import { useEffect } from 'react'

const AddCard = ({ column, setCards, userBoard }) => {
  const [text, setText] = useState('')
  const [date, setDate] = useState(new Date())
  const [priority, setPriority] = useState('')
  const [assignee, setAssignee] = useState('')
  const [clicked, setClicked] = useState(false)
  const [assigneList, setAssigneeList] = useState([])
  const { toast } = useToast()

  const teams = useSelector((state) => state.project?.project?.project?.teams)
  const user = useSelector((state) => state.auth.user)

  let id = ''
  if (!userBoard) {
    id = useSelector((state) => state.project?.project?.project?._id)
  }

  useEffect(() => {
    let nestedList = teams?.map((team) =>
      team.users.map((user) => {
        return {
          name: user.name,
          email: user.email,
          team: team._id,
        }
      })
    )
    //
    //wowowwowowowwww....
    setAssigneeList(
      [...new Set(nestedList?.flat().map((obj) => JSON.stringify(obj)))].map(
        (str) => JSON.parse(str)
      )
    )
  }, [teams])

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      setClicked((prev) => !prev)

      if (!text.trim().length) return

      let assigneeObject = { name: user.name, email: user.email }

      if (!userBoard) {
        const selectedAssignee = assigneList.find((a) => a.email === assignee)
        if (selectedAssignee) {
          assigneeObject = {
            name: selectedAssignee.name,
            email: selectedAssignee.email,
            team: selectedAssignee.team,
          }
        }
      }

      const newCard = {
        status: column,
        title: text.trim(),
        assigneeObject,
        priority,
        due: date,
        createdBy: user.email,
      }

      const res = await axios.post(
        `https://promanage-backend-i7zo.onrender.com/api/project/createTask?id=${id}`,
        newCard
      )

      if (res.status === 200) {
        toast({
          title: 'Done!!',
          description: 'Succesfully created task',
        })
        setCards((pv) => [...pv, res.data.task])
      }

      setClicked((prev) => !prev)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      })
    }
  }
  return (
    <Dialog>
      <DialogTrigger>
        <motion.button
          layout
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-500"
        >
          <span>Add task</span>
          <FiPlus />
        </motion.button>
      </DialogTrigger>
      <DialogContent className="font-pops">
        <DialogHeader>
          <DialogTitle className="mb-4">Create Task</DialogTitle>
          <DialogDescription className="text-black flex flex-col gap-3">
            <Label htmlFor="title" className="font-md">
              Title
            </Label>
            <Input
              name="title"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {!userBoard && (
              <>
                <Label htmlFor="assignee">Assignee</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee for task" />
                  </SelectTrigger>
                  <SelectContent className="font-pops">
                    {assigneList?.map((al, i) => {
                      return (
                        <SelectItem key={i} value={al.email}>
                          {al.email}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </>
            )}
            <Label htmlFor="calender">Due date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={`
                    "justify-start text-left font-normal",
                    ${!date && 'text-muted-foreground'}`}
                >
                  <SlCalender className="mr-2 size-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="font-pops">
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSubmit}
              disabled={clicked}
              className={`${clicked && 'bg-gray-400 cursor-progress'}`}
            >
              Create Task
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddCard
