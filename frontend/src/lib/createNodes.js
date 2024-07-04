import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

const getCoords = (divRef) => {
  const rect = divRef?.current?.getBoundingClientRect()
  const middleX = rect?.left + Math.random() * 100
  const middleY = rect?.top + Math.random() * 100
  return { x: middleX, y: middleY }
}

export const createSquare = (divRef) => {
  return {
    id: uuidv4(),
    type: 'shape',
    position: getCoords(divRef),
    data: { shape: 'square' },
    zIndex: 200,
  }
}

export const createCircle = (divRef) => {
  return {
    id: uuidv4(),
    type: 'shape',
    position: getCoords(divRef),
    data: { shape: 'circle' },
    zIndex: 200,
  }
}

export const createPlainText = (divRef) => {
  return {
    id: uuidv4(),
    type: 'plaintext',
    position: getCoords(divRef),
    data: { value: '' },
    zIndex: 400,
  }
}

export const createTextBox = (divRef) => {
  return {
    id: uuidv4(),
    type: 'textBox',
    position: getCoords(divRef),
    data: { value: '' },
    zIndex: 400,
  }
}

// export const insertImage = (divRef, imgRef) => {
//   return new Promise((resolve, reject) => {
//     const file = imgRef?.current?.files[0]
//     if (file) {
//       const img = new Image()
//       const fileURL = URL.createObjectURL(file)
//       img.src = fileURL
//
//       img.onload = function () {
//         const canvas = document.createElement('canvas')
//         const ctx = canvas.getContext('2d')
//         canvas.style.display = 'none'
//
//         canvas.width = img.width
//         canvas.height = img.height
//         ctx.drawImage(img, 0, 0)
//
//         const webp = canvas.toDataURL('image/webp', 1)
//
//         const imageNode = {
//           id: uuidv4(),
//           type: 'image',
//           position: getCoords(divRef),
//           data: { imageSrc: webp },
//           zIndex: 300,
//         }
//         resolve(imageNode)
//
//         // Cleanup
//         URL.revokeObjectURL(fileURL)
//       }
//
//       // const reader = new FileReader();
//       // reader.readAsDataURL(file);
//       // reader.onload = () => {
//       //   const image = reader.result;
//       // };
//       // reader.onerror = (error) => {
//       //   reject(error);
//       // };
//
//       img.onerror = (error) => {
//         reject(error)
//       }
//     } else {
//       reject(new Error('No file selected'))
//     }
//   })
// }
//

export const insertImage = (divRef, imgRef, id) => {
  return new Promise((resolve, reject) => {
    const file = imgRef?.current?.files[0]
    if (file) {
      const img = new Image()
      const fileURL = URL.createObjectURL(file)
      img.src = fileURL

      img.onload = async function () {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.style.display = 'none'

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const webp = await new Promise((resolve) => {
          canvas.toBlob((blob) => resolve(blob), 'image/webp')
        })

        const name = `${uuidv4()}.webp`

        try {
          const preSignedUrl = await axios.post(
            `http://localhost:5000/api/aws/put`,
            {
              key: `uploads/${id}/${name}`,
              contentType: webp.type,
            }
          )

          await axios.put(preSignedUrl.data.url, file, {
            headers: {
              'Content-Type': file.type,
            },
          })

          let imageUrl = `https://p-r-o-manage.s3.ap-southeast-2.amazonaws.com/uploads/${id}/${name}`

          const imageNode = {
            id: uuidv4(),
            type: 'image',
            position: getCoords(divRef),
            data: { imageSrc: imageUrl },
            zIndex: 300,
          }

          resolve(imageNode)
        } catch (error) {
          console.log(error)
        }
      }
    } else {
      reject(new Error('no file selected'))
    }
  })
}
