import deepmerge from "deepmerge";
import { initialState } from "./initialState";
import { Action, State } from "./types";

export type ActionTypes =
  | "MERGE_STATE"
  | "CLEAR_STATE"
  | "UPDATE_STATE"
  | "CANCEL"
  | "ERROR";

// state handler functions
export const globalReducers = {
  // merge state
  MERGE_STATE: (state: State, { payload }: Action): State =>
    deepmerge(state, payload),

  // updates the state
  CLEAR_STATE: (state: State, { payload }: Action): State => ({
    ...initialState,
    ...payload,
  }),

  // update the state
  UPDATE_STATE: (state: State, { payload }: Action): State => ({
    ...state,
    ...payload,
  }),

  // dont update the state, unless its an error
  CANCEL: (state: State): State => state,

  // error state
  ERROR: (state: State, { payload: { error } }: Action): State => ({
    ...state,
    error,
  }),
};

// custom reducer
export const rootReducer = (state: State, action: Action) =>
  !globalReducers.hasOwnProperty(action.type)
    ? state
    : globalReducers[action.type](state, action);
