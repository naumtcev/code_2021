import { Option } from '@ui/KSelect/models/Option';
import { CampaignOption } from '@components/campaigns/models/CampaignOption';

export const cleanDomainName = (text: string): string => {
  if (/^(https?\\:\/\/)/.test(text)) {
    return text.replace(/^(https?\\:\/\/)/, '');
  }
  return text.replace(/[\\/\\]+$/g, '');
};

export const convertStringToNumber = (arr: string[]): number[] => arr.map((a) => parseInt(a, 10));

export const formatCampaignList = (arr: CampaignOption[]): Option[] =>
  arr.map((o) => ({ ...o, label: o.name, value: o.value?.toString() }));

export const convertStringToBoolean = (str: string): boolean => str !== '0';

export const convertBooleanToString = (bool: boolean): string => (bool ? '1' : '0');
