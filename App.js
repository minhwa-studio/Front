// App.js
import "react-native-gesture-handler";
import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// ✅ AuthContext 추가
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

export default function App() {
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

          {/* ✅ 보호 라우트 */}
          <Stack.Screen name="Gallery" component={GalleryProtected} />
          <Stack.Screen name="MyAlbum" component={MyAlbumProtected} />
          <Stack.Screen name="MinwhaTrans" component={MinwhaTransProtected} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
