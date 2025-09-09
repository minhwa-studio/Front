import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  FlatList,
  Animated,
  Platform,
} from "react-native";
import { styles } from "./DigitalGallery.styles";
import { useAuth } from "../AuthContext";

const DigitalGallery = ({ navigation }) => {
  const { width, height } = Dimensions.get("window");
  const { isLoggedIn, userName, logout } = useAuth();

  // 상단 섹션의 실제 높이 측정 → 아래 콘텐츠에 paddingTop으로 반영
  const [topHeight, setTopHeight] = useState(height * 0.42);

  // ✅ 상세 모달 상태 (복구)
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // 카드 크기(반응형): 넓은 화면에서는 폭 기준, 세로 화면에서는 높이 기준
  const CARD_SIZE = useMemo(
    () => Math.min(width * 0.40, height * 0.50),
    [width, height]
  );
  const SNAP_INTERVAL = useMemo(() => CARD_SIZE + width * 0.04, [CARD_SIZE, width]);

  // 창 크기 변경 대응
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", () => {});
    return () => sub?.remove?.();
  }, []);

  // 작품별 hover 애니메이션 값 (웹만)
  const hoverAnim = useRef([]).current;
  const ensureHover = (idx) => {
    if (!hoverAnim[idx]) hoverAnim[idx] = new Animated.Value(1);
    return hoverAnim[idx];
  };
  const onHoverIn = (idx) => {
    if (Platform.OS !== "web") return;
    Animated.spring(ensureHover(idx), {
      toValue: 1.05,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };
  const onHoverOut = (idx) => {
    if (Platform.OS !== "web") return;
    Animated.spring(ensureHover(idx), {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const artworks = [
    {
      id: 1,
      title: "전통 민화 1",
      artist: "민화 작가",
      description: "전통 민화의 아름다움을 담은 작품",
      image: require("../public/img1.png"),
      year: "2024",
      technique: "민화",
    },
    {
      id: 2,
      title: "전통 민화 2",
      artist: "민화 작가",
      description: "한지 위에 그려진 민화의 정수",
      image: require("../public/img2.png"),
      year: "2024",
      technique: "민화",
    },
    {
      id: 3,
      title: "전통 민화 3",
      artist: "민화 작가",
      description: "전통과 현대가 만나는 민화 작품",
      image: require("../public/img3.png"),
      year: "2024",
      technique: "민화",
    },
    {
      id: 4,
      title: "전통 민화 4",
      artist: "민화 작가",
      description: "민화의 깊이와 아름다움을 표현한 작품",
      image: require("../public/img4.png"),
      year: "2024",
      technique: "민화",
    },
  ];

  return (
    <View style={styles.container}>
      {/* ===== 상단 섹션(지붕 + 헤더 + 제목) ===== */}
      <View
        style={styles.topSection}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          setTopHeight(h);
        }}
      >
        <ImageBackground
          source={require("../public/wallpaperbetter.jpg")}
          style={styles.roofBackground}
          resizeMode="cover"
          blurRadius={2}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backButton}>←</Text>
              </TouchableOpacity>
              <Text style={styles.logo}>디지털 전시관</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.languageButton}
                onPress={() => {}}
              >
                <Text style={styles.languageText}>KOR</Text>
              </TouchableOpacity>
              {isLoggedIn ? (
                <>
                  <Text style={styles.userButtonText}>
                    {userName}님, 전시관에 오신 것을 환영합니다
                  </Text>
                  <TouchableOpacity style={styles.userButton} onPress={logout}>
                    <Text style={styles.userButtonText}>로그아웃</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
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
                </>
              )}
            </View>
          </View>

          {/* 제목/부제 (배경 이미지 안) */}
          <View style={styles.galleryTitleContainer}>
            <Text style={styles.galleryTitle}>민화 디지털 전시관</Text>
            <Text style={styles.gallerySubtitle}>
              전통의 아름다움을 현대적으로 재해석하다
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* ===== 콘텐츠(상단 높이에 자동으로 붙음) ===== */}
      <View style={[styles.content]}>
        <View style={[styles.artworkContainer, { paddingTop: Math.max(0, 12) }]}>
          <FlatList
            data={artworks}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={[
              styles.artworkListContent,
              { paddingTop: Math.max(0, topHeight * 0.04) },
            ]}
            snapToInterval={SNAP_INTERVAL}
            snapToAlignment="center"
            decelerationRate="fast"
            renderItem={({ item, index }) => (
              <Animated.View
                style={{ transform: [{ scale: hoverAnim[index] || 1 }] }}
                onMouseEnter={() => onHoverIn(index)}
                onMouseLeave={() => onHoverOut(index)}
              >
                <TouchableOpacity
                  style={styles.artworkCard}
                  onPress={() => setSelectedArtwork(item)} // ✅ 클릭 시 모달 오픈
                  activeOpacity={0.85}
                >
                  <View style={styles.artworkFrame}>
                    <View
                      style={[
                        styles.artworkImageContainer,
                        { width: CARD_SIZE, height: CARD_SIZE },
                      ]}
                    >
                      <Image source={item.image} style={styles.artworkImage} />
                    </View>
                    <View style={styles.artworkOverlay}>
                      <Text style={styles.artworkTitle}>{item.title}</Text>
                      <Text style={styles.artworkArtist}>{item.artist}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
          />
          <View style={styles.footerSpace} />
        </View>

        {/* ✅ 푸터 복구 */}
        <View
          style={{
            paddingVertical: 20,
            paddingHorizontal: width * 0.04,
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "ChusaLoveBold",
              fontSize: Math.min(width * 0.015, 12),
              opacity: 0.9,
            }}
          >
            © 2025 민화 디지털 전시관. 전통과 현대의 만남
          </Text>
        </View>
      </View>

      {/* ✅ 상세 모달 (복구) */}
      {selectedArtwork && (
        <View
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          {/* 닫기 버튼 */}
          <TouchableOpacity
            onPress={() => setSelectedArtwork(null)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: "rgba(139,115,85,0.15)",
              borderWidth: 1, borderColor: "#8B7355",
              justifyContent: "center", alignItems: "center",
            }}
          >
            <Text style={{ color: "#8B7355", fontSize: 22, fontFamily: "ChusaLoveBold" }}>
              ✕
            </Text>
          </TouchableOpacity>

          {/* 모달 내용 */}
          <View
            style={{
              width: Math.min(width * 0.9, 980),
              maxHeight: Math.min(height * 0.85, 720),
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 22,
              alignItems: "center",
              borderWidth: 2,
              borderColor: "#B8860B",
            }}
          >
            <Image
              source={selectedArtwork.image}
              style={{
                width: Math.min(width * 0.75, 720),
                height: Math.min(height * 0.45, 420),
                borderRadius: 10,
                marginBottom: 16,
                resizeMode: "contain",
              }}
            />
            <Text
              style={{
                fontFamily: "ChusaLoveBold",
                fontSize: Math.min(width * 0.06, 28),
                color: "#222",
                textAlign: "center",
                marginBottom: 6,
              }}
            >
              {selectedArtwork.title}
            </Text>
            <Text
              style={{
                fontFamily: "ChusaLoveBold",
                fontSize: Math.min(width * 0.04, 20),
                color: "#8B7355",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {selectedArtwork.artist}
            </Text>
            <Text
              style={{
                fontFamily: "ChusaLoveBold",
                fontSize: Math.min(width * 0.035, 16),
                color: "#666",
                textAlign: "center",
                lineHeight: 22,
                marginBottom: 12,
              }}
            >
              {selectedArtwork.description}
            </Text>
            <Text
              style={{
                fontFamily: "ChusaLoveBold",
                fontSize: Math.min(width * 0.03, 14),
                color: "#666",
                textAlign: "center",
              }}
            >
              제작년도: {selectedArtwork.year} ・ 기법: {selectedArtwork.technique}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default DigitalGallery;
