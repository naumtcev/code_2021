import React, { FC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { KModal } from '@ui/KModal/KModal';
import { AppDispatch, AppState } from '@core/redux/store';

import { DomainCreation } from '@components/DomainsPage/models/DomainCreation';
import { KSpinner } from '@ui/KSpinner/KSpinner';
import { WindowServiceContext } from '@components/DomainsPage/WindowService/WindowServiceContext';
import { FormikHelpers } from 'formik';
import { ServerValidationError } from '@core/api/errrors/ServerValidationError';
import { EditWindowBody } from './EditWindowBody/EditWindowBody';

type Props = {
  onCancel: () => void;
};
export const EditWindow: FC<Props> = ({ onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const isDataLoading = useSelector((state: AppState) => state.domains.editing?.isDataLoading);
  const { loadDomain, saveDomain } = useContext(WindowServiceContext);

  const editDomainId = useSelector((state: AppState) => state.domains.editDomainId);

  useEffect(() => {
    if (editDomainId) {
      loadDomain(editDomainId);
    }
  }, [dispatch, editDomainId, loadDomain]);

  const handleOnSubmit = async (values: DomainCreation, helpers: FormikHelpers<DomainCreation>) => {
    const { error } = await saveDomain(values);

    const { setErrors } = helpers;
    if (error && error instanceof ServerValidationError) {
      setErrors(error.getPayload());
    }
  };

  return (
    <KModal title={t('domains.editing')} size="lg" onHide={onCancel}>
      {isDataLoading ? (
        <KModal.Body>
          <KSpinner className="block text-center" />
        </KModal.Body>
      ) : (
        <EditWindowBody onCancel={onCancel} onSubmit={handleOnSubmit} />
      )}
    </KModal>
  );
};
