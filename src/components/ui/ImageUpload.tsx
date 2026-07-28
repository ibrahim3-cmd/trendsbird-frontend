import React, { useState, useRef } from 'react';
import {Image as ImageIcon, Camera } from 'lucide-react';
import { 
  useUploadFileMutation,
  // useDeleteFileMutation
 } from '@/redux/features/upload/uploadApiSlice';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  width?: number;
  height?: number;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  width = 120,
  height = 120,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadFile] = useUploadFileMutation();
  // const [deleteFile] = useDeleteFileMutation();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadFile(formData).unwrap();
      const imageUrl = response?.data?.url || response?.url;
      
      if (imageUrl) {
        onChange(imageUrl);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to get image URL');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // const handleDelete = async () => {
  //   if (!value) return;

  //   try {
  //     // Extract file ID from URL if needed
  //     const fileId = value.split('/').pop()?.split('.')[0];
  //     if (fileId) {
  //       await deleteFile(fileId).unwrap();
  //     }
  //     onChange('');
  //     toast.success('Image deleted successfully');
  //   } catch (error) {
  //     console.error('Delete error:', error);
  //     toast.error('Failed to delete image');
  //   }
  // };

  const handleUploadClick = (e?: React.MouseEvent) => {
    // Prevent event bubbling if called from button click
    if (e) {
      e.stopPropagation();
    }
    fileInputRef.current?.click();
  };

  const handleContainerClick = () => {
    // Only handle clicks when there's no image
    if (!value) {
      handleUploadClick();
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div
        className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        style={{ width, height }}
        onClick={handleContainerClick}
      >
        {value ? (
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <ImageIcon className="w-8 h-8 text-gray-400" />
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}

        <div className="flex space-x-2 absolute bottom-0 right-0">
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="p-1 bg-primary text-primary-text rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
        >
          <Camera className="w-4 h-4" />
          {/* <span>{value ? 'Change' : 'Upload'}</span> */}
        </button>
        {/* <div>
          {value && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        )}
        </div> */}
        
      </div>
      </div>

      

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
