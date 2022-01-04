/* eslint-disable camelcase */
export type DomainServerFields = {
  name: string;
  ssl_redirect: string;
  wildcard: string;
  catch_not_found?: string;
  default_campaign_id?: string;
  is_ssl?: string;
  allow_indexing?: boolean;
};
