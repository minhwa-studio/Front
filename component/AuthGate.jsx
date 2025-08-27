// src/components/AuthGate.jsx
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
// authStore가 default export(useAuthStore)라고 가정
import useAuthStore from "../Store/authStore.js";

export default function AuthGate({ children }) {
  const navigation = useNavigation();
  const route = useRoute();
  const token = useAuthStore((s) => s.user?.token);
  const [redirecting, setRedirecting] = React.useState(false);

  React.useEffect(() => {
    // 이미 로그인 화면이면 리다이렉트하지 않음
    if (!token && route.name !== "Login") {
      setRedirecting(true);
      // 스택을 통째로 교체해서 뒤로가기 방지
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } else {
      setRedirecting(false);
    }
  }, [token, route.name, navigation]);

  if (!token || redirecting) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
