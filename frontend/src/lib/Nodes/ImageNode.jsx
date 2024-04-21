import React, { useState } from "react";
import { NodeResizer } from "reactflow";

const ImageNode = ({ data, selected }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageWidth, setImageWidth] = useState("auto");
  const [imageHeight, setImageHeight] = useState("auto");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        setImageSrc(reader.result);
      };
    }
  };

  return (
    <>
      <input
        type="file"
        name=""
        id=""
        accept="image/*"
        onChange={handleFileChange}
      />
      <NodeResizer
        isVisible={selected}
        color="#d6921e"
        minWidth={100}
        minHeight={100}
        onResize={(width, height) => {
          setImageWidth(width);
          setImageHeight(height);
        }}
      />
      {imageSrc && (
        <img
          src={imageSrc}
          alt="img"
          className="rounded-lg "
          style={{ width: imageWidth, height: imageHeight }}
        />
      )}
    </>
  );
};

export default ImageNode;
