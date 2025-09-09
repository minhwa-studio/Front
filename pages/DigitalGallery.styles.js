import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");
// 공통 색상 팔레트
const colors = {
  primary: "#8B7355",
  secondary: "#D4C4A8",
  accent: "#5D4E37",
  white: "#FFFFFF",
  black: "#1A1A1A",
  gray: "#F5F5F5",
  darkGray: "#666666",
  lightGray: "#E8E8E8",
  overlay: "rgba(26, 26, 26, 0.3)",
  paperWhite: "#F0F0F0",
  inkBlack: "#333333",
  overlayLight: "rgba(255, 255, 255, 0.2)",
  traditionalBlack: "#222222",
  hanjiDark: "#999999",
  galleryGold: "#D4AF37",
  galleryWarm: "#F4E4BC",
  galleryShadow: "rgba(0, 0, 0, 0.35)",
};
export const colorsRef = colors;
export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.traditionalBlack },
  // ===== 상단 섹션 (지붕 + 헤더 + 제목을 한 덩어리로) =====
  topSection: {
    width: "100%",
    // 높이는 기기 비율에 따라 적당히 잡고, 실제 값은 onLayout으로 측정해서 사용
    height: height * 0.32,
    position: "relative",
    zIndex: 5,
  },
  // 지붕 배경
  roofBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  // 헤더(배경 위에 떠있게)
  header: {
    width: "100%",
    paddingTop: Platform.OS === "web" ? 20 : 40,
    paddingHorizontal: width * 0.04,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: width * 0.03 },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.02,
  },
  backButton: {
    fontSize: Math.min(width * 0.06, 32),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
  },
  logo: {
    fontSize: Math.min(width * 0.04, 28),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
  },
  navText: {
    color: colors.white,
    fontSize: Math.min(width * 0.02, 16),
    fontFamily: "ChusaLoveBold",
  },
  languageButton: {
    backgroundColor: colors.overlayLight,
    paddingHorizontal: width * 0.015,
    paddingVertical: height * 0.008,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.white,
  },
  languageText: {
    color: colors.white,
    fontSize: Math.min(width * 0.015, 12),
    fontFamily: "ChusaLoveBold",
  },
  userButton: {
    paddingHorizontal: width * 0.015,
    paddingVertical: height * 0.008,
  },
  userButtonText: {
    color: colors.white,
    fontSize: Math.min(width * 0.018, 14),
    fontFamily: "ChusaLoveBold",
  },
  // 제목/부제(배경 안, 더 위쪽에 배치)
  galleryTitleContainer: {
    position: "absolute",
    top: "36%", // 화면 비율 따라 상단에 위치
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    paddingHorizontal: 10,
  },
  galleryTitle: {
    fontSize: Math.min(width * 0.1, 46),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
    textAlign: "center",
    textShadowColor: colors.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 8,
  },
  gallerySubtitle: {
    fontSize: Math.min(width * 0.04, 22),
    color: colors.galleryWarm,
    fontFamily: "ChusaLoveBold",
    textAlign: "center",
    textShadowColor: colors.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // ===== 작품 리스트 래퍼(상단 섹션 아래로 자동 배치) =====
  content: {
    flex: 1,
  },
  artworkContainer: {
    // topSection의 실측 높이를 paddingTop으로 전달해 겹치지 않도록 함
    paddingTop: 0, // 실제 값은 JS에서 동적으로 주입
    alignItems: "center",
    justifyContent: "center",
  },
  artworkListContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.05,
    alignItems: "center",
  },
  // ===== 카드 =====
  artworkCard: {
    marginHorizontal: width * 0.02,
    alignItems: "center",
  },
  artworkFrame: {
    backgroundColor: "#F0F8FF",
    padding: width * 0.004, // 얇은 하늘색 여백
    borderRadius: 12,
    shadowColor: colors.galleryShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 0.3, // 테두리 더 얇게
    borderColor: "#B3E5FF",
  },
  artworkImageContainer: {
    // 정확한 값은 JS에서 CARD_SIZE로 계산해서 style prop으로 전달
    backgroundColor: colors.white,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 0.3,
    borderColor: "#B3E5FF",
  },
  artworkImage: { width: "100%", height: "100%", resizeMode: "cover" },
  artworkOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: width * 0.01,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  artworkTitle: {
    fontSize: Math.min(width * 0.03, 14),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
    textAlign: "center",
  },
  artworkArtist: {
    fontSize: Math.min(width * 0.02, 12),
    color: colors.galleryWarm,
    fontFamily: "ChusaLoveBold",
    textAlign: "center",
  },
  // 푸터(필요시)
  footerSpace: { height: height * 0.05 },
});
