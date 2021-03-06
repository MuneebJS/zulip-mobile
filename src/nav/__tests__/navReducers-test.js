import deepFreeze from 'deep-freeze';

import { LOGIN_SUCCESS, INITIAL_FETCH_COMPLETE, REHYDRATE } from '../../actionConstants';
import navReducers from '../navReducers';
import { getStateForRoute } from '../navSelectors';
import { NULL_OBJECT } from '../../nullObjects';

describe('navReducers', () => {
  describe('LOGIN_SUCCESS', () => {
    test('replaces the existing route stack with "main" on sign in', () => {
      const prevState = deepFreeze({
        index: 2,
        routes: [{ key: 'one' }, { key: 'two' }, { key: 'password' }],
      });

      const action = deepFreeze({
        type: LOGIN_SUCCESS,
      });

      const expectedState = {
        index: 0,
        routes: [{ routeName: 'main' }],
      };

      const newState = navReducers(prevState, action);

      expect(newState.index).toEqual(expectedState.index);
      expect(newState.routes[0].routeName).toEqual(expectedState.routes[0].routeName);
    });
  });

  describe('INITIAL_FETCH_COMPLETE', () => {
    test('do not mutate navigation state if already at the same route', () => {
      const prevState = getStateForRoute('main');

      const action = deepFreeze({
        type: INITIAL_FETCH_COMPLETE,
      });

      const newState = navReducers(prevState, action);

      expect(newState).toBe(prevState);
    });
  });

  describe('REHYDRATE', () => {
    test('when no previous navigation is given do not throw but return some result', () => {
      const initialState = NULL_OBJECT;

      const action = deepFreeze({
        type: REHYDRATE,
        payload: {
          accounts: [{ apiKey: '123' }],
          users: [],
          realm: {},
        },
      });

      const nav = navReducers(initialState, action);

      expect(nav.routes).toHaveLength(1);
    });

    test('if logged in, preserve the state', () => {
      const initialState = NULL_OBJECT;

      const action = deepFreeze({
        type: REHYDRATE,
        payload: {
          accounts: [{ apiKey: '123' }],
          users: [],
          nav: {
            routes: [{ routeName: 'route1' }, { routeName: 'route2' }],
          },
          realm: {},
        },
      });

      const nav = navReducers(initialState, action);

      expect(nav.routes).toHaveLength(2);
      expect(nav.routes[0].routeName).toEqual('route1');
      expect(nav.routes[1].routeName).toEqual('route2');
    });

    test('if not logged in, and no previous accounts, show welcome screen', () => {
      const initialState = NULL_OBJECT;

      const action = deepFreeze({
        type: REHYDRATE,
        payload: {
          accounts: [],
          users: [],
          nav: {
            routes: [],
          },
          realm: {},
        },
      });

      const nav = navReducers(initialState, action);

      expect(nav.routes).toHaveLength(1);
      expect(nav.routes[0].routeName).toEqual('welcome');
    });

    test('if more than one account and no active account, display account list', () => {
      const initialState = NULL_OBJECT;

      const action = deepFreeze({
        type: REHYDRATE,
        payload: {
          accounts: [{}, {}],
          users: [],
          nav: {
            routes: [],
          },
          realm: {},
        },
      });

      const nav = navReducers(initialState, action);

      expect(nav.routes).toHaveLength(1);
      expect(nav.routes[0].routeName).toEqual('account');
    });

    test('when only a single account and no other properties, redirect to welcome screen', () => {
      const initialState = NULL_OBJECT;

      const action = deepFreeze({
        type: REHYDRATE,
        payload: {
          accounts: [{ realm: 'https://example.com' }],
          users: [],
          nav: {
            routes: [],
          },
          realm: {},
        },
      });

      const nav = navReducers(initialState, action);

      expect(nav.routes).toHaveLength(1);
      expect(nav.routes[0].routeName).toEqual('welcome');
    });

    test('when multiple accounts and default one has realm and email, show account list', () => {
      const initialState = NULL_OBJECT;

      const action = deepFreeze({
        type: REHYDRATE,
        payload: {
          accounts: [
            { realm: 'https://example.com', email: 'johndoe@example.com' },
            { realm: 'https://example.com', email: 'janedoe@example.com' },
          ],
          users: [],
          nav: {
            routes: [],
          },
          realm: {},
        },
      });

      const nav = navReducers(initialState, action);

      expect(nav.routes).toHaveLength(1);
      expect(nav.routes[0].routeName).toEqual('account');
    });

    test('when default account has server and email set, redirect to welcome screen', () => {
      const initialState = NULL_OBJECT;

      const action = deepFreeze({
        type: REHYDRATE,
        payload: {
          accounts: [{ realm: 'https://example.com', email: 'johndoe@example.com' }],
          users: [],
          nav: {
            routes: [],
          },
          realm: {},
        },
      });

      const nav = navReducers(initialState, action);

      expect(nav.routes).toHaveLength(1);
      expect(nav.routes[0].routeName).toEqual('welcome');
    });
  });
});
