import { ReactNode } from "react";

export type ActionTypes =
  | "MERGE_STATE"
  | "CLEAR_STATE"
  | "UPDATE_STATE"
  | "CANCEL"
  | "ERROR";

export declare interface ProviderProps {
  children: ReactNode;
}

export declare interface State {
  loading: boolean;
  error: any;
  profile: Profile;
}

export declare interface Payload {
  loading?: boolean;
  error?: any;
  profile?: Profile;
}

export declare interface Action {
  type: ActionTypes;
  payload: Payload;
}

export interface ContextProps {
  state: State;
  dispatch(callback: Action | Promise<Action> | Function): Promise<void>;
}

export interface Profile {
  id: number;
  name: string;
  slug: string;
  url: string;
  description: string;
  link: string;
}
