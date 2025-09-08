// App.js
import "react-native-gesture-handler";
import * as React from "react";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Font from "expo-font";
import { View, Text, ActivityIndicator } from "react-native";

// ✅ AuthContext / Provider
import { AuthProvider } from "./AuthContext";

// ✅ AuthGate (보호용)
import AuthGate from "./component/AuthGate";

// pages
import HomeScreen from "./pages/HomeScreen";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Gallery from "./pages/Gallery";
import MyAlbum from "./pages/MyAlbum";
import MinwhaTrans from "./pages/MinwhaTrans";

const Stack = createNativeStackNavigator();

// ✅ 보호 스크린을 감싸는 HOC
const withAuthGate = (ScreenComp) => (props) => (
  <AuthGate>
    <ScreenComp {...props} />
  </AuthGate>
);

// ✅ 보호해야 하는 화면만 래핑
const GalleryProtected = withAuthGate(Gallery);
const MyAlbumProtected = withAuthGate(MyAlbum);
const MinwhaTransProtected = withAuthGate(MinwhaTrans);

// 로딩 화면 컴포넌트 (폰트 로딩용)
const LoadingScreen = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F8F8F8",
    }}
  >
    <ActivityIndicator size="large" />
    <Text style={{ marginTop: 20, fontSize: 16, color: "#666666" }}>
      폰트 로딩 중...
    </Text>
  </View>
);

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          ChusaLoveBold: require("./assets/ChusaLoveBold.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("폰트 로딩 실패:", error);
        setFontsLoaded(true); // 에러가 있어도 앱은 계속 실행
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return <LoadingScreen />;

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" hidden={true} />
        <Stack.Navigator
          initialRouteName="HomeScreen"
          screenOptions={{ headerShown: false }}
        >
          {/* 공개 라우트 */}
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />

          {/* ✅ 보호 라우트 (비로그인 시 자동으로 Login으로 reset 이동) */}
          <Stack.Screen name="Gallery" component={GalleryProtected} />
          <Stack.Screen name="MyAlbum" component={MyAlbumProtected} />
          <Stack.Screen name="MinwhaTrans" component={MinwhaTransProtected} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
