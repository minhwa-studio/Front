import React, { createContext, useState, useContext } from "react";

// 로그인 상태와 사용자 정보를 위한 Context 생성
const AuthContext = createContext();

// 모든 컴포넌트가 로그인 상태에 접근할 수 있도록 하는 Provider
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);

  const login = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context를 쉽게 사용할 수 있는 커스텀 훅
export const useAuth = () => {
  return useContext(AuthContext);
};