import React, { FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KButton } from '@ui/KButton/KButton';
import { KSpinner } from '@ui/KSpinner/KSpinner';
import { Domain } from '@components/DomainsPage/models/Domain';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '@core/redux/store';
import { PageServiceContext } from '@components/DomainsPage/PageService/PageServiceContext';
import { NotesWindow } from '@components/DomainsPage/DomainsLayout/Container/Table/Row/NotesWindow/NotesWindow';
import { Action } from '@components/DomainsPage/reducer';
import { Checkbox } from './Checkbox/Checkbox';

type Props = {
  domain: Domain;
};
export const Row: FC<Props> = ({ domain }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { checkDomain, onToggleSelectDomain } = useContext(PageServiceContext);
  const installationWithRobotsRedirect = useSelector((state: AppState) => state.domains.installationWithRobotsRedirect);
  const isCheckingDomain = useSelector(
    (state: AppState) => !!state.domains.checkingDomains.find((cd) => cd === domain.id),
  );
  const isChecked = useSelector((state: AppState) => state.domains.selectedDomains.indexOf(domain.id) !== -1);
  const [isVisibleNotesWindow, setNotesWindowVisibility] = useState(false);

  return (
    <tr className={isChecked ? 'table-row-selected' : ''}>
      <td className="td-0-width">
        <Checkbox isChecked={isChecked} onClick={() => onToggleSelectDomain(domain.id)} />
      </td>
      <td className="td-0-width">{domain.id}</td>
      <td>
        <KButton
          variant="link"
          className="btn-link-clear text-small"
          onClick={() => {
            dispatch({ type: Action.SET_IS_EDIT_DOMAIN_ID, editDomainId: domain.id });
            dispatch({ type: Action.SET_IS_EDIT_WINDOW_VISIBLE, isEditWindowVisible: true });
          }}
        >
          {domain.name}
        </KButton>
      </td>
      <td>
        <>
          <a
            className={`grid-cell-actions-action grid-cell-notes ion ion-document-text${
              domain.notes ? ' grid-cell-notes-exists' : ''
            }`}
            onClick={() => {
              setNotesWindowVisibility(true);
            }}
          />
          {isVisibleNotesWindow && <NotesWindow id={domain.id} onClose={() => setNotesWindowVisibility(false)} />}
        </>
      </td>
      <td className="text-center">
        {domain.isSsl && <span>{t('forms.yes')}</span>}
        {!domain.isSsl && <span>{t('forms.no')}</span>}
      </td>
      <td className="text-center">
        {domain.wildcard && <span>{t('forms.yes')}</span>}
        {!domain.wildcard && <span>{t('forms.no')}</span>}
      </td>
      <td>
        {!domain.sslRedirect && <span>{t('forms.no')}</span>}
        {domain.sslRedirect && <span>{t('forms.yes')}</span>}
      </td>
      {installationWithRobotsRedirect && (
        <td className="text-center">
          <span>{domain.allowIndexing ? t('forms.allow') : t('forms.disallow')}</span>
        </td>
      )}
      <td>{domain.campaignsCount}</td>
      <td>{domain.defaultCampaign}</td>
      <td>
        {domain.networkStatus !== 'error' && !isCheckingDomain && (
          <span className="text-success">{t(`domains.network_status.${domain.networkStatus}`)}</span>
        )}
        {domain.networkStatus === 'error' && !isCheckingDomain && (
          <span className="text-danger">
            {t(`domains.network_status.${domain.networkStatus}`)} : {domain.errorDescription}
          </span>
        )}
        {isCheckingDomain && <KSpinner size="sm" />}
      </td>

      <td>
        {domain.sslStatus === 'error' ? (
          <a className="block-inline" href="/admin/#!/logs/ssl">
            {domain.sslStatus && t(`domains.ssl_status.${domain.sslStatus}`)}
          </a>
        ) : (
          <span>{domain.sslStatus && t(`domains.ssl_status.${domain.sslStatus}`)}</span>
        )}
      </td>
      <td className="text-right">
        {!isCheckingDomain && (
          <KButton variant="link" className="btn-link-clear text-small" onClick={() => checkDomain(domain.id)}>
            <span>{t('domains.check')}</span>
          </KButton>
        )}
      </td>
    </tr>
  );
};
