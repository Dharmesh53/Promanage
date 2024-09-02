// src/components/TeamHeader.js

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
import { MdDeleteOutline } from 'react-icons/md'
import { AiOutlineLoading } from 'react-icons/ai'

const TeamHeader = ({ team, user, handleDeleteProject, loadingAction }) => (

  <div className="mb-6 flex justify-between">

    <div>
      <h1 className="text-3xl font-semibold text-gray-800">{team.title}</h1>
      <h2 className="text-xl font-light text-gray-600">
        Created by {team.createdBy}
      </h2>
    </div>

    <div>
      {user?.email != undefined &&
        team?.createdBy != undefined &&
        user?.email === team?.createdBy && (
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
                  this team and remove all data and tasks assigned to team
                  members.
                </DialogDescription>
                <DialogFooter className="sm:justify-end">
                  <Button
                    type="button"
                    className="bg-red-500 hover:bg-red-700"
                    onClick={handleDeleteProject}
                    disabled={loadingAction === 'deleteProject'}
                  >
                    {loadingAction === 'deleteProject' && (
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
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
    </div>

  </div>
)

export default TeamHeader
