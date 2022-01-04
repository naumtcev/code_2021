/* eslint-disable react/no-danger */
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const Description: FC = () => {
  const { t } = useTranslation();
  return <div className="mt-3" dangerouslySetInnerHTML={{ __html: t('domains.description') }} />;
};
