import React, { FC } from 'react';
import { Toolbar } from '@components/DomainsPage/DomainsLayout/Container/Toolbar/Toolbar';
import { KSpinner } from '@ui/KSpinner/KSpinner';
import { DomainsEmpty } from '@components/DomainsPage/DomainsLayout/Container/DomainsEmpty/DomainsEmpty';
import { Table } from '@components/DomainsPage/DomainsLayout/Container/Table/Table';
import { AppState } from '@core/redux/store';
import { useSelector } from 'react-redux';
import { WindowServiceProvider } from '@components/DomainsPage/WindowService/WindowServiceProvider';

export const Container: FC = () => {
  const isDataLoading = useSelector((state: AppState) => state.domains.isDataLoading);
  const domains = useSelector((state: AppState) => state.domains.domains);

  return (
    <>
      <WindowServiceProvider>
        <Toolbar />
        {isDataLoading && <KSpinner />}
        {!domains.length && !isDataLoading && <DomainsEmpty />}
        {!!domains.length && !isDataLoading && <Table />}
      </WindowServiceProvider>
    </>
  );
};
