import React, { useState } from 'react';
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

const ImageUpload = ({ onImagesUploaded, multiple = false }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleChangeEvent = (files) => {
    // Filter only successful uploads with CDN URLs
    const successfulUploads = files.allEntries.filter(
      (file) => file.status === 'success' && file.cdnUrl
    );

    if (successfulUploads.length > 0) {
      const urls = successfulUploads.map((file) => file.cdnUrl);
      setUploadedFiles(successfulUploads);
      onImagesUploaded(multiple ? urls : urls[0]);
    }
  };

  return (
    <div className="space-y-3">
      <FileUploaderRegular
        pubkey="ea9662a13a54f89075ac"
        classNameUploader="uc-light uc-purple"
        sourceList="local, camera, gdrive, facebook"
        userAgentIntegration="llm-react"
        filesViewMode="grid"
        multiple={multiple}
        onChange={handleChangeEvent}
      />

      {/* Uploaded files preview */}
      {uploadedFiles.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-4">
          {uploadedFiles.map((file, index) => (
            <div key={file.uuid || index} className="relative w-20 h-20">
              <img
                src={file.cdnUrl}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
