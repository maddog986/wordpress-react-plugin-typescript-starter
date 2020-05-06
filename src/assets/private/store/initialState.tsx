import { Profile } from "./types";

export const initialState = {
  loading: true,
  error: false,
  profile: {
    name: "Guest",
  } as Profile,
};
