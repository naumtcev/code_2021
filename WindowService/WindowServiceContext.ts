import { createContext } from 'react';

import { Domain } from '@components/DomainsPage/models/Domain';
import { DomainCreation } from '@components/DomainsPage/models/DomainCreation';
import { ResponseEntry } from '@core/api/models/ResponseEntry';

export type Context = {
  createDomain: (values: DomainCreation) => Promise<ResponseEntry>;
  deleteDomains: () => void;
  saveNoteDomain: (id: number, value: Domain['notes']) => void;
  saveDomain: (values: DomainCreation) => Promise<ResponseEntry>;
  loadDomain: (id: string) => void;
  resetEditingDomain: () => void;
};

export const WindowServiceContext = createContext<Context>({} as Context);
