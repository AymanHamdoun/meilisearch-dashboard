/**
 * Type definitions for sidebar navigation structure
 */

/**
 * Base navigation item interface
 */
export interface NavItem {
  /** Unique identifier for the navigation item */
  key: string;

  /** Display text for the navigation item */
  label: string;

  /** Route path or '#' for dropdown parents */
  link: string;

  /** Icon component to display */
  icon: JSX.Element;

  /** Whether this item is in development (shows badge) */
  isDevelopment?: boolean;

  /** Optional description for the item */
  description?: string;

  /** Child navigation items for dropdowns */
  children?: NavItem[];
}

/**
 * Sidebar link with nested structure support
 */
export interface SideBarLink extends NavItem {
  /** Child links for dropdown menus */
  children: SideBarLink[];
}

/**
 * Type guard to check if a NavItem has children
 */
export const hasChildren = (item: NavItem): boolean => {
  return Array.isArray(item.children) && item.children.length > 0;
};

/**
 * Type guard to check if a link is a dropdown parent
 */
export const isDropdownParent = (item: NavItem): boolean => {
  return item.link === '#' && hasChildren(item);
};

/**
 * Helper function to create a navigation item with type safety
 */
export const createNavItem = (
  key: string,
  label: string,
  link: string,
  icon: JSX.Element,
  options?: {
    children?: NavItem[];
    isDevelopment?: boolean;
    description?: string;
  }
): NavItem => ({
  key,
  label,
  link,
  icon,
  children: options?.children || [],
  isDevelopment: options?.isDevelopment,
  description: options?.description,
});

/**
 * Helper function to create a dropdown parent item
 */
export const createDropdownItem = (
  key: string,
  label: string,
  icon: JSX.Element,
  children: NavItem[]
): NavItem => ({
  key,
  label,
  link: '#',
  icon,
  children,
});