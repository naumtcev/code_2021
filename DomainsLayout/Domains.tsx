import React, { FC } from 'react';
import { Alert } from '@components/DomainsPage/DomainsLayout/Alert/Alert';
import { Description } from '@components/DomainsPage/DomainsLayout/Description/Description';
import { Container } from '@components/DomainsPage/DomainsLayout/Container/Container';
import { Header } from '@components/DomainsPage/DomainsLayout/Header/Header';

export const Domains: FC = () => {
  return (
    <>
      <Header />
      <Alert />
      <Container />
      <Description />
    </>
  );
};
