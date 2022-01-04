import { AppThunkAction } from '@core/redux/store';
import { isUndefined, isEmpty, isNull } from 'lodash';
import { t } from '@core/i18n';
import {
  getDomains,
  create,
  updateStatus,
  moveToArchive,
  update,
  getDomainById,
  listAsOptions,
} from '@components/DomainsPage/domainApi';
import { Action } from '@components/DomainsPage/reducer';
import { handleHttpError } from '@core/notifications/thunks';
import { convertStringToNumber } from '@components/DomainsPage/helpers';
import { showSuccess } from '@core/notifications/notifications';
import { Domain } from '@components/DomainsPage/models/Domain';
import { DomainCreation } from '@components/DomainsPage/models/DomainCreation';
import { StatusEntry } from '@components/status/models/StatusEntry';
import { getStatusInstall } from '@components/status/statusApi';
import { Context as StatusContext } from '@components/status/StatusService/StatusServiceContext';
import { Action as AppAction } from '@components/layout/App/reducer';
import { addScheme, getRoot, filterDoubleSlashes } from '@helpers/urlService/urlService';

import { transformServerErrors } from '@core/api/helpers';
import { AxiosError } from 'axios';
import { ResponseEntry } from '@core/api/models/ResponseEntry';
import { Action as GlobalAction } from '@components/layout/ResourceLoader/reducer';
import {
  INSTALLATION_WITH_ROBOTS_REDIRECT,
  UPGRADE_INFO_VERSION_FINISH,
  UPGRADE_INFO_VERSION_START,
} from './constants';

export const setDomains = (domains: Domain[]): AppThunkAction => {
  return (dispatch) => {
    dispatch({ type: Action.SET_DOMAINS, domains });
  };
};

export const setIsDataLoading = (isDataLoading: boolean): AppThunkAction => {
  return (dispatch) => {
    dispatch({ type: Action.SET_IS_DATA_LOADING, isDataLoading });
  };
};

export const setProgressRequest = (isCheckingInProgress: boolean): AppThunkAction => {
  return (dispatch) => {
    dispatch({ type: Action.SET_IS_CHECKING_IN_PROGRESS, isCheckingInProgress });
  };
};

export const reload = (): AppThunkAction<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setIsDataLoading(true));

    try {
      const domains = await getDomains();
      dispatch({ type: Action.SET_DOMAINS, domains });
    } catch (e) {
      dispatch(handleHttpError(e));
    }
  };
};

export const getInstallationVersion = (
  getVersionInstall: StatusContext['getVersionInstall'],
): AppThunkAction<Promise<void>> => {
  return async (dispatch) => {
    try {
      const result: StatusEntry = await getStatusInstall();
      const versionInstall = getVersionInstall(result.installationMethod);
      const installationWithRobotsRedirectResult = versionInstall >= INSTALLATION_WITH_ROBOTS_REDIRECT;
      const isUpgradeInstallerStatus =
        versionInstall >= UPGRADE_INFO_VERSION_START && versionInstall <= UPGRADE_INFO_VERSION_FINISH;
      dispatch({
        type: Action.SET_SERVER_FEATURES,
        installationWithRobotsRedirect: installationWithRobotsRedirectResult,
        isUpgradeInstallerStatus,
      });
    } catch (e) {
      dispatch(handleHttpError(e));
    }
  };
};

export const initialize = (getVersionInstall: StatusContext['getVersionInstall']): AppThunkAction => {
  return async (dispatch) => {
    dispatch({ type: AppAction.SET_IS_LOADING, isLoading: true });
    try {
      dispatch({ type: Action.INIT_PAGE });
      await dispatch(reload());
      await dispatch(getInstallationVersion(getVersionInstall));
    } catch (e) {
      dispatch(handleHttpError(e));
    } finally {
      dispatch({ type: AppAction.SET_IS_LOADING, isLoading: false });
    }
  };
};

export const loadDomain = (id: string): AppThunkAction => {
  return async (dispatch, getState) => {
    const { editing } = getState().domains;
    if (editing?.isSaved) {
      return;
    }
    try {
      dispatch({ type: Action.EDITING_DOMAIN, payload: { isDataLoading: true } });
      const domain = await getDomainById(id);
      dispatch({ type: Action.EDITING_DOMAIN, payload: { domain, isDataLoading: false } });
    } catch (e) {
      dispatch(handleHttpError(e));
      dispatch({ type: Action.EDITING_DOMAIN, payload: { isDataLoading: false } });
    }
  };
};

export const resetEditingDomain = (): AppThunkAction => {
  return (dispatch) => {
    dispatch({ type: Action.SET_IS_EDIT_WINDOW_VISIBLE, isEditWindowVisible: false });
    dispatch({ type: Action.EDITING_DOMAIN, payload: null });
  };
};

export const createDomain = (values: DomainCreation): AppThunkAction<Promise<ResponseEntry>> => {
  return async (dispatch, getState) => {
    try {
      dispatch(setProgressRequest(true));
      const { domains } = getState().domains;
      const { addAnotherOne } = values;

      const result = await create(values);
      const ids = result.map((d) => d.id);
      const domainsWithNewStatuses = await updateStatus(convertStringToNumber(ids));

      dispatch(setDomains([...domains, ...domainsWithNewStatuses]));
      showSuccess(t('domains.created'));
      dispatch({
        type: Action.CREATING_DOMAIN,
        isCreateWindowVisible: addAnotherOne || false,
      });
      return {};
    } catch (e) {
      return { error: transformServerErrors(e) as AxiosError };
    } finally {
      dispatch(setProgressRequest(false));
    }
  };
};

