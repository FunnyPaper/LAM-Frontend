import { createContext, useContext, type RefObject } from 'react';

export type DrawerContainerContextType = {
  containerRef: RefObject<HTMLElement | null>;
};

export const DrawerContainerContext = createContext<DrawerContainerContextType | null>(null);

export function useDrawerContainerContext() {
  const context = useContext(DrawerContainerContext);
  if (!context) {
    throw new Error('useDrawerContainerContext must be used within a DrawerContainerProvider');
  }
  return context;
}
