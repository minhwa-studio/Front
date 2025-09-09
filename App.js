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
const withAuthGate = (ScreenComp) => (props) =>
  (
    <AuthGate>
      <ScreenComp {...props} />
    </AuthGate>
  );

// ✅ 보호해야 하는 화면만 래핑
const GalleryProtected = withAuthGate(Gallery);
const MyAlbumProtected = withAuthGate(MyAlbum);
const MinwhaTransProtected = withAuthGate(MinwhaTrans);

// 민화 정보 데이터
const minwhaInfo = [
  {
    subject: "사슴",
    meaning: "사슴은 복록을 의미하며, 장수에도 상징이 있습니다",
    blessing: "사슴처럼 건강하고 오래오래 행복하시길 바랍니다",
  },
  {
    subject: "호랑이",
    meaning: "호랑이는 액운을 물리치는 벽사(辟邪)의 의미가 있습니다",
    blessing: "호랑이처럼 강인한 기운으로 모든 어려움을 이겨내시길 바랍니다",
  },
  {
    subject: "까치",
    meaning: "까치는 좋은 소식을 전해주는 길조로 여겨집니다",
    blessing: "까치처럼 좋은 소식이 자주 찾아오시길 바랍니다",
  },
  {
    subject: "돼지",
    meaning: "돼지는 재물과 풍요를 상징합니다",
    blessing: "돼지처럼 풍요롭고 넉넉한 삶이 되시길 바랍니다",
  },
  {
    subject: "개",
    meaning: "개는 집을 지켜주고 재난을 막으며, 집안의 행복을 기원합니다",
    blessing: "개처럼 충실하고 행복한 가정이 되시길 바랍니다",
  },
  {
    subject: "토끼",
    meaning: "토끼는 만물의 생장, 번창, 풍요를 상징하며 영특함을 나타냅니다",
    blessing: "토끼처럼 영특하고 번창하는 일들이 많으시길 바랍니다",
  },
  {
    subject: "기러기",
    meaning:
      "기러기는 노후의 안락함을 기원하는 노안도(蘆雁圖)에 등장하며, 가을 경치를 대표합니다",
    blessing: "기러기처럼 평안하고 안락한 노후를 보내시길 바랍니다",
  },
  {
    subject: "바위",
    meaning: "바위는 창조력, 생명력, 불변성을 상징하며 영원한 삶을 염원합니다",
    blessing: "바위처럼 굳건하고 영원한 행복이 있으시길 바랍니다",
  },
  {
    subject: "연꽃",
    meaning:
      "연꽃은 청렴결백, 부귀영화, 자손 번창을 의미하며, 물고기와 함께 그려지면 풍요로운 생활을 뜻합니다",
    blessing: "연꽃처럼 청렴하고 풍요로운 삶이 되시길 바랍니다",
  },
  {
    subject: "모란",
    meaning:
      "모란은 '꽃 중의 왕'으로 불리며, 부귀영화를 상징하는 대표적인 소재입니다",
    blessing: "모란처럼 화려하고 영화로운 인생이 되시길 바랍니다",
  },
  {
    subject: "태양과 달",
    meaning:
      "태양과 달은 음양의 조화를 상징하며, 삶의 균형과 조화를 의미합니다",
    blessing: "태양과 달처럼 조화롭고 균형 잡힌 삶이 되시길 바랍니다",
  },
  {
    subject: "별",
    meaning:
      "별은 충의로운 사람을 의미하고, 황제의 인자한 마음을 나타내기도 합니다",
    blessing: "별처럼 밝고 인자한 마음으로 모든 일이 순조로우시길 바랍니다",
  },
  {
    subject: "갈대",
    meaning:
      "갈대는 가을 경치를 나타내고, 노안도에 기러기와 함께 그려져 노후의 안락함을 기원합니다",
    blessing: "갈대처럼 유연하고 평안한 마음으로 인생을 살아가시길 바랍니다",
  },
];

// 로딩 화면 컴포넌트
const LoadingScreen = () => {
  // 랜덤하게 민화 정보 선택 (컴포넌트 외부에서 미리 계산)
  const randomIndex = Math.floor(Math.random() * minwhaInfo.length);
  const currentInfo = minwhaInfo[randomIndex];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F8F8",
        paddingHorizontal: 30,
      }}
    >
      <ActivityIndicator size="large" color="#8B7355" />

      <View style={{ marginTop: 40, alignItems: "center" }}>
        <Text
          style={{
            fontSize: 20,
            color: "#8B7355",
            textAlign: "center",
            marginBottom: 20,
            lineHeight: 28,
            fontWeight: "bold",
          }}
        >
          {currentInfo.meaning}
        </Text>

        <Text
          style={{
            fontSize: 18,
            color: "#5D4E37",
            textAlign: "center",
            lineHeight: 26,
            fontStyle: "italic",
            fontWeight: "500",
          }}
        >
          {currentInfo.blessing}
        </Text>
      </View>
    </View>
  );
};

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

  // 폰트 로딩 중에도 로딩 화면을 보여주되, 폰트가 없어도 텍스트는 표시
  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

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
