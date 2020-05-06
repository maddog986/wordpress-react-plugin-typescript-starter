import { Action } from "./types";

// --------------------------------------------------------------
// Global

// update state using key name
export const updateState = (name: string, payload: any): Action => ({
  type: "UPDATE_STATE",
  payload: {
    [name]: payload,
  },
});

// updates loading state
export const setLoading = (loading: boolean): Action =>
  updateState("loading", loading);

// sets an error message
export const setError = (error: string): Action => ({
  type: "ERROR",
  payload: {
    error,
  },
});
