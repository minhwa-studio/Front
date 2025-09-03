import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null); // ✅ user 상태 추가
  const [loading, setLoading] = useState(true); // 초기 로딩 여부

  // ✅ 로그인
  const login = async (userData) => {
    setIsLoggedIn(true);
    setUserName(userData.name);
    setUserId(userData.id);
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData)); // 저장
  };

  // ✅ 로그아웃
  const logout = async () => {
    setIsLoggedIn(false);
    setUserName(null);
    setUserId(null);
    setUser(null);
    await AsyncStorage.removeItem("user"); // 삭제
  };

  // ✅ 앱 시작 시 로그인 상태 복원
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setIsLoggedIn(true);
          setUserName(parsed.name);
          setUserId(parsed.id);
          setUser(parsed);
        }
      } catch (err) {
        console.error("로그인 상태 복원 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    restoreUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userName, userId, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
