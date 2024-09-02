import useTeam from './useTeam'
import { useParams } from 'react-router-dom'
import TeamHeader from './teamHeader'
import TeamMembers from './teamMembers'
import { useSelector } from 'react-redux'

const Team = () => {
  const { id } = useParams()
  const user = useSelector((state) => state.auth.user)

  const {
    team,
    loadingAction,
    handleAddMember,
    handleDelete,
    handleSelfRemoval,
    handleDeleteProject,
  } = useTeam(id)

  return (
    <div className="p-4 bg-white h-full">
      <TeamHeader
        team={team}
        user={user}
        handleDeleteProject={handleDeleteProject}
        loadingAction={loadingAction}
      />
      <TeamMembers
        team={team}
        user={user}
        handleAddMember={handleAddMember}
        handleDelete={handleDelete}
        handleSelfRemoval={handleSelfRemoval}
        loadingAction={loadingAction}
      />
    </div>
  )
}

export default Team
