
import React, { useEffect, useState } from 'react';
import { FileItem as FileItemType } from '@/utils/fileUtils';
import { 
  Dialog, 
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  X,
  FileText,
  Music,
  Film,
  File
} from 'lucide-react';

interface FilePreviewProps {
  file: FileItemType | null;
  isOpen: boolean;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, isOpen, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    
    if (file.preview) {
      setPreviewUrl(file.preview);
    } else if (file.file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file.file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);
  
  if (!file) return null;

  const renderPreviewContent = () => {
    if (!file) return null;
    
    if (file.file.type.startsWith('image/') && previewUrl) {
      return (
        <div className="flex items-center justify-center h-full">
          <img 
            src={previewUrl} 
            alt={file.file.name} 
            className="max-h-[70vh] max-w-full object-contain" 
          />
        </div>
      );
    } else if (file.file.type.startsWith('audio/')) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <Music className="h-20 w-20 text-muted-foreground" />
          <audio controls className="w-full">
            <source src={URL.createObjectURL(file.file)} type={file.file.type} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    } else if (file.file.type.startsWith('video/')) {
      return (
        <div className="flex items-center justify-center h-full">
          <video controls className="max-h-[70vh] max-w-full">
            <source src={URL.createObjectURL(file.file)} type={file.file.type} />
            Your browser does not support the video element.
          </video>
        </div>
      );
    } else if (file.file.type === 'application/pdf') {
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <FileText className="h-20 w-20 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            PDF preview is not available. You can download the file to view it.
          </p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <File className="h-20 w-20 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            Preview not available for this file type.
          </p>
        </div>
      );
    }
  };

  const downloadFile = () => {
    if (!file) return;
    
    const url = URL.createObjectURL(file.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 truncate pr-10">
            {file.file.name}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="min-h-[300px] flex items-center justify-center border rounded-md bg-secondary/50">
          {renderPreviewContent()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={downloadFile}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreview;
