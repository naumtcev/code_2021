import { createContext } from 'react';

export type Context = {
  massCheckAllDomains: () => void;
  checkDomain: (id: string) => void;
  selectAllDomains: () => void;
  onToggleSelectDomain: (id: string) => void;
};

export const PageServiceContext = createContext<Context>({} as Context);