export const setDomainAsOptions = (): AppThunkAction => {
  return async (dispatch) => {
    const domainOptions = await listAsOptions();
    dispatch({ type: GlobalAction.SET_DOMAIN_OPTIONS, domainOptions });
  };
};

export const deleteDomain = (): AppThunkAction => {
  return async (dispatch, getState) => {
    dispatch(setProgressRequest(true));
    try {
      const { selectedDomains, domains } = getState().domains;

      const deleteDomains: Domain[] = await moveToArchive(convertStringToNumber(selectedDomains));
      const deleteDomainsIds = deleteDomains.map((d) => d.id);
      const domainsAfterDelete = domains.filter((domain) => !deleteDomainsIds.includes(domain.id));
      dispatch(setDomains(domainsAfterDelete));
      showSuccess(t('forms.action_done'));
      dispatch(setProgressRequest(false));
      dispatch({ type: Action.SELECT_DOMAIN, id: null });
      dispatch({ type: Action.SET_IS_DELETE_WINDOW_VISIBLE, isDeleteWindowVisible: false });
      dispatch(setDomainAsOptions());
    } catch (e) {
      dispatch(handleHttpError(e));
      dispatch(setProgressRequest(false));
    }
  };
};

export const massCheckAllDomains = (): AppThunkAction => {
  return async (dispatch, getState) => {
    try {
      const { selectedDomains, domains } = getState().domains;
      dispatch(setProgressRequest(true));
      dispatch({
        type: Action.SET_CHECKING_DOMAINS,
        value: selectedDomains,
      });
      const domainsWithNewStatuses = await updateStatus(convertStringToNumber(selectedDomains));
      const domainsStatusesID = domainsWithNewStatuses.map((d) => d.id);

      const updatingStatus = domains.map((domain) => {
        const d = domain;
        if (domainsStatusesID.includes(d.id)) {
          const findDomain = domainsWithNewStatuses.find((t) => t.id === d.id);
          if (findDomain) {
            d.networkStatus = findDomain.networkStatus;
          }
        }
        return d;
      });

      dispatch(setDomains(updatingStatus));
      dispatch({ type: Action.SELECT_DOMAIN, id: null });
      dispatch({
        type: Action.SET_CHECKING_DOMAINS,
        value: [],
      });
      dispatch(setDomainAsOptions());
    } catch (e) {
      dispatch({ type: Action.SET_CHECKING_DOMAINS, value: [] });
      dispatch(handleHttpError(e));
    }
    dispatch(setProgressRequest(false));
  };
};

export const checkDomain = (id: string): AppThunkAction => {
  return async (dispatch, getState) => {
    const { domains } = getState().domains;
    const newCheckingDomains = [id];
    dispatch({ type: Action.SET_CHECKING_DOMAINS, value: newCheckingDomains });
    try {
      const result = await updateStatus(convertStringToNumber(newCheckingDomains));
      const updateDomains = domains.map((domain) => {
        let d = domain;
        if (domain.id === id) {
          d = { ...domain, ...result };
        }
        return d;
      });

      dispatch(setDomains(updateDomains));
      dispatch({
        type: Action.SET_CHECKING_DOMAINS,
        value: newCheckingDomains.filter((checkIingId) => checkIingId !== id),
      });
      dispatch(setDomainAsOptions());
    } catch (e) {
      dispatch({ type: Action.SET_CHECKING_DOMAINS, value: [] });
      dispatch(handleHttpError(e));
    }
    dispatch({ type: Action.SELECT_DOMAIN, id: null });
  };
};

export const saveDomain = (values: DomainCreation): AppThunkAction<Promise<ResponseEntry>> => {
  return async (dispatch, getState) => {
    const { domains, editDomainId } = getState().domains;

    const domain: Domain | undefined = domains.find((d: Domain) => d.id === editDomainId);

    if (!domain) {
      return {};
    }
    try {
      dispatch(setProgressRequest(true));

      const domainAfterUpdate = await update(domain, values);
      const mustBeChecked = domain.name !== domainAfterUpdate.name || domain.isSsl !== domainAfterUpdate.isSsl;
      const newDomains = domains.map((domain) => (domain.id === domainAfterUpdate.id ? domainAfterUpdate : domain));

      if (mustBeChecked) {
        checkDomain(domain.id);
      }

      dispatch({ type: Action.EDITING_DOMAIN, payload: { isSaved: true, isEditWindowVisible: false } });
      dispatch(setDomains(newDomains));
      showSuccess(t('forms.all_saved'));
      dispatch(setDomainAsOptions());
    } catch (e) {
      dispatch({ type: Action.EDITING_DOMAIN, payload: { isSaved: false, isEditWindowVisible: true, domain } });
      return { error: transformServerErrors(e) as AxiosError };
    } finally {
      dispatch(setProgressRequest(false));
    }
    return {};
  };
};

export const onToggleSelectDomain = (id: string): AppThunkAction => {
  return (dispatch) => {
    dispatch({ type: Action.SELECT_DOMAIN, id });
  };
};

export const findDomain = (domains: Domain[], id: string): string => {
  const DEFAULT_DOMAIN: string = addScheme(getRoot());
  if (isUndefined(id) || isNull(id) || isEmpty(domains)) {
    return DEFAULT_DOMAIN;
  }
  const domainID = parseInt(id, 10);
  const name: string = domains.find((domain) => parseInt(domain.id, 10) === domainID)?.name || '';
  if (!name) {
    return DEFAULT_DOMAIN;
  }
  return filterDoubleSlashes(name);
};
