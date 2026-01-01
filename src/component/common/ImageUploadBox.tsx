"use client"

import { useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ImageUploadBox = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (files: FileList | null) => {
        if (files && files.length > 0) {
            // Handle the uploaded files here
            console.log("Files selected:", files);
            // You can add your file handling logic here
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e.target.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    return (
        <div className="bg-white p-8 w-full mb-10 rounded-xl">
            <div
                className={`
                    bg-white rounded-lg border-2 border-dashed border-gray-300
                    w-full p-12 flex flex-col items-center justify-center
                    cursor-pointer transition-all min-h-[300px]
                    ${isDragging ? 'border-blue-400 bg-blue-50/50' : 'hover:border-gray-400'}
                `}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="mb-6">
                    <CloudUploadIcon 
                        sx={{ 
                            fontSize: 64, 
                            color: '#2563eb' 
                        }} 
                    />
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Browse Files to upload
                </h3>
                
                <p className="text-sm text-gray-500">
                    Upload the image here
                </p>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default ImageUploadBox;