import { v4 as uuidv4 } from "uuid";

const getCoords = (divRef) => {
  const rect = divRef?.current?.getBoundingClientRect();
  const middleX = rect?.left + Math.random() * 100;
  const middleY = rect?.top + Math.random() * 100;
  return { x: middleX, y: middleY };
};

export const createSquare = (divRef) => {
  return {
    id: uuidv4(),
    type: "shape",
    position: getCoords(divRef),
    data: { shape: "square" },
    zIndex: 999,
  };
};

export const createCircle = (divRef) => {
  return {
    id: uuidv4(),
    type: "shape",
    position: getCoords(divRef),
    data: { shape: "circle" },
    zIndex: 999,
  };
};

export const createPlainText = (divRef) => {
  return {
    id: uuidv4(),
    type: "plaintext",
    position: getCoords(divRef),
    data: { value: "" },
    zIndex: 999,
  };
};

export const createTextBox = (divRef) => {
  return {
    id: uuidv4(),
    type: "textBox",
    position: getCoords(divRef),
    data: { value: "" },
    zIndex: 999,
  };
};

export const insertImage = (divRef, imageRef) => {
  return new Promise((resolve, reject) => {
    const file = imageRef?.current?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const image = reader.result;
        const imageNode = {
          id: uuidv4(),
          type: "image",
          position: getCoords(divRef),
          data: { imageSrc: image },
          zIndex: 999,
        };
        resolve(imageNode);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    } else {
      reject(new Error("No file selected"));
    }
  });
};
