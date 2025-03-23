import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FileDropZone from '@/components/FileDropZone';
import CategoryList from '@/components/CategoryList';
import FileItem from '@/components/FileItem';
import FilePreview from '@/components/FilePreview';
import { FileItem as FileItemType, Category, defaultCategories } from '@/utils/fileUtils';
import { loadCategories, saveCategories, loadTheme, saveTheme } from '@/utils/localStorage';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  toast
} from '@/components/ui';
import { isEmpty } from '@/lib/utils';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [files, setFiles] = useState<FileItemType[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItemType | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('file');
  const [newCategoryExtensions, setNewCategoryExtensions] = useState('');
  
  useEffect(() => {
    const theme = loadTheme();
    if (theme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    const savedCategories = loadCategories();
    setCategories(savedCategories);
  }, []);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      saveTheme(true);
    } else {
      document.documentElement.classList.remove('dark');
      saveTheme(false);
    }
  };
  
  const fileCounts = files.reduce((counts, file) => {
    counts[file.category] = (counts[file.category] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  const filteredFiles = selectedCategory
    ? files.filter(file => file.category === selectedCategory)
    : files;
  
  const handleFilesAdded = (newFiles: FileItemType[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };
  
  const handlePreviewFile = (file: FileItemType) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };
  
  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: "File Removed",
      description: "The file has been removed from your list.",
    });
  };
  
  const handleAddCategory = () => {
    if (isEmpty(newCategoryName)) {
      toast({
        title: "Error",
        description: "Category name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    
    const extensions = newCategoryExtensions
      .split(',')
      .map(ext => ext.trim())
      .filter(ext => ext)
      .map(ext => ext.startsWith('.') ? ext : `.${ext}`);
    
    const newCategory: Category = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      name: newCategoryName,
      icon: newCategoryIcon,
      extensions,
    };
    
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    
    setNewCategoryName('');
    setNewCategoryIcon('file');
    setNewCategoryExtensions('');
    setIsNewCategoryDialogOpen(false);
    
    toast({
      title: "Category Added",
      description: `"${newCategoryName}" category has been added.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
        openNewCategoryDialog={() => setIsNewCategoryDialogOpen(true)}
      />
      
      <main className="flex-1 container max-w-6xl mx-auto flex flex-col py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <aside className="md:border-r border-border/40 pb-12">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              openNewCategoryDialog={() => setIsNewCategoryDialogOpen(true)}
              fileCounts={fileCounts}
            />
          </aside>
          
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight transition-all">
                {selectedCategory 
                  ? categories.find(c => c.id === selectedCategory)?.name || 'Files'
                  : 'All Files'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Drop files to automatically categorize them based on file type
              </p>
            </div>
            
            <FileDropZone onFilesAdded={handleFilesAdded} categories={categories} />
            
            {files.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No files yet. Drop some files to get started!</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No files in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 animate-fade-in">
                {filteredFiles.map(file => (
                  <FileItem
                    key={file.id}
                    file={file}
                    onPreview={handlePreviewFile}
                    onDelete={handleDeleteFile}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <FilePreview
        file={selectedFile}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
      
      <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a custom category to organize your files.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Programming, Design, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <Select value={newCategoryIcon} onValueChange={setNewCategoryIcon}>
                <SelectTrigger id="icon">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="file-text">Document</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="film">Video</SelectItem>
                  <SelectItem value="archive">Archive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="extensions">
                File Extensions (comma separated)
              </Label>
              <Input
                id="extensions"
                value={newCategoryExtensions}
                onChange={(e) => setNewCategoryExtensions(e.target.value)}
                placeholder=".py, .js, .ts"
              />
              <p className="text-xs text-muted-foreground">
                Add file extensions to automatically categorize files
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
