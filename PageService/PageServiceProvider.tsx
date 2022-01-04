import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@core/redux/store';
import { Context, PageServiceContext } from '@components/DomainsPage/PageService/PageServiceContext';
import { Action } from '@components/DomainsPage/reducer';

import { massCheckAllDomains, checkDomain, onToggleSelectDomain } from '@components/DomainsPage/thunks';

export const PageServiceProvider: FC = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  const contextValues: Context = {
    massCheckAllDomains: () => {
      dispatch(massCheckAllDomains());
    },

    checkDomain: (id) => {
      dispatch(checkDomain(id));
    },

    selectAllDomains: () => {
      dispatch({ type: Action.SELECT_ALL_DOMAINS });
    },

    onToggleSelectDomain: (id) => {
      dispatch(onToggleSelectDomain(id));
    },
  };

  return <PageServiceContext.Provider value={contextValues}>{children}</PageServiceContext.Provider>;
};
