import React from "react";

export default function InputFile({ setUploadedFile }) {
  function handleFile(e) {
    setUploadedFile(e.target.files);
  }

  return <input type="file" name="xlfile" id="xlf" onChange={handleFile} />;
}
