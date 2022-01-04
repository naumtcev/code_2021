/* eslint-disable camelcase */
import { Domain } from '@components/DomainsPage/models/Domain';

export type DomainServerResponse = Pick<Domain, 'id' | 'name' | 'state' | 'notes'> & {
  campaigns_count: number;
  default_campaign: string;
  isSsl: boolean;
  network_status: string;
  ssl_redirect: string;
  ssl_status: string;
  created_at: string;
  updated_at: string;
  catch_not_found: string;
  allow_indexing: boolean;
  check_retries: number;
  default_campaign_id: string;
  error_description: string | null;
  next_check_at: string;
  ssl_data: string | null;
  wildcard: string;
};
