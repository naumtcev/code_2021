import React, { FC, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { AppDispatch } from '@core/redux/store';
import { NotificationContext } from '@core/notifications/NotificationProvider/NotificationContext';
import { Context, WindowServiceContext } from '@components/DomainsPage/WindowService/WindowServiceContext';
import { Action } from '@components/DomainsPage/reducer';
import { saveNote } from '@components/DomainsPage/domainApi';
import { Domain } from '@components/DomainsPage/models/Domain';

import { createDomain, saveDomain, deleteDomain, loadDomain, resetEditingDomain } from '@components/DomainsPage/thunks';
import { TIME_DEBOUNCE } from '../constants';

export const WindowServiceProvider: FC = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { handleHttpError } = useContext(NotificationContext);

  const contextValues: Context = {
    createDomain: (values) => {
      return dispatch(createDomain(values));
    },

    deleteDomains: () => {
      dispatch(deleteDomain());
    },
    saveNoteDomain: debounce(async (id: number, value: Domain['notes']) => {
      try {
        if (id) {
          const domain: Domain = await saveNote(id, value);
          dispatch({ type: Action.SET_NOTES, domain });
        }
      } catch (e) {
        handleHttpError(e);
      }
    }, TIME_DEBOUNCE),

    saveDomain: (values) => {
      return dispatch(saveDomain(values));
    },

    loadDomain: (id) => {
      dispatch(loadDomain(id));
    },

    resetEditingDomain: () => {
      dispatch(resetEditingDomain());
    },
  };

  return <WindowServiceContext.Provider value={contextValues}>{children}</WindowServiceContext.Provider>;
};
