import { api } from '@core/api';
import { CampaignOption } from '@components/campaigns/models/CampaignOption';
import { Domain } from '@components/DomainsPage/models/Domain';
import { DomainServerResponse } from '@components/DomainsPage/models/DomainServerResponse';
import { DomainOption } from '@components/DomainsPage/models/DomainOption';
import { DomainServerFields } from '@components/DomainsPage/models/DomainServerFields';
import { convertSnakeToCamelCase } from '@helpers/array/convertSnakeToCamelCase';
import { convertCamelCaseToSnakeCase } from '@helpers/array/convertCamelCaseToSnakeCase';
import { DomainCreation } from './models/DomainCreation';
import { cleanDomainName, convertBooleanToString, convertStringToBoolean } from './helpers';

export const getDomains = async (): Promise<Domain[]> => {
  const response = await api.get<Domain[]>('?object=domains.index');
  const convertCaseDomains = convertSnakeToCamelCase<Domain>(response.data);
  return convertCaseDomains as Domain[];
};

export const listAsOptions = async (): Promise<DomainOption[]> => {
  const response = await api.get<CampaignOption[]>('?object=domains.listAsOptions');
  return response.data;
};

export const listAsAllowedOptions = async (): Promise<CampaignOption[]> => {
  const response = await api.get<CampaignOption[]>('?object=domains.listAsAllowedOptions');
  return response.data;
};

export const create = async (values: DomainCreation): Promise<Domain[]> => {
  const { name, allowIndexing, defaultCampaignId, catchNotFound, sslRedirect, wildcard, addAnotherOne } = values;

  const regExp = /[\\|\\,;]/g;
  const domainNames = name.split(regExp);
  const newDomains = domainNames.map((d) => cleanDomainName(d));

  const params: DomainServerFields = {
    name: newDomains.join(','),
    ssl_redirect: convertBooleanToString(sslRedirect),
    wildcard: convertBooleanToString(wildcard),
    catch_not_found: defaultCampaignId !== '0' ? convertBooleanToString(catchNotFound) : '0',
    default_campaign_id: defaultCampaignId,
  };

  if (addAnotherOne) {
    params.is_ssl = '0';
    params.wildcard = '0';
  }

  if (!allowIndexing) {
    params.allow_indexing = allowIndexing;
  }

  const response = await api.post<DomainServerResponse[]>('?object=domains.create', { ...params });
  const domains = <Domain[]>(<unknown>convertSnakeToCamelCase<DomainServerResponse>(response.data));
  return domains;
};

export const updateStatus = async (ids: number[]): Promise<Domain[]> => {
  const response = await api.post<DomainServerResponse[]>('?object=domains.updateStatus', { ids });
  const domains = <Domain[]>(<unknown>convertSnakeToCamelCase<DomainServerResponse>(response.data));
  return domains;
};

export const moveToArchive = async (ids: number[]): Promise<Domain[]> => {
  const response = await api.post<DomainServerResponse[]>('?object=domains.archive', { ids });
  const domains = <Domain[]>(<unknown>convertSnakeToCamelCase<DomainServerResponse>(response.data));
  return domains;
};

export const saveNote = async (id: number, note: Domain['notes']): Promise<Domain> => {
  const response = await api.post<DomainServerResponse[]>('?object=domains.saveNote', { note, id });
  const domain = <Domain>(<unknown>convertSnakeToCamelCase<DomainServerResponse>(response.data));
  return domain;
};

export const update = async (domain: Domain, values: DomainCreation): Promise<Domain> => {
  const { name, allowIndexing, defaultCampaignId, catchNotFound, sslRedirect, wildcard } = values;
  const convertDomainFields = convertCamelCaseToSnakeCase<Domain>(domain);
  const domainWithNewFileds: DomainServerFields = {
    ...convertDomainFields,
    name,
    ssl_redirect: convertBooleanToString(sslRedirect),
    wildcard: convertBooleanToString(wildcard),
    default_campaign_id: defaultCampaignId || '0',
    catch_not_found: convertBooleanToString(catchNotFound),
    allow_indexing: allowIndexing,
  };
  const response = await api.post<DomainServerResponse>('?object=domains.update', { ...domainWithNewFileds });
  const { data } = response;
  const convertDomain = <Domain>(<unknown>convertSnakeToCamelCase<DomainServerResponse>(data));

  const updatedDomain: Domain = {
    ...convertDomain,
    sslRedirect: convertStringToBoolean(data.ssl_redirect),
    wildcard: convertStringToBoolean(data.wildcard),
    catchNotFound: convertStringToBoolean(data.catch_not_found),
  };

  return updatedDomain;
};

export const deleted = async (): Promise<Domain[]> => {
  const response = await api.get<DomainServerResponse[]>('?object=domains.deleted');
  const domains = <Domain[]>(<unknown>convertSnakeToCamelCase<DomainServerResponse>(response.data));
  return domains;
};

export const restore = async (id: string): Promise<Domain[]> => {
  const response = await api.post<DomainServerResponse[]>('?object=domains.restore', { id });
  const domains = <Domain[]>(<unknown>convertSnakeToCamelCase<DomainServerResponse>(response.data));
  return domains;
};

export const cleanArchive = async (): Promise<null> => {
  const response = await api.post<null>('?object=domains.cleanArchive');
  return response.data;
};

export const getDomainById = async (id: string): Promise<Domain> => {
  const response = await api.post<DomainServerResponse>('?object=domains.show', { id });
  const domain = <Domain>(<unknown>convertSnakeToCamelCase<DomainServerResponse>(response.data));
  return domain;
};
