
// File type definitions
export type FileCategory = 'photos' | 'documents' | 'music' | 'videos' | 'archives' | 'other' | string;

export interface FileItem {
  id: string;
  file: File;
  category: FileCategory;
  preview?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  extensions: string[];
}

// Default categories
export const defaultCategories: Category[] = [
  {
    id: 'photos',
    name: 'Photos',
    icon: 'image',
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: 'file-text',
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf', '.md']
  },
  {
    id: 'music',
    name: 'Music',
    icon: 'music',
    extensions: ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a']
  },
  {
    id: 'videos',
    name: 'Videos',
    icon: 'film',
    extensions: ['.mp4', '.avi', '.mov', '.wmv', '.mkv', '.webm']
  },
  {
    id: 'archives',
    name: 'Archives',
    icon: 'archive',
    extensions: ['.zip', '.rar', '.7z', '.tar', '.gz']
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'file',
    extensions: []
  }
];

// Determine file category based on extension
export const getFileCategory = (file: File, categories: Category[]): FileCategory => {
  const fileName = file.name.toLowerCase();
  const extension = '.' + fileName.split('.').pop();
  
  for (const category of categories) {
    if (category.extensions.includes(extension)) {
      return category.id as FileCategory;
    }
  }
  
  return 'other';
};

// Generate a preview URL for the file
export const generateFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // For images, use the file directly
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-images, return empty string for now
      resolve('');
    }
  });
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
