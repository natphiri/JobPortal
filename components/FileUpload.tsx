import React, { useState, useRef, useCallback } from 'react';
import UploadIcon from './icons/UploadIcon';
import FileIcon from './icons/FileIcon';
import CloseIcon from './icons/CloseIcon';

interface FileUploadProps {
  label: string;
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes?: string;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onFilesSelected,
  acceptedFileTypes = '*',
  multiple = false,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length) {
      const newFiles = multiple ? [...selectedFiles, ...files] : files;
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    const newFiles = selectedFiles.filter(file => file.name !== fileName);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
    // If the input is cleared, we need to reset its value property
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const onDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
     if (files.length) {
      const newFiles = multiple ? [...selectedFiles, ...files] : files;
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  };


  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      
      {selectedFiles.length === 0 || multiple ? (
        <label
            onDragOver={onDragOver}
            onDrop={onDrop}
            className="cursor-pointer flex justify-center w-full px-6 py-8 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-700/50"
        >
          <div className="text-center">
            <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
                {acceptedFileTypes.replace(/,/g, ', ').toUpperCase()}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : null}

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center min-w-0">
                <FileIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-gray-800 dark:text-gray-200 text-sm truncate font-medium">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(file.name)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-2"
                aria-label={`Remove ${file.name}`}
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
