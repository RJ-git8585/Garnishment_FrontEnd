import React from 'react';
import { FaCopy, FaExpand, FaCompress } from "react-icons/fa";
import { BsFiletypeJson, BsFiletypeXml } from "react-icons/bs";

const ApiResponse = ({
  response,
  showTable,
  setShowTable,
  containerRef,
  isFullscreen,
  setIsFullscreen,
  children,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2)).then(
      () => alert('Response copied to clipboard!'),
      () => alert('Failed to copy response.')
    );
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="responseSection">
      <div className="responseHeader">
        <h3>API Response</h3>
        <div>
          <button className="copyButton" onClick={handleCopy}>
            <FaCopy />
          </button>
          <button className="toggleButton" onClick={() => setShowTable(!showTable)}>
            {showTable ? <BsFiletypeJson /> : <BsFiletypeXml />}
          </button>
          <button className="toggleButton" onClick={toggleFullscreen}>
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>
      <div className="responseContainer">
        {showTable ? children : <pre className="responsejson">{JSON.stringify(response, null, 2)}</pre>}
      </div>
    </div>
  );
};

export default ApiResponse;
