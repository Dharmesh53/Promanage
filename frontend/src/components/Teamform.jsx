import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

const Teamform = ({ user }) => {
  const { toast } = useToast()
  const [members, setMembers] = useState([])
  const [input, setInput] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false) // Add loading state

  useEffect(() => {
    if (user && !members.length) {
      setMembers((prev) => [...prev, user?.email])
    }
  }, [user])

  const addMember = (e) => {
    e.preventDefault()
    if (input.trim() !== '') {
      setMembers((prev) => [...prev, input])
      setInput('')
    }
  }

  const removeMember = (idx) => {
    setMembers((prev) => prev.filter((_, i) => idx !== i))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.post('/api/team/create', {
        title: title,
        members,
        createdBy: user.email,
      })

      if (res.status === 200) {
        toast({
          title: 'Done !!',
          description: 'Successfully created a new team',
          className: 'p-4',
        })
        setMembers([user.email])
        setTitle('')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
        className: 'p-4',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogContent>
      <DialogHeader className="font-pops">
        <DialogTitle className="my-3">Create new Team</DialogTitle>
        <DialogDescription className="flex flex-col gap-3 text-black">
          <Input
            placeholder="Enter Your Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-3"
          />
          <Input
            placeholder="Add new emails and press enter"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mb-3"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addMember(e)
              }
            }}
          />
          <div className="flex flex-col gap-2">
            {members?.map((member, i) => (
              <div key={i} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarFallback>
                      {member?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2">{member}</span>
                </div>
                <Button
                  variant="outline"
                  className="text-red-500"
                  onClick={() => removeMember(i)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={handleSubmit} className="my-3 flex items-center" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2" />}
            {loading ? 'Creating Team...' : 'Make Team'}
          </Button>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  )
}

export default Teamform

