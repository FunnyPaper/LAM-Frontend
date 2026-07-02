import { type ReactNode, type RefObject } from 'react';
import { DrawerContainerContext } from './use-drawer-container';
export type { DrawerContainerContextType } from './use-drawer-container';

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