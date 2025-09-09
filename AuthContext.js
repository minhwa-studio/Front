// AuthContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 전역 인증 컨텍스트
 * - isLoggedIn: 로그인 여부
 * - user: 사용자 전체 객체 (id, name 등)
 * - login(userData): 로그인 처리 + AsyncStorage 저장
 * - logout(): 로그아웃 + AsyncStorage 삭제
 * - loading: 앱 시작 시 복원 중 여부
 */

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  // ⬇️ 호환 레이어 추가
  userName: null,
  userId: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 로그인
  const login = async (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (e) {
      console.error("AsyncStorage setItem 실패:", e);
    }
  };

  // ✅ 로그아웃
  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    try {
      await AsyncStorage.removeItem("user");
    } catch (e) {
      console.error("AsyncStorage removeItem 실패:", e);
    }
  };

  // ✅ 앱 시작 시 로그인 상태 복원
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setIsLoggedIn(true);
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

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      // ⬇️ 호환 레이어: 기존 화면에서 그대로 쓰던 userName/userId 노출
      userName: user?.name ?? user?.username ?? user?.email ?? null,
      userId: user?.id ?? user?._id ?? null,
      login,
      logout,
      loading,
    }),
    [isLoggedIn, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
