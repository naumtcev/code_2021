import { Action, Actions, initState, reducer, State } from './reducer';
import { Domain } from './models/Domain';

const domainMock: Domain = {
  allowIndexing: true,
  campaignsCount: 0,
  catchNotFound: true,
  checkRetries: 16,
  createdAt: '2021-03-18 02:19:38',
  defaultCampaign: '',
  defaultCampaignId: '0',
  errorDescription: "Couldn't resolve host name",
  id: '39',
  isSsl: false,
  name: '1.com',
  networkStatus: 'validating',
  nextCheckAt: '2021-03-22 05:05:09.000000',
  notes: '',
  sslData: null,
  sslRedirect: false,
  sslStatus: 'error',
  state: 'active',
  updatedAt: '2021-03-18 02:19:38',
  wildcard: false,
};

describe(Action.SELECT_DOMAIN, () => {
  it('select domain', () => {
    const state: State = { ...initState, selectedDomains: [domainMock.id] };

    const action: Actions = { type: Action.SELECT_DOMAIN, id: '40' };
    const newState = reducer(state, action);

    expect(newState.selectedDomains.length).toEqual(2);
  });

  it('reset selected domains', () => {
    const state: State = { ...initState, selectedDomains: [domainMock.id] };

    const action: Actions = { type: Action.SELECT_DOMAIN, id: null };
    const newState = reducer(state, action);

    expect(newState.selectedDomains.length).toEqual(0);
  });
});

describe(Action.SELECT_ALL_DOMAINS, () => {
  it('mass select domains', () => {
    const state: State = { ...initState, selectedDomains: [], domains: [domainMock] };

    const newSelectedDomains = state.domains.map((d) => d.id);

    const action: Actions = { type: Action.SELECT_ALL_DOMAINS };
    const newState = reducer(state, action);

    expect(newState.selectedDomains).toEqual(newSelectedDomains);
  });

  it('mass unselect domains', () => {
    const state: State = { ...initState, selectedDomains: [domainMock.id] };

    const action: Actions = { type: Action.SELECT_ALL_DOMAINS };
    const newState = reducer(state, action);

    expect(newState.selectedDomains).toEqual([]);
  });
});
