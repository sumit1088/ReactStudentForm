import React, { useState, useRef } from 'react';
import { Upload, File, X, Check } from 'lucide-react';

interface FileUploaderProps {
  accept: string;
  id: string;
  label: string;
  onChange: (files: File[]) => void;
  value: File[];
  multiple?: boolean; // ✅ Added support for multiple files
}

const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  id,
  label,
  onChange,
  value,
  multiple = false, // ✅ Default to false if not provided
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file =>
      accept.includes(file.type) || accept === '*'
    );
    if (files.length > 0) {
      onChange([...value, ...files]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange([...value, ...Array.from(e.target.files)]);
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
    if (newFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium mb-2">{label}</label>
      <div
        className={`
          w-full min-h-[150px] rounded-xl border-2 border-dashed 
          flex flex-col items-center justify-center p-6 transition-all cursor-pointer
          ${isDragging
            ? 'border-primary bg-primary/5'
            : value.length
              ? 'border-green-400 bg-green-50'
              : 'border-border hover:border-primary/50 hover:bg-secondary/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          accept={accept}
          multiple={multiple} // ✅ Used here
          className="hidden"
          onChange={handleChange}
        />

        {value.length > 0 ? (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-scale-in">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-2 w-full max-w-md">
              {value.map((file, index) => (
                <div
                key={index}
                className="flex items-center justify-between px-2 py-1 bg-white rounded border text-sm max-w-[220px] mx-auto"
              >
                <div className="flex items-center space-x-1 truncate">
                  <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Drag & drop your files here, or <span className="text-primary">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Accepted formats: {accept.replace(/\./g, '').toUpperCase()}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
