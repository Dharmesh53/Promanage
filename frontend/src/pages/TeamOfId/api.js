// src/utils/api.js

import axios from 'axios'

export const fetchTeamById = async (id) => {
  const response = await axios.get(`/api/team/get/${id}`)
  return response.data.team[0]
}

export const addMembersToTeam = async (id, title, newMembers) => {
  const response = await axios.put(`/api/team/add-members`, {
    teamId: id,
    title: title,
    newMembers: newMembers,
  })
  return response.data.members
}

export const deleteTeamMember = async (teamId, memberId) => {
  const response = await axios.delete(`/api/team/delete/${teamId}/${memberId}`)
  return response.data.msg
}

export const updateTeamInCharge = async (teamId, newInCharge) => {
  await axios.post(`/api/team/change-Creator`, {
    teamId: teamId,
    newInCharge: newInCharge,
  })
}

export const deleteTeam = async (id) => {
  const response = await axios.delete(`/api/team/delete/${id}`)
  return response.status
}
