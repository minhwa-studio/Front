import React from "react";
import { useAuth } from "../AuthContext";
import { ActivityIndicator, View } from "react-native";

const AuthGate = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isLoggedIn ? children : null;
};

export default AuthGate;
