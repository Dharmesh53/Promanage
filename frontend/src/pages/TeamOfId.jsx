import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IoMdRemoveCircleOutline } from 'react-icons/io'
import axios from 'axios'

const TeamOfId = () => {
  const { id } = useParams()
  const [team, setTeam] = useState({})
  const [hoveredIndex, setHoveredIndex] = useState(null)

  useEffect(() => {
    const fetcher = async () => {
      const res = await axios.get(`http://localhost:5000/api/team/get/${id}`)
      setTeam(res.data.team[0])
    }
    fetcher()
  }, [id])

  const handleDelete = async (memberId) => {
    console.log(memberId)
    setTeam((prev) => ({
      ...prev,
      members: prev.members.filter((member) => member._id !== memberId),
    }))
    await axios.delete(
      `http://localhost:5000/api/team/delete/${id}/${memberId}`
    )
    console.log(`Delete member with ID: ${memberId}`)
  }

  return (
    <div className="flex w-full h-full bg-white p-8">
      {team && (
        <div className="flex flex-col w-full">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">
              {team.title}
            </h1>
            <h2 className="text-xl font-light text-gray-600">
              Created by {team.createdBy}
            </h2>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Members</h3>
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
                      {member.email.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-md font-medium text-gray-800">
                        {member.name}
                      </div>
                      <div className="text-sm font-light text-gray-600">
                        {member.email}
                      </div>
                    </div>
                  </div>
                  {hoveredIndex === i && (
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="ml-auto  text-red-500 p-2 rounded hover:bg-neutral-200 transition"
                    >
                      <IoMdRemoveCircleOutline size={20} />
                    </button>
                  )}
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
