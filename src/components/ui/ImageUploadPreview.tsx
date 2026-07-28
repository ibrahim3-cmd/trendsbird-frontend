import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadPreviewProps {
  value?: string; // Existing image URL
  onImageSelect: (file: File | null) => void;
  width?: number;
  height?: number;
  className?: string;
  accept?: string;
  maxSizeInMB?: number;
  uploadButtonText?: string; // Custom text for upload button
  changeButtonText?: string; // Custom text for change button
  altText?: string; // Alt text for the image
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  value,
  onImageSelect,
  width = 120,
  height = 120,
  className = "",
  accept = "image/*",
  maxSizeInMB = 5,
  uploadButtonText = "Upload Image",
  changeButtonText = "Change Image",
  altText = "Organization Logo",
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File select triggered:', event.target.files);
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeInMB) {
      toast.error(`File size must be less than ${maxSizeInMB}MB`);
      return;
    }

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
    
    // Notify parent component
    onImageSelect(file);
  };

  // const handleRemoveImage = () => {
  //   // Clean up object URL to prevent memory leaks
  //   if (previewUrl) {
  //     URL.revokeObjectURL(previewUrl);
  //   }
    
  //   setPreviewUrl(null);
  //   setSelectedFile(null);
    
  //   // Clear file input
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = '';
  //   }
    
  //   // Notify parent component
  //   onImageSelect(null);
  // };

  const handleUploadClick = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('Upload clicked, fileInputRef:', fileInputRef.current);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Determine which image to show (new preview takes priority over existing value)
  const displayImage = previewUrl || value;
  const hasImage = !!displayImage;

  return (
    <div className={className}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {hasImage ? (
        /* Two-part layout when image exists */
        <div className="flex items-start gap-6">
          {/* Left Part - Image Only */}
          <div className="flex-shrink-0">
            <div 
              className="relative border-2 border-gray-200 dark:border-gray-700 rounded-full"
              style={{ width: `${width}px`, height: `${height}px` }}
            >
              <img
                src={displayImage}
                alt={altText}
                className="w-full h-full object-cover rounded-full"
              />
              
              {/* Overlay for new image indicator */}
              {previewUrl && (
                <div className="absolute bottom-[-20px] left-0 right-0 text-center text-blue-500 font-bold text-xs whitespace-nowrap">
                  New image selected
                </div>
              )}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="h-auto min-h-[120px] w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

          {/* Right Part - Text Information */}
          <div className="flex-1 space-y-3 py-2">
            {/* File info */}
            {selectedFile && (
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
                <p><strong>Selected:</strong> {selectedFile.name}</p>
                <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(1)} KB</p>
                <p className="text-blue-600 dark:text-blue-400">
                  Image will be uploaded when you save settings
                </p>
              </div>
            )}

            {/* File requirements */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Max size: {maxSizeInMB}MB. Supported: JPG, PNG, WebP
            </p>

            {/* Upload Button */}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleUploadClick}
              className="flex items-center justify-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {changeButtonText}
            </Button>
          </div>
        </div>
      ) : (
        /* Centered layout when no image */
        <div className="flex flex-col items-center space-y-3">
          {/* Image Placeholder */}
          <div 
            className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center"
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <ImageIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>

          {/* Upload Button */}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleUploadClick}
            className="flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploadButtonText}
          </Button>

          {/* File requirements */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Max size: {maxSizeInMB}MB. Supported: JPG, PNG, WebP
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadPreview;
