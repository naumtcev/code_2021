import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { KAlert } from '@ui/KAlert/KAlert';

export const DomainsEmpty: FC = () => {
  const { t } = useTranslation();
  return (
    <KAlert variant="info" className="text-center">
      {t('domains.empty')}
    </KAlert>
  );
};
