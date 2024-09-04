import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from './ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'

const Projectform = ({ teams }) => {
  const { toast } = useToast()
  const [value, setValue] = useState(null)
  const [title, setTitle] = useState('')
  const [filteredTeam, setFilteredTeam] = useState([])
  const [clicked, setClicked] = useState(false)
  const user = useSelector((state) => state.auth?.user)

  useEffect(() => {
    if (teams && user?.email) {
      setFilteredTeam(
        teams?.names?.filter((team) => team.createdBy === user.email)
      )
    }
  }, [teams, user?.email])

  const handleSubmit = async () => {
    try {
      setClicked(true)
      const selectedTeam = teams?.names?.find((team) => team.title === value)
      if (!selectedTeam) {
        console.log('Selected team not found')
        setClicked(false)
        return
      }
      const { id: teamId } = selectedTeam
      await axios.post(
        'https://promanage-8loe.onrender.com/api/project/create',
        {
          title,
          teamId,
          createdBy: user.email,
        }
      )
      toast({
        title: 'Done !!',
        description: 'Successfully created project',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setClicked(false)
    }
  }

  return (
    <DialogContent>
      <DialogHeader className="font-pops">
        <DialogTitle className="mb-3">Create new Project</DialogTitle>
        <DialogDescription className="text-black flex flex-col gap-4">
          <Label>
            Title
            <Input
              className="mt-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Label>
          <Label>
            Team
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger className="mt-3">
                <SelectValue>{value || 'Select team for project'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {filteredTeam?.map((item, i) => (
                  <SelectItem value={item.title} className="font-pops" key={i}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Label>
        </DialogDescription>
      </DialogHeader>
      <Button
        onClick={handleSubmit}
        className="mt-3 font-pops"
        disabled={clicked}
      >
        {clicked ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Creating team...
          </>
        ) : (
          'Create'
        )}
      </Button>
    </DialogContent>
  )
}

export default Projectform
