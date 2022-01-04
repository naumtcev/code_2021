import { string, boolean, object, ObjectSchema } from 'yup';
import { DomainCreation } from '@components/DomainsPage/models/DomainCreation';

export const DomainSchema: ObjectSchema<DomainCreation> = object({
  name: string().max(255).required(),
  sslRedirect: boolean(),
  wildcard: boolean(),
  catchNotFound: boolean(),
  campaigns: string(),
  defaultCampaignId: string(),
  allowIndexing: boolean(),
  addAnotherOne: boolean(),
}).defined();
