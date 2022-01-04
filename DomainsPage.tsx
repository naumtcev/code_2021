import React, { FC } from 'react';
import { DataLoader } from '@components/DomainsPage/DataLoader/DataLoader';
import { Domains } from '@components/DomainsPage/DomainsLayout/Domains';
import { PageServiceProvider } from '@components/DomainsPage/PageService/PageServiceProvider';
import { StatusServiceProvider } from '@components/status/StatusService/StatusServiceProvider';
import { LicenseServiceProvider } from '@components/layout/license/LicenseService/LicenseServiceProvider';

export const DomainsPage: FC = () => {
  return (
    <PageServiceProvider>
      <StatusServiceProvider>
        <LicenseServiceProvider>
          <DataLoader>
            <Domains />
          </DataLoader>
        </LicenseServiceProvider>
      </StatusServiceProvider>
    </PageServiceProvider>
  );
};
