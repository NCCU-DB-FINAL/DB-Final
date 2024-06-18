import { Dispatch, SetStateAction, createContext } from "react";

export interface User {
  token: string;
  name: string;
  type: string;
}

interface UserContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContext>({
  user: null,
  setUser: () => {},
});
