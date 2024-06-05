import { useContext } from "react";
import { User, UserContext } from "../context/UserContext";

/**
 * Some utility functions for user auth
 */
export const useAuth = () => {
  /**
   * The key for storing user in localStorage
   */
  const USER_KEY = "RENT_USER";

  const { user, setUser } = useContext(UserContext);

  const isLoggedIn = () => {
    return user !== null;
  };

  /**
   * Get user type with Chinese
   */
  const getUserType = () => {
    if (!isLoggedIn()) return null;

    return user?.type === "tenant" ? "租客" : "房東";
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  };

  return { isLoggedIn, user, login, logout, getUserType };
};
