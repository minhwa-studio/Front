import React, { createContext, useState, useContext } from "react"; // ✅ 추가됨

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setUserName(userData.name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
