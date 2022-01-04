import { Domain } from '@components/DomainsPage/models/Domain';

export enum Action {
  INIT_PAGE = 'DOMAINS/INIT_PAGE',
  SET_WINDOW_VISIBLE = 'DOMAINS/SET_WINDOW_VISIBLE',
  SET_ACTIVE_DOMAIN_ID = 'DOMAINS/SET_ACTIVE_DOMAIN_ID',
  SET_IS_DATA_LOADING = 'DOMAINS/SET_IS_DATA_LOADING',
  SET_IS_CHECKING_IN_PROGRESS = 'DOMAINS/SET_IS_CHECKING_IN_PROGRESS',
  SET_DOMAINS = 'DOMAINS/SET_DOMAINS',
  SET_SERVER_FEATURES = 'DOMAINS/SET_SERVER_FEATURES',
  SELECT_DOMAIN = 'DOMAINS/SELECT_DOMAIN',
  SELECT_ALL_DOMAINS = 'DOMAINS/SELECT_ALL_DOMAINS',
  SET_CHECKING_DOMAINS = 'DOMAINS/SET_CHECKING_DOMAINS',
  SET_NOTES = 'DOMAINS/SET_NOTES',
  EDITING_DOMAIN = 'DOMAINS/EDITING_DOMAIN',
  SET_IS_DELETE_WINDOW_VISIBLE = 'DOMAINS/SET_IS_DELETE_WINDOW_VISIBLE',
  CREATING_DOMAIN = 'DOMAINS/CREATING_DOMAIN',
  SET_IS_EDIT_WINDOW_VISIBLE = 'DOMAINS/SET_IS_EDIT_WINDOW_VISIBLE',
  SET_IS_EDIT_DOMAIN_ID = 'DOMAINS/SET_IS_EDIT_DOMAIN_ID',
}
type EDITING_DOMAIN = {
  isSaved?: boolean;
  domain?: Domain;
  isDataLoading?: boolean;
};

export type Actions =
  | { type: Action.INIT_PAGE }
  | { type: Action.SET_IS_DATA_LOADING; isDataLoading: boolean }
  | { type: Action.SET_IS_CHECKING_IN_PROGRESS; isCheckingInProgress: boolean }
  | { type: Action.SET_DOMAINS; domains: Domain[] }
  | { type: Action.SET_SERVER_FEATURES; installationWithRobotsRedirect: boolean; isUpgradeInstallerStatus: boolean }
  | { type: Action.SELECT_DOMAIN; id: string | null }
  | { type: Action.SELECT_ALL_DOMAINS }
  | { type: Action.SET_CHECKING_DOMAINS; value: string[] }
  | { type: Action.SET_NOTES; domain: Domain }
  | { type: Action.EDITING_DOMAIN; payload: EDITING_DOMAIN | null }
  | { type: Action.SET_IS_DELETE_WINDOW_VISIBLE; isDeleteWindowVisible: boolean }
  | { type: Action.CREATING_DOMAIN; isCreateWindowVisible: boolean }
  | { type: Action.SET_IS_EDIT_WINDOW_VISIBLE; isEditWindowVisible: boolean }
  | { type: Action.SET_IS_EDIT_DOMAIN_ID; editDomainId: string | null };

export type State = {
  isInitialized: boolean;
  isDataLoading: boolean;
  isCheckingInProgress: boolean;
  domains: Domain[];
  checkingDomains: string[];
  selectedDomains: string[];
  installationWithRobotsRedirect: boolean;
  isUpgradeInstallerStatus: boolean;
  editing: EDITING_DOMAIN | null;
  isDeleteWindowVisible: boolean;
  isCreateWindowVisible: boolean;
  isEditWindowVisible: boolean;
  editDomainId: string | null;
};

export const initState: State = {
  isInitialized: true,
  isDataLoading: false,
  isCheckingInProgress: false,
  domains: [],
  checkingDomains: [],
  selectedDomains: [],
  installationWithRobotsRedirect: false,
  isUpgradeInstallerStatus: false,
  editing: null,
  isDeleteWindowVisible: false,
  isCreateWindowVisible: false,
  isEditWindowVisible: false,
  editDomainId: null,
};

export const reducer = (state: State = initState, action: Actions): State => {
  switch (action.type) {
    case Action.SET_IS_EDIT_WINDOW_VISIBLE: {
      const { isEditWindowVisible } = action;
      return {
        ...state,
        isEditWindowVisible,
      };
    }
    case Action.SET_IS_EDIT_DOMAIN_ID: {
      const { editDomainId } = action;
      return {
        ...state,
        editDomainId,
      };
    }
    case Action.INIT_PAGE: {
      return {
        ...state,
        isInitialized: false,
      };
    }
    case Action.SET_IS_DATA_LOADING: {
      const { isDataLoading } = action;
      return {
        ...state,
        isDataLoading,
      };
    }
    case Action.SET_IS_CHECKING_IN_PROGRESS: {
      const { isCheckingInProgress } = action;
      return {
        ...state,
        isCheckingInProgress,
      };
    }
    case Action.SET_DOMAINS: {
      const { domains } = action;
      return {
        ...state,
        isDataLoading: false,
        domains,
      };
    }
    case Action.SET_SERVER_FEATURES: {
      const { installationWithRobotsRedirect, isUpgradeInstallerStatus } = action;
      return {
        ...state,
        installationWithRobotsRedirect,
        isUpgradeInstallerStatus,
      };
    }
    case Action.SELECT_DOMAIN: {
      const { selectedDomains } = state;
      const { id } = action;
      if (!id) {
        return {
          ...state,
          selectedDomains: [],
        };
      }

      let newSelectedMap = selectedDomains;
      const indexID = selectedDomains.indexOf(id);
      if (indexID !== -1) {
        selectedDomains.splice(indexID, 1);
        newSelectedMap = selectedDomains;
      } else {
        newSelectedMap = [...selectedDomains, id];
      }

      return {
        ...state,
        selectedDomains: newSelectedMap,
      };
    }

    case Action.SELECT_ALL_DOMAINS: {
      const { domains, selectedDomains } = state;
      let newSelectedDomains: string[] = [];
      if (selectedDomains.length < domains.length) {
        newSelectedDomains = domains.map((d) => d.id);
      }
      return {
        ...state,
        selectedDomains: newSelectedDomains,
      };
    }
    case Action.SET_CHECKING_DOMAINS:
      return {
        ...state,
        checkingDomains: action.value,
        domains: state.domains,
      };
    case Action.SET_NOTES: {
      const { domain } = action;
      const { domains } = state;
      const newDomains: Domain[] = domains.map((d) => (domain.id === d.id ? domain : d));
      return {
        ...state,
        domains: newDomains,
      };
    }
    case Action.EDITING_DOMAIN: {
      const { payload } = action;
      if (!payload) {
        return {
          ...state,
          editing: null,
        };
      }
      return {
        ...state,
        editing: { ...payload },
      };
    }
    case Action.SET_IS_DELETE_WINDOW_VISIBLE: {
      const { isDeleteWindowVisible } = action;
      return {
        ...state,
        isDeleteWindowVisible,
      };
    }
    case Action.CREATING_DOMAIN: {
      const { isCreateWindowVisible } = action;
      return {
        ...state,
        isCreateWindowVisible,
      };
    }

    default:
      return state;
  }
};
