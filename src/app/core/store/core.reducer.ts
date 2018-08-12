import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from 'app/core/auth/store/auth.reducer';
import { environment } from 'environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';

// TODO: find a way to also add the feature module slices to this state as well?
export interface State {
  readonly auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
};

const devMetaReducers = [
  // Meta reducer that freezes the state tree to ensure that
  // accidental mutations fail fast in dev builds.
  storeFreeze,
];

export const metaReducers = environment.production ? [] : devMetaReducers;