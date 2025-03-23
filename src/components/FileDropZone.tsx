
import React, { useCallback, useState } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { FileItem, generateFilePreview, generateId, getFileCategory } from '@/utils/fileUtils';
import { toast } from '@/components/ui/use-toast';

interface FileDropZoneProps {
  onFilesAdded: (files: FileItem[]) => void;
  categories: any[];
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFilesAdded, categories }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setIsProcessing(true);

    try {
      const files = Array.from(e.dataTransfer.files);
      
      if (files.length === 0) return;

      const fileItems: FileItem[] = await Promise.all(
        files.map(async (file) => {
          const preview = await generateFilePreview(file);
          const category = getFileCategory(file, categories);
          
          return {
            id: generateId(),
            file,
            category,
            preview
          };
        })
      );

      onFilesAdded(fileItems);
      
      toast({
        title: "Files Added",
        description: `${files.length} files have been categorized.`,
      });
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "Error Processing Files",
        description: "There was an error processing your files.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onFilesAdded, categories]);

  const handleFileInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const files = Array.from(e.target.files);
      
      const fileItems: FileItem[] = await Promise.all(
        files.map(async (file) => {
          const preview = await generateFilePreview(file);
          const category = getFileCategory(file, categories);
          
          return {
            id: generateId(),
            file,
            category,
            preview
          };
        })
      );

      onFilesAdded(fileItems);
      
      toast({
        title: "Files Added",
        description: `${files.length} files have been categorized.`,
      });
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "Error Processing Files",
        description: "There was an error processing your files.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  }, [onFilesAdded, categories]);

  return (
    <div
      className={`dropzone h-48 flex flex-col items-center justify-center ${
        isDragging ? 'dropzone-active' : ''
      } ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-input"
        className="hidden"
        multiple
        onChange={handleFileInputChange}
      />
      
      <div className="flex flex-col items-center justify-center text-center p-4">
        <div className={`mb-4 rounded-full p-3 bg-secondary ${isDragging ? 'animate-pulse' : 'animate-float'}`}>
          <UploadCloud className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-medium mb-1">
          {isProcessing ? 'Processing...' : 'Drop files here'}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3">
          or <label htmlFor="file-input" className="text-primary cursor-pointer hover:underline">browse files</label>
        </p>
        
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Files are processed locally and never uploaded
        </p>
      </div>
    </div>
  );
};

export default FileDropZone;
