import { createContext, useContext, type RefObject, type ReactNode } from 'react';

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

export type DrawerContainerProviderProps = {
  children: ReactNode;
  containerRef: RefObject<HTMLElement | null>;
};

export function DrawerContainerProvider({ children, containerRef }: DrawerContainerProviderProps) {
  return (
    <DrawerContainerContext.Provider value={{ containerRef }}>
      {children}
    </DrawerContainerContext.Provider>
  );
}