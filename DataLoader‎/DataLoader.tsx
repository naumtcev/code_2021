import { AppDispatch, AppState } from '@core/redux/store';
import React, { FC, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initialize } from '@components/DomainsPage/thunks';
import { StatusServiceContext } from '@components/status/StatusService/StatusServiceContext';

export const DataLoader: FC = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getVersionInstall } = useContext(StatusServiceContext);
  const isLoading = useSelector((state: AppState) => state.global.app.isLoading);

  useEffect(() => {
    dispatch(initialize(getVersionInstall));
  }, [dispatch, getVersionInstall]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};
