
import { Category, defaultCategories } from './fileUtils';

// Local storage keys
const CATEGORIES_KEY = 'file-organizer-categories';
const THEME_KEY = 'file-organizer-theme';

// Save categories to local storage
export const saveCategories = (categories: Category[]): void => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

// Load categories from local storage
export const loadCategories = (): Category[] => {
  const savedCategories = localStorage.getItem(CATEGORIES_KEY);
  return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
};

// Save theme preference
export const saveTheme = (isDark: boolean): void => {
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
};

// Load theme preference
export const loadTheme = (): string | null => {
  return localStorage.getItem(THEME_KEY);
};
