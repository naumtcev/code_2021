/* eslint-disable react/no-danger */
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState } from '@core/redux/store';
import { useSelector } from 'react-redux';
import { KAlert } from '@ui/KAlert/KAlert';

export const Alert: FC = () => {
  const { t } = useTranslation();
  const isUpgradeInstallerStatus = useSelector((state: AppState) => state.domains.isUpgradeInstallerStatus);

  return isUpgradeInstallerStatus ? (
    <KAlert variant="warning">
      <div dangerouslySetInnerHTML={{ __html: t('domains.ssl_status.update_installer') }} />
    </KAlert>
  ) : (
    <></>
  );
};
