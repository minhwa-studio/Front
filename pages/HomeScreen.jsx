import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
  Animated,
  ImageBackground,
} from "react-native";
import { styles } from "./HomeScreen.styles";
import { useAuth } from "../AuthContext";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { isLoggedIn, userName, logout } = useAuth();
  const [language, setLanguage] = useState("KOR");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 애니메이션 값들
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // monthly_images 폴더의 이미지들
  const backgroundImages = [
    require("../public/monthly_images/이태숙 - 봉황도.jpg"),
    require("../public/monthly_images/길혜은-책가도.jpg"),
    require("../public/monthly_images/강향미-호피장막도.jpg"),
    require("../public/monthly_images/강경미 - 백호도.jpg"),
    require("../public/monthly_images/군학장생도.jpg"),
    require("../public/monthly_images/고독.jpg"),
    require("../public/monthly_images/空谷跫音(공곡공음).jpg"),
    require("../public/monthly_images/모란도(37).jpg"),
    require("../public/monthly_images/화접초충도(4).jpg"),
    require("../public/monthly_images/풍속도(5).jpg"),
    require("../public/monthly_images/2018 연화도.jpg"),
    require("../public/monthly_images/금강산만물초승경도(1).jpg"),
  ];

  // GitHub 링크 열기
  const openGitHub = () => {
    Linking.openURL("https://github.com/minhwa-studio");
  };

  // 배경 이미지 슬라이드 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      // 페이드 아웃
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000, // 1초 동안 페이드아웃
        useNativeDriver: true,
      }).start(() => {
        // 다음 이미지로 변경
        setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);

        // 스케일 리셋
        scaleAnim.setValue(1);

        // 페이드 인
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 4000); // 4초마다 변경 (3초 확대 + 1초 페이드아웃)

    return () => clearInterval(interval);
  }, [backgroundImages.length, fadeAnim, scaleAnim]);

  // 확대 애니메이션
  useEffect(() => {
    const scaleAnimation = Animated.timing(scaleAnim, {
      toValue: 1.1,
      duration: 2000,
      useNativeDriver: true,
    });

    scaleAnimation.start();
  }, [currentImageIndex, scaleAnim]);

  return (
    <View style={styles.container}>
      {/* ===== HEADER SECTION ===== */}
      <View style={styles.header}>
        {/* 상단 헤더 */}
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>민화 사진관</Text>
            <View style={styles.navMenu}>
              <TouchableOpacity style={styles.navItem}
              onPress={() => navigation.navigate("DigitalGallery")}>
                <Text style={styles.navText}>디지털 전시관</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}
              onPress={() => navigation.navigate("MinwhaTrans")}>
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
        {/* 배경 이미지 */}
        <Animated.View
          style={[
            styles.backgroundImageContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <ImageBackground
            source={backgroundImages[currentImageIndex]}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          {/* 배경 어둡게 처리 */}
          <View style={styles.backgroundOverlay} />
        </Animated.View>

        {/* 메인 콘텐츠 */}
        <View style={styles.mainContent}>
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
        </View>
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
