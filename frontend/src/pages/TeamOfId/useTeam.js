import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import {
  fetchTeamById,
  addMembersToTeam,
  deleteTeamMember,
  updateTeamInCharge,
  deleteTeam,
} from './api'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const useTeam = (id) => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const [team, setTeam] = useState({})
  const [loadingAction, setLoadingAction] = useState(null)

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const teamData = await fetchTeamById(id)
        setTeam(teamData)

        const isMember = teamData.members.some(
          (member) => member.email === user?.email
        )
      } catch (error) {
        toast({
          variant: 'destructive',
          title: error.message,
        })
      }
    }

    loadTeam()
  }, [id, user?.email, toast, navigate])

  const handleAddMember = async (newMemberEmails) => {
    setLoadingAction('addMembers')
    try {
      const newMembers = await addMembersToTeam(id, team.title, newMemberEmails)
      setTeam((prev) => ({
        ...prev,
        members: [...prev.members, ...newMembers],
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
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDelete = async (memberId) => {
    setLoadingAction('removeMember')
    try {
      const message = await deleteTeamMember(id, memberId)
      setTeam((prev) => ({
        ...prev,
        members: prev.members.filter((member) => member._id !== memberId),
      }))
      toast({ title: message })
    } catch (error) {
      toast({
        variant: 'destructive',
        className: 'bg-red-400 p-2',
        title: error.response.data.msg,
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleSelfRemoval = async (newInCharge) => {
    setLoadingAction('selfRemoval')
    try {
      await updateTeamInCharge(id, newInCharge)
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
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDeleteProject = async () => {
    setLoadingAction('deleteProject')
    try {
      const status = await deleteTeam(id)
      if (status === 200) {
        navigate('/')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        className: 'bg-red-400 p-2',
        title: error.response?.data?.msg || 'An error occurred',
      })
    } finally {
      setLoadingAction(null)
    }
  }

  return {
    team,
    loadingAction,
    handleAddMember,
    handleDelete,
    handleSelfRemoval,
    handleDeleteProject,
  }
}

export default useTeam
