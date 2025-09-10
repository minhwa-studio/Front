import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
  Animated,
} from "react-native";
import { styles } from "./HomeScreen.styles";
import { useAuth } from "../AuthContext";
import VideoBackground from "../src/components/VideoBackground";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { isLoggedIn, userName, logout } = useAuth();
  const [language, setLanguage] = useState("KOR");

  // 애니메이션 값들
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // 동영상 변경 핸들러
  const handleVideoChange = (index) => {
    console.log(`Video changed to index: ${index}`);
  };

  // GitHub 링크 열기
  const openGitHub = () => {
    Linking.openURL("https://github.com/minhwa-studio");
  };

  // 동영상 변경 시 페이드 애니메이션 (옵션)
  useEffect(() => {
    // 페이드 인 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      {/* ===== VIDEO BACKGROUND ===== */}
      <VideoBackground onVideoChange={handleVideoChange} />

      {/* ===== HEADER SECTION ===== */}
      <View style={styles.header}>
        {/* 상단 헤더 */}
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>민화 사진관</Text>
            <View style={styles.navMenu}>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate("DigitalGallery")}
              >
                <Text style={styles.navText}>디지털 전시관</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate("MinwhaTrans")}
              >
                <Text style={styles.navText}>민화 작업실</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* 언어 선택 버튼 */}
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setLanguage(language === "KOR" ? "ENG" : "KOR")}
            >
              <Text style={styles.languageText}>{language}</Text>
            </TouchableOpacity>

            {/* 사용자 메뉴 (로그인 여부에 따라 조건부 렌더링) */}
            {isLoggedIn ? (
              <View style={styles.userMenu}>
                <Text style={styles.userButtonText}>
                  민화 사진관에 오신걸 환영합니다, {userName}님!
                </Text>
                <TouchableOpacity style={styles.userButton} onPress={logout}>
                  <Text style={styles.userButtonText}>로그아웃</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.userMenu}>
                <TouchableOpacity
                  style={styles.userButton}
                  onPress={() => navigation.navigate("SignUp")}
                >
                  <Text style={styles.userButtonText}>회원가입</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.userButton}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.userButtonText}>로그인</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* ===== MAIN SECTION ===== */}
      <View style={styles.main}>
        {/* 배경 오버레이 */}
        <View style={styles.backgroundOverlay} />

        {/* 메인 콘텐츠 */}
        <Animated.View
          style={[
            styles.mainContent,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.mainTitle}>
            민화, 전통을 담아 AI로 다시 숨쉬다
          </Text>
          <View style={styles.subTitleContainer}>
            <Text style={styles.subTitle}>나의 일상을 </Text>
            <TouchableOpacity
              style={styles.minwhaButton}
              onPress={() => navigation.navigate("MinwhaTrans")}
            >
              <Text style={styles.minwhaButtonText}>민화로</Text>
            </TouchableOpacity>
            <Text style={styles.subTitle}> 바꿔보세요!</Text>
          </View>
        </Animated.View>
      </View>

      {/* ===== FOOTER SECTION ===== */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerCopyright}>
              © 2025 민화 사진관. AI로 재탄생한 전통의 아름다움
            </Text>
          </View>
          <View style={styles.footerRight}>
            <TouchableOpacity onPress={openGitHub}>
              <Text style={styles.footerGitHub}>GitHub minhwa-studio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
