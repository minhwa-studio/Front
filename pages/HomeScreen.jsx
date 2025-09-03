import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { styles } from "./HomeScreen.styles";
import { useAuth } from "../AuthContext";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { isLoggedIn, userName, logout } = useAuth();
  const [language, setLanguage] = useState("KOR");

  // GitHub 링크 열기
  const openGitHub = () => {
    Linking.openURL("https://github.com/minhwa-studio");
  };

  return (
    <View style={styles.container}>
      {/* ===== HEADER SECTION ===== */}
      <View style={styles.header}>
        {/* 상단 헤더 */}
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>민화 사진관</Text>
            <View style={styles.navMenu}>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>민화 갤러리</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>전시 정보</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>디지털 전시관</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>민화 작업실</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>담소 마당</Text>
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
              <Text style={styles.footerGitHub}>GitHub</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
