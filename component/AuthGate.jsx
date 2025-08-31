import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../AuthContext";

const AuthGate = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>로그인이 필요합니다.</Text>
      </View>
    );
  }

  return children;
};

export default AuthGate;
