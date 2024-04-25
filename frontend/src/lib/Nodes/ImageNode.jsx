import { useState } from "react";
import { NodeResizer } from "reactflow";

const ImageNode = ({ data, selected, width, height }) => {
  const [imageWidth, setImageWidth] = useState(width || "auto");
  const [imageHeight, setImageHeight] = useState(height || "auto ");

  return (
    <>
      <NodeResizer
        isVisible={selected}
        color="#d6921e"
        minWidth={100}
        minHeight={100}
        keepAspectRatio="true"
        onResize={(width, height) => {
          setImageWidth(width);
          setImageHeight(height);
        }}
      />
      {data?.imageSrc && (
        <img
          src={data?.imageSrc}
          alt="img"
          className="rounded-lg "
          style={{ width: imageWidth, height: imageHeight }}
        />
      )}
    </>
  );
};

export default ImageNode;
