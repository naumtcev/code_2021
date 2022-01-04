/* eslint-disable react/no-danger */
import React, { FC, useContext } from 'react';
import { KButton } from '@ui/KButton/KButton';
import { useTranslation } from 'react-i18next';
import { PageServiceContext } from '@components/DomainsPage/PageService/PageServiceContext';
import { AppDispatch, AppState } from '@core/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { configService } from '@core/config/configService';
import { DeleteWindow } from '@components/DomainsPage/DomainsLayout/Container/Toolbar/DeleteWindow/DeleteWindow';
import { CreateWindow } from '@components/DomainsPage/DomainsLayout/Container/Toolbar/CreateWindow/CreateWindow';
import { LicenseServiceContext } from '@components/layout/license/LicenseService/LicenseServiceContext';
import { WindowServiceContext } from '@components/DomainsPage/WindowService/WindowServiceContext';
import { Action } from '@components/DomainsPage/reducer';

export const Toolbar: FC = React.memo(() => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const ip = configService.getServerIp();
  const domains = useSelector((state: AppState) => state.domains.domains);
  const { isBasicEdition } = useContext(LicenseServiceContext);
  const isViewAddButton = !(isBasicEdition() && !!domains.length);
  const { massCheckAllDomains } = useContext(PageServiceContext);
  const { deleteDomains } = useContext(WindowServiceContext);
  const isCheckingInProgress = useSelector((state: AppState) => state.domains.isCheckingInProgress);
  const hasSelectedDomains = useSelector((state: AppState) => state.domains.selectedDomains.length > 0);
  const isDeleteWindowVisible = useSelector((state: AppState) => state.domains.isDeleteWindowVisible);
  const isCreateWindowVisible = useSelector((state: AppState) => state.domains.isCreateWindowVisible);

  return (
    <div className="d-flex align-items-center mt-2 mb-2">
      {isViewAddButton && !hasSelectedDomains && (
        <div>
          <KButton
            variant="success"
            onClick={() => dispatch({ type: Action.CREATING_DOMAIN, isCreateWindowVisible: true })}
          >
            {t('forms.add')}
          </KButton>
        </div>
      )}
      {hasSelectedDomains && (
        <>
          <div>
            <KButton
              variant="danger"
              onClick={() => dispatch({ type: Action.SET_IS_DELETE_WINDOW_VISIBLE, isDeleteWindowVisible: true })}
            >
              {t('forms.archive')}
            </KButton>
          </div>
          <div className="ml-2">
            <KButton
              variant="secondary"
              onClick={massCheckAllDomains}
              isLoading={isCheckingInProgress}
              className="d-flex align-items-center"
            >
              {t('domains.check')}
            </KButton>
          </div>
        </>
      )}

      <div className="ml-2" dangerouslySetInnerHTML={{ __html: t('domains.desc_domain_connection', { ip }) }} />

      {isDeleteWindowVisible && (
        <DeleteWindow
          onCancel={() => dispatch({ type: Action.SET_IS_DELETE_WINDOW_VISIBLE, isDeleteWindowVisible: false })}
          onSubmit={() => deleteDomains()}
        />
      )}

      {isCreateWindowVisible && (
        <CreateWindow onCancel={() => dispatch({ type: Action.CREATING_DOMAIN, isCreateWindowVisible: false })} />
      )}
    </div>
  );
});
