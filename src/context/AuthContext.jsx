/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize state by parsing the stringified object from localStorage
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem("adminAuth");
    return savedAuth ? JSON.parse(savedAuth) : null;
  });

  const login = (token, user) => {
    const authData = { token, user };
    localStorage.setItem("adminAuth", JSON.stringify(authData));
    setAuth(authData);
  };

  const logout = () => {
    localStorage.removeItem("adminAuth");
    setAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        isAuthenticated: !!auth?.token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
