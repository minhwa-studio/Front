// component/AuthGate.jsx
import React, { useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../AuthContext";

/**
 * 보호 라우트 게이트
 * - loading 동안에는 렌더링하지 않음 (깜빡임 방지)
 * - 비로그인 상태면 Alert 없이 즉시 Login으로 스택 초기화 이동
 */
export default function AuthGate({ children }) {
  const navigation = useNavigation();
  const { isLoggedIn, loading } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (!loading && !isLoggedIn) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    }, [loading, isLoggedIn, navigation])
  );

  // 로딩 중이거나 비로그인일 때는 보호 화면을 렌더하지 않음
  if (loading || !isLoggedIn) return null;

  return children;
}
