
import React from 'react';
import { 
  Archive,
  File,
  FileText,
  Film,
  Image,
  Music,
  Plus,
} from 'lucide-react';
import { Category } from '@/utils/fileUtils';
import { Badge } from '@/components/ui/badge';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  openNewCategoryDialog: () => void;
  fileCounts: Record<string, number>;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  openNewCategoryDialog,
  fileCounts,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'file-text':
        return <FileText className="h-4 w-4" />;
      case 'music':
        return <Music className="h-4 w-4" />;
      case 'film':
        return <Film className="h-4 w-4" />;
      case 'archive':
        return <Archive className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-1 px-2 py-4">
      <div className="flex items-center justify-between mb-3 px-3">
        <h2 className="text-sm font-medium">Categories</h2>
      </div>
      
      <div 
        className={`category-item ${selectedCategory === null ? 'active' : ''}`}
        onClick={() => onSelectCategory(null)}
      >
        <div className="h-4 w-4 mr-2" />
        <span className="flex-1">All Files</span>
        <Badge variant="outline" className="ml-auto">
          {Object.values(fileCounts).reduce((a, b) => a + b, 0)}
        </Badge>
      </div>
      
      {categories.map((category) => (
        <div
          key={category.id}
          className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
          onClick={() => onSelectCategory(category.id)}
        >
          {getCategoryIcon(category.icon)}
          <span className="flex-1">{category.name}</span>
          <Badge variant="outline" className="ml-auto">
            {fileCounts[category.id] || 0}
          </Badge>
        </div>
      ))}
      
      <div 
        className="category-item text-muted-foreground mt-4"
        onClick={openNewCategoryDialog}
      >
        <Plus className="h-4 w-4" />
        <span>Add Category</span>
      </div>
    </div>
  );
};

export default CategoryList;
