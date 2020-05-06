import { Dispatch } from "react";
import { Action, State } from "./types";

// setting up Action to support promises
export const asyncDispatch = (dispatch: Dispatch<Action>, state: State) => (
  action: Action | Function
): Promise<void> =>
  Promise.resolve()
    .then(() =>
      typeof action === "function" ? action(dispatch, state) : dispatch(action)
    )
    .catch((err: any) =>
      err && err.type ? dispatch(err) : Promise.reject(err)
    );
