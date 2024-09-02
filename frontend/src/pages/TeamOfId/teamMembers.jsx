import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { MdOutlinePersonRemove } from 'react-icons/md'
import { AiOutlineLoading } from 'react-icons/ai'
import { useState } from 'react'

const TeamMembers = ({
  team,
  user,
  handleAddMember,
  handleDelete,
  handleSelfRemoval,
  loadingAction,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [input, setInput] = useState('')
  const [newMemberEmails, setNewMemberEmails] = useState([])
  const [selectedNewInCharge, setSelectedNewInCharge] = useState('')

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
    <div>
      <div className="flex justify-between mb-6 ">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Team Members</h3>
        {user?.email != undefined &&
          team?.createdBy != undefined &&
          user?.email === team?.createdBy && (
            <Dialog >
              <DialogTrigger>
                <Button type="button">Add Members</Button>
              </DialogTrigger>
              <DialogContent className="max-h-96 overflow-scroll font-pops">
                <DialogHeader>
                  <DialogTitle>Add Members</DialogTitle>
                  <DialogDescription>
                    Enter email addresses of new members you want to add.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  type="text"
                  placeholder="Enter email and press Enter"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={addEmailToList}
                />
                <ul className="mt-2">
                  {newMemberEmails.map((email, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm rounded my-1 justify-between border p-2"
                    >
                      <span>{email}</span>
                      <IoClose
                        className="cursor-pointer"
                        onClick={() => removeEmailFromList(index)}
                      />
                    </li>
                  ))}
                </ul>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={() => handleAddMember(newMemberEmails)}
                    disabled={loadingAction === 'addMembers'}
                  >
                    {loadingAction === 'addMembers' && (
                      <AiOutlineLoading
                        size={20}
                        className="animate-spin-reverse mr-2"
                      />
                    )}
                    Add
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>)}
      </div>

      <div className="grid min-[1000px]:grid-cols-2 max-[1000px]:grid-cols-1 gap-3 grid-flow-row">
        {team?.members?.map((member, index) => (
          <div
            key={member._id}
            className="flex justify-between items-center p-2 border-b mb-2"
            onMouseEnter={() => setHoveredIndex(index)}
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
            {user?.email != undefined &&
              team?.createdBy != undefined &&
              user?.email === team?.createdBy &&
              hoveredIndex === index &&
              member._id !== user._id && (
                <Dialog
                  onOpenChange={(isOpen) =>
                    !isOpen && setHoveredIndex(null)
                  }
                >
                  <DialogTrigger>
                    <MdOutlinePersonRemove
                      className="text-red-500 cursor-pointer"
                    />
                  </DialogTrigger>
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
                        disabled={loadingAction === 'removeMember'}
                      >
                        {loadingAction === 'removeMember' && (
                          <AiOutlineLoading
                            size={20}
                            onClick={() => handleDelete(member._id)}
                            className="animate-spin-reverse mr-2"
                          />
                        )}
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
              )}
          </div>
        ))}
      </div>

      {user?.email != undefined &&
        team?.createdBy != undefined &&
        user?.email === team?.createdBy && (
          <Dialog>
            <DialogTrigger>
              <Button type="button" className="mt-4">
                Leave Team
              </Button>
            </DialogTrigger>
            <DialogContent className='font-pops'>
              <DialogHeader>
                <DialogTitle>Leave Team</DialogTitle>
                <DialogDescription>
                  Select a new in-charge before you leave the team.
                </DialogDescription>
              </DialogHeader>
              <Select onValueChange={setSelectedNewInCharge}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new in-charge" />
                </SelectTrigger>
                <SelectContent className='font-pops'>
                  {team.members
                    .filter((m) => m?.email !== user?.email)
                    .map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        {member.name} ({member.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => handleSelfRemoval(selectedNewInCharge)}
                  disabled={loadingAction === 'selfRemoval'}
                >
                  {loadingAction === 'selfRemoval' && (
                    <AiOutlineLoading
                      size={20}
                      className="animate-spin-reverse mr-2"
                    />
                  )}
                  Confirm
                </Button>
                <DialogClose asChild>
                  <Button type="button" className="ml-2" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
    </div>
  )
}

export default TeamMembers
