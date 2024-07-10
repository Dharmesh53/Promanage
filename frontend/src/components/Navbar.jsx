import axios from 'axios'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GrTask } from 'react-icons/gr'
import { HiOutlineInbox } from 'react-icons/hi2'
import { GrProjects } from 'react-icons/gr'
import { RiTeamLine } from 'react-icons/ri'
import { FaPlus } from 'react-icons/fa6'
import { Button } from './ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import ProjectForm from './Projectform'
import TeamForm from './Teamform'

axios.defaults.withCredentials = true

const Navbar = ({ user }) => {
  const [teams, setTeams] = useState([])
  const location = useLocation()

  const handleTeams = async () => {
    const res = await axios.get('https://promanage-backend-i7zo.onrender.com/api/getUserTeams')
    setTeams(res.data)
  }

  const isActive = (path) => {
    return location.pathname.includes(path)
  }

  return (
    <aside className="h-[95.7vh]  w-full bg-white text-neutral-600">
      <nav className="h-full border-r">
        <div className="flex flex-col gap-2">
          <Link
            to="/tasks"
            className={`flex items-center gap-2 p-2 m-1 rounded-lg hover:bg-amber-200   duration-300 transition-colors ${
              isActive('/tasks')
                ? 'bg-amber-200 text-amber-700 font-medium hover:text-amber-700 '
                : 'hover:text-neutral-800'
            }`}
          >
            <GrTask size={18} />
            My Tasks
          </Link>
          {/* <Link */}
          {/*   to="/inbox" */}
          {/*   className={`flex items-center gap-2 p-2 m-1 rounded-lg hover:bg-amber-200   duration-300 transition-colors ${ */}
          {/*     isActive('/inbox') */}
          {/*       ? 'bg-amber-200 text-amber-700 font-medium hover:text-amber-700' */}
          {/*       : 'hover:text-neutral-800' */}
          {/*   }`} */}
          {/* > */}
          {/*   <HiOutlineInbox size={18} /> */}
          {/*   Inbox */}
          {/* </Link> */}
          <div>
            <div
              className={`flex items-center justify-between  p-2 m-1 rounded-lg hover:bg-amber-200   duration-300 transition-colors ${
                isActive('/projects')
                  ? 'bg-amber-200 text-amber-700 font-medium hover:text-amber-700'
                  : 'hover:text-neutral-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <GrProjects size={18} />
                Projects
              </span>
              <span className="hover:bg-amber-500 transition-colors rounded">
                <Dialog>
                  <DialogTrigger>
                    <FaPlus size={12} className="mx-2" onClick={handleTeams} />
                  </DialogTrigger>
                  {teams && <ProjectForm teams={teams} />}
                </Dialog>
              </span>
            </div>
            <div>
              {user?.projects.map((item, i) => (
                <Link to={`/project/${item._id}`} key={i}>
                  <div
                    className={`ml-9 mr-1 mb-2 cursor-pointer p-1 m-auto rounded hover:bg-purple-200  transition-colors duration-300 ${
                      isActive(`/project/${item._id}`)
                        ? 'bg-purple-200 text-purple-700 font-medium hover:text-purple-700'
                        : 'hover:text-neutral-800'
                    }`}
                  >
                    {item.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div
              className={`flex items-center justify-between  p-2 m-1  rounded-lg hover:bg-amber-200   duration-300 transition-colors ${
                isActive('/teams')
                  ? 'bg-amber-200 text-amber-700 font-medium hover:text-amber-700'
                  : 'hover:text-neutral-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <RiTeamLine size={18} />
                Teams
              </span>
              <span className="hover:bg-amber-500 transition-colors rounded">
                <Dialog>
                  <DialogTrigger>
                    <FaPlus size={12} className="mx-2" />
                  </DialogTrigger>
                  <TeamForm user={user} />
                </Dialog>
              </span>
            </div>
            <div>
              {user?.teams.map((item, i) => (
                <Link to={`/team/${item._id}`} key={i}>
                  <div
                    className={`ml-9 mr-1 cursor-pointer p-1 m-auto rounded mt-1 hover:bg-purple-200 hover:text-neutral-800  transition-colors duration-300 ${
                      isActive(`/team/${item._id}`) &&
                      'bg-purple-200  text-purple-700 font-medium hover:text-purple-700'
                    }`}
                  >
                    {item.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <Button
            variant="link"
            className="text-lg font-medium text-amber-500 border-t  absolute bottom-0 w-full"
          >
            <Link to="/" className="tracking-[0.1em] text-amber-500">
              ProManage
            </Link>
          </Button>
        </div>
      </nav>
    </aside>
  )
}

export default Navbar
