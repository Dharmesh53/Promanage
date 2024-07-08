import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MdDeleteOutline } from 'react-icons/md'
import { MdOutlinePersonRemove } from 'react-icons/md'
import { useToast } from '@/components/ui/use-toast'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { IoClose } from 'react-icons/io5'

const TeamOfId = () => {
  const { toast } = useToast()
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const [team, setTeam] = useState({})
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [selectedNewInCharge, setSelectedNewInCharge] = useState('')
  const [newMemberEmails, setNewMemberEmails] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/team/get/${id}`)
        setTeam(res.data.team[0])

        const isMember = res.data.team[0].members.some(
          (member) => member.email == user?.email
        )
        if (!isMember) {
          navigate('/error')
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: error.message,
        })
      }
    }
    fetcher()
  }, [id, user, navigate, toast])

  const handleAddMember = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/team/add-members`,
        {
          teamId: id,
          title: team.title,
          newMembers: newMemberEmails,
        }
      )

      setTeam((prev) => ({
        ...prev,
        members: [...prev.members, ...res.data.members],
      }))

      toast({
        className: 'p-4',
        description: 'Successfully added new members',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        className: 'bg-red-400 p-2',
        title: error.response.data.msg,
      })
    }
  }

  const handleDelete = async (memberId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/team/delete/${id}/${memberId}`
      )

      setTeam((prev) => ({
        ...prev,
        members: prev.members.filter((member) => member._id !== memberId),
      }))

      toast({
        title: res.data.msg,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        className: 'bg-red-400 p-2',
        title: error.response.data.msg,
      })
    }
  }

  const handleSelfRemoval = async () => {
    try {
      await axios.post(`http://localhost:5000/api/team/change-Creator`, {
        teamId: id,
        newInCharge: selectedNewInCharge,
      })

      await handleDelete(user._id)

      toast({
        title:
          'You have successfully left the team and assigned a new in-charge.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        className: 'bg-red-400 p-2',
        title: error.response.data.msg,
      })
    }
  }

  const handleDeleteProject = async () => {
    await axios.delete(`http://localhost:5000/api/team/delete/${id}`)
    console.log('deleting..')
  }

  const addEmailToList = (e) => {
    if (e.key === 'Enter' && input) {
      setNewMemberEmails((prev) => [...prev, input])
      setInput('')
    }
  }

  const removeEmailFromList = (index) => {
    setNewMemberEmails((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex w-full h-full bg-white p-8">
      {team && (
        <div className="flex flex-col w-full">
          <div className="mb-6 flex justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                {team.title}
              </h1>
              <h2 className="text-xl font-light text-gray-600">
                Created by {team.createdBy}
              </h2>
            </div>
            <div>
              <Dialog>
                <DialogTrigger>
                  <MdDeleteOutline
                    size={20}
                    className="text-red-500 cursor-pointer"
                  />
                </DialogTrigger>
                <DialogContent className="font-pops">
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      this team and remove all data from our servers.
                    </DialogDescription>
                    <DialogFooter className="sm:justify-end">
                      <Button
                        type="button"
                        className="bg-red-500 hover:bg-red-700"
                        onClick={() => handleDeleteProject()}
                      >
                        Confirm
                      </Button>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          className="ml-2"
                          variant="secondary"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Members
              </h3>
              <Dialog>
                <DialogTrigger>
                  <Button variant="outline">Add new members</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="font-pops ">
                    <DialogTitle className="my-3">Add new members</DialogTitle>
                    <DialogDescription className="text-black">
                      <Input
                        placeholder="Write new emails and press enter"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="mb-3"
                        onKeyDown={addEmailToList}
                      />
                      <div className="flex flex-wrap gap-3">
                        {newMemberEmails.map((email, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-2 bg-gray-200 rounded"
                          >
                            <span>{email}</span>
                            <button
                              onClick={() => removeEmailFromList(i)}
                              className="text-red-500"
                            >
                              <IoClose />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Button
                        className="my-3 justify-end"
                        onClick={handleAddMember}
                      >
                        Update Team
                      </Button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid min-[1000px]:grid-cols-2 max-[1000px]:grid-cols-1 gap-3 grid-flow-row">
              {team.members?.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between mb-3 p-3 border-b bg-white rounded"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                      {member?.email?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-md font-medium text-gray-800">
                        {member?.name}
                      </div>
                      <div className="text-sm font-light text-gray-600">
                        {member?.email}
                      </div>
                    </div>
                  </div>
                  {hoveredIndex === i &&
                    (member?._id == user?._id ? (
                      <Dialog
                        onOpenChange={(isOpen) =>
                          !isOpen && setHoveredIndex(null)
                        }
                      >
                        {user?.email === team?.createdBy && (
                          <DialogTrigger>
                            <button className="ml-auto text-red-500 p-1 rounded hover:bg-neutral-200 transition">
                              <MdOutlinePersonRemove size={20} />
                            </button>
                          </DialogTrigger>
                        )}
                        <DialogContent className="font-pops">
                          <DialogHeader>
                            <DialogTitle>Choose a New In-charge</DialogTitle>
                            <DialogDescription>
                              To remove yourself from the team, you need to
                              assign a new in-charge.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="my-4">
                            <Select
                              onValueChange={(value) =>
                                setSelectedNewInCharge(value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select new in-charge" />
                              </SelectTrigger>
                              <SelectContent className="font-pops">
                                {team?.members
                                  .filter((member) => member._id !== user._id)
                                  .map((member) => (
                                    <SelectItem
                                      key={member._id}
                                      value={member.email}
                                    >
                                      {member.email}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <DialogFooter className="sm:justify-end">
                            <Button
                              type="button"
                              className="bg-red-500 hover:bg-red-700"
                              onClick={() => handleSelfRemoval()}
                            >
                              Confirm
                            </Button>
                            <DialogClose asChild>
                              <Button
                                type="button"
                                className="ml-2"
                                variant="secondary"
                                onClick={() => setHoveredIndex(null)}
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Dialog
                        onOpenChange={(isOpen) =>
                          !isOpen && setHoveredIndex(null)
                        }
                      >
                        {user?.email === team?.createdBy && (
                          <DialogTrigger>
                            <button className="ml-auto text-red-500 p-1 rounded hover:bg-neutral-200 transition">
                              <MdOutlinePersonRemove size={20} />
                            </button>
                          </DialogTrigger>
                        )}
                        <DialogContent className="font-pops">
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently remove the person from the team.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="sm:justify-end">
                            <Button
                              className="bg-red-500"
                              onClick={() => handleDelete(member._id)}
                            >
                              Delete
                            </Button>
                            <DialogClose asChild>
                              <Button
                                className="ml-2"
                                variant="secondary"
                                onClick={() => setHoveredIndex(null)}
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamOfId
