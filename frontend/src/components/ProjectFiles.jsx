import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { useRef, useState } from 'react'
import { MdOutlineDelete } from 'react-icons/md'
import { AnimatePresence, motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const ProjectFiles = () => {
  const project = useSelector((state) => state.project?.project?.project)
  const inputRef = useRef(null)
  const { id } = useParams()
  const [files, setFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const [disabled, setDisabled] = useState(false)

  const handleAddFile = async () => {
    setDisabled(true)
    if (!files || files.length === 0) return

    const result = []

    try {
      for (const file of files) {
        const path = `uploads/${id}/${file.name}`

        // create preSignedUrl
        const preSignedUrl = await axios.post(
          'http://localhost:5000/api/aws/put',
          {
            key: path,
            contentType: file.type,
          }
        )

        // upload file using that url
        await axios.put(preSignedUrl.data.url, file, {
          headers: {
            'Content-Type': file.type,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            )
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: percent,
            }))
          },
        })

        const fileUrl =
          'https://p-r-o-manage.s3.ap-southeast-2.amazonaws.com/' + path
        result.push(fileUrl)
      }

      // save the file names in mongodb
      await axios.put(
        `http://localhost:5000/api/project/newFiles/${id}`,
        result
      )
      setUploadedFiles((prev) => [...prev, ...result])
      setFiles([])
      setDisabled(false)
    } catch (error) {
      console.log(error)
      setDisabled(false)
    }
  }

  const handleDeleteFile = async (url, index) => {
    setDisabled(true)
    const segments = url.split('/')
    const key = segments.slice(-3).join('/')

    await axios.delete(`http://localhost:5000/api/aws/delete/${key}`)

    setUploadedFiles((prev) => prev.filter((_, i) => i != index))
  }

  useEffect(() => {
    setUploadedFiles(project?.files)
  }, [project])

  return (
    <div>
      <Input
        id="Files"
        type="file"
        ref={inputRef}
        className="hidden"
        multiple
        onChange={() => setFiles(Array.from(inputRef?.current?.files))}
      />
      <div className="w-full relative">
        <h2 className="font-semibold text-2xl my-4">Common files</h2>
        <Button
          className="absolute top-0 right-0"
          onClick={() => {
            inputRef?.current?.click()
          }}
          variant="outline"
        >
          Add Files
        </Button>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <>
            <div className="bg-neutral-100 rounded p-2 grid min-[800px]:grid-cols-2 grid-flow-row max-[800px]:grid-cols-1 gap-2 border border-neutral-200">
              {files.map((file, i) => (
                <motion.div
                  layout
                  layoutId={file.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1 }}
                  key={file.name}
                  className="border rounded bg-white p-3 overflow-hidden relative"
                >
                  <h2>{file.name}</h2>
                  <div className="w-full h-1 bg-gray-50 rounded-b absolute left-0 bottom-0">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress[file.name] || 0}%` }}
                      transition={{ duration: 0.2, type: 'tween' }}
                      className="h-full bg-black rounded-b"
                    ></motion.div>
                  </div>
                  {!disabled && (
                    <MdOutlineDelete
                      className="absolute cursor-pointer right-2 top-3 text-red-400 bg-white"
                      size={20}
                      onClick={() => {
                        setFiles((prev) => prev.filter((_, idx) => i !== idx))
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
            <div className="w-full my-3 grid place-items-center">
              <Button disabled={disabled} onClick={handleAddFile}>
                {disabled && <Loader2 className="animate-spin mr-2" />}
                Upload Files
              </Button>
            </div>
          </>
        )}

        {uploadedFiles?.length > 0 && (
          <div className="mt-4">
            {uploadedFiles.map((fileUrl, index) => (
              <div
                key={index}
                className="border rounded bg-white p-3 mb-2 flex items-center justify-between"
              >
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline truncate w-full"
                >
                  {fileUrl.split('/').pop()}
                </a>
                <MdOutlineDelete
                  className="cursor-pointer hover:bg-neutral-200 rounded focus-visible:bg-neutral-200 text-red-400"
                  size={20}
                  onClick={() => handleDeleteFile(fileUrl, index)}
                />
              </div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProjectFiles
