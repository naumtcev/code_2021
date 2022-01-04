export type Domain = {
  campaignsCount: number;
  defaultCampaign: string;
  id: string;
  isSsl: boolean;
  name: string;
  networkStatus: string;
  sslRedirect: boolean;
  state: string;
  sslStatus: string;
  wildcard: boolean;

  createdAt: string;
  updatedAt: string;

  catchNotFound: boolean;
  allowIndexing: boolean;
  checkRetries: number;
  defaultCampaignId: string;
  errorDescription: string | null;
  nextCheckAt: string;
  notes: string;
  sslData: string | null;
};
