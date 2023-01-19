import React from "react";

export default function DropZone({ setUploadedFile }) {
  function handleDragover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    setUploadedFile(e.dataTransfer.files);
  }

  return (
    <div
      id="drop"
      onDragOver={handleDragover}
      onDrop={handleDrop}
      onDragEnter={handleDragover}
    >
      {"Drop a spreadsheet file here to see sheet data"}
    </div>
  );
}
