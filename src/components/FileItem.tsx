import React, { useState } from 'react';
import { FileItem as FileItemType } from '@/utils/fileUtils';
import { 
  File, 
  FileText, 
  Image, 
  Music, 
  Film, 
  Archive,
  MoreVertical, 
  Eye,
  Trash,
  FolderOpen
} from 'lucide-react';
import { 
  Card, 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui';

interface FileItemProps {
  file: FileItemType;
  onPreview: (file: FileItemType) => void;
  onDelete: (fileId: string) => void;
}

const FileIcon: React.FC<{ fileType: string, preview?: string }> = ({ fileType, preview }) => {
  const size = "h-8 w-8";
  
  if (fileType.startsWith('image/') && preview) {
    return (
      <div className="rounded overflow-hidden w-8 h-8 flex items-center justify-center bg-secondary">
        <img src={preview} alt="preview" className="h-full w-full object-cover" />
      </div>
    );
  }
  
  if (fileType.startsWith('image/')) {
    return <Image className={`${size} text-blue-500`} />;
  } else if (fileType.startsWith('audio/')) {
    return <Music className={`${size} text-purple-500`} />;
  } else if (fileType.startsWith('video/')) {
    return <Film className={`${size} text-red-500`} />;
  } else if (fileType.startsWith('application/pdf') || fileType.includes('document')) {
    return <FileText className={`${size} text-orange-500`} />;
  } else if (fileType.includes('zip') || fileType.includes('archive') || fileType.includes('compressed')) {
    return <Archive className={`${size} text-green-500`} />;
  } else {
    return <File className={`${size} text-gray-500`} />;
  }
};

const FileItem: React.FC<FileItemProps> = ({ file, onPreview, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Card 
      className={`file-item group transition-all duration-200 ${
        isHovered ? 'bg-secondary/50' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center w-full">
        <div className="flex-shrink-0 mr-3">
          <FileIcon fileType={file.file.type} preview={file.preview} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.file.size)} • {file.file.type.split('/')[1] || 'File'}
          </p>
        </div>
        
        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-secondary">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPreview(file)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FolderOpen className="h-4 w-4 mr-2" />
                Change Category
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(file.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default FileItem;
