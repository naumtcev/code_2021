import { Option } from '@ui/KSelect/models/Option';

export type DomainCreation = {
  name: string;
  sslRedirect: boolean;
  wildcard: boolean;
  catchNotFound: boolean;
  defaultCampaignId: string;
  allowIndexing: boolean;
  addAnotherOne?: boolean;
  campaigns?: Option[];
};
