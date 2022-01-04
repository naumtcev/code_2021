import React, { FC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Table as TableBootstrap } from 'react-bootstrap';
import { Row } from '@components/DomainsPage/DomainsLayout/Container/Table/Row/Row';
import { Domain } from '@components/DomainsPage/models/Domain';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '@core/redux/store';
import { PageServiceContext } from '@components/DomainsPage/PageService/PageServiceContext';
import './styles.sass';
import { WindowServiceContext } from '@components/DomainsPage/WindowService/WindowServiceContext';
import { EditWindow } from '@components/DomainsPage/DomainsLayout/Container/Table/Row/EditWindow/EditWindow';
import { Action } from '@components/DomainsPage/reducer';
import { Checkbox } from './Row/Checkbox/Checkbox';

export const Table: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const domains = useSelector((state: AppState) => state.domains.domains);
  const installationWithRobotsRedirect = useSelector((state: AppState) => state.domains.installationWithRobotsRedirect);
  const isEveryDomainSelected = useSelector(
    (state: AppState) => state.domains.domains.length === state.domains.selectedDomains.length,
  );
  const { selectAllDomains } = useContext(PageServiceContext);

  const isEditWindowVisible = useSelector((state: AppState) => state.domains.isEditWindowVisible);
  const isSaved = useSelector((state: AppState) => state.domains.editing?.isSaved);
  const { resetEditingDomain } = useContext(WindowServiceContext);
  useEffect(() => {
    if (isSaved) {
      resetEditingDomain();
    }
  }, [dispatch, isSaved, resetEditingDomain]);

  return (
    <>
      <TableBootstrap responsive striped bordered hover size="sm">
        <thead>
          <tr>
            <th>
              <Checkbox defaultChecked={isEveryDomainSelected} onClick={selectAllDomains} />
            </th>
            <th>{t('grid.id')}</th>
            <th>{t('domains.name')}</th>
            <th className="table-column-10"> </th>
            <th className="table-column-10">{t('domains.is_ssl')}</th>
            <th className="table-column-10 text-ellipsis">{t('domains.wildcard_short')}</th>
            <th className="table-column-10 text-ellipsis">{t('domains.redirect_title')}</th>
            {installationWithRobotsRedirect && (
              <th className="table-column-10 text-ellipsis">{t('domains.indexing')}</th>
            )}
            <th className="table-column-30 text-ellipsis">{t('domains.campaigns_count')}</th>
            <th className="table-column-250 text-ellipsis">{t('domains.default_campaign')}</th>
            <th>{t('domains.state')}</th>
            <th>{t('domains.ssl_status_title')}</th>
            <th className="table-column-300"> </th>
          </tr>
        </thead>
        <tbody>
          {domains.map((domain: Domain) => (
            <Row domain={domain} key={domain.id} />
          ))}
        </tbody>
      </TableBootstrap>

      {isEditWindowVisible && (
        <EditWindow
          onCancel={() => dispatch({ type: Action.SET_IS_EDIT_WINDOW_VISIBLE, isEditWindowVisible: false })}
        />
      )}
    </>
  );
};
