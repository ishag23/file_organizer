import React from 'react';
import { 
  Moon, 
  Sun, 
  Settings, 
  Plus
} from 'lucide-react';
import { 
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  openNewCategoryDialog: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isDarkMode, 
  toggleTheme, 
  openNewCategoryDialog 
}) => {
  return (
    <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-10 w-full bg-background/80">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight">FileHaven</h1>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
            Beta
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={openNewCategoryDialog}
            className="animate-pulse-subtle"
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">Add Category</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
          >
            {isDarkMode ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem>
                About
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
