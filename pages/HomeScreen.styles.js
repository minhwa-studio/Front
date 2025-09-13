import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

// 2025년 트렌드 색상: 모카 무스의 + 블랙/화이트
const colors = {
  primary: "#8B7355", // 모카 무스의
  secondary: "#D4C4A8", // 밝은 모카
  accent: "#5D4E37", // 진한 모카
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
};

export const styles = StyleSheet.create({
  // 전체 컨테이너
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  // ===== HEADER STYLES =====
  header: {
    width: "100%",
    paddingTop: Platform.OS === "web" ? 20 : 40,
    paddingBottom: 20,
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.025,
  },
  logo: {
    fontSize: Math.min(width * 0.035, 28),
    color: colors.white,
    marginRight: width * 0.05,
    fontFamily: "ChusaLoveBold",
  },
  navMenu: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.04,
  },
  navItem: {
    paddingVertical: height * 0.01,
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
  userMenu: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.02,
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

  // ===== MAIN STYLES =====
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
    backgroundColor: "transparent",
    position: "relative",
    overflow: "hidden",
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  mainContent: {
    alignItems: "center",
    maxWidth: width * 0.8,
    zIndex: 10,
    position: "relative",
  },
  mainTitle: {
    fontSize: Math.min(width * 0.06, 48), // 0.045 → 0.06, 36 → 48로 증가
    color: colors.white,
    textAlign: "center",
    marginBottom: height * 0.04,
    fontFamily: "ChusaLoveBold",
    lineHeight: Math.min(width * 0.07, 56), // 0.055 → 0.07, 44 → 56로 증가
    textShadowColor: colors.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  subTitle: {
    fontSize: Math.min(width * 0.035, 28),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
    textShadowColor: colors.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  minwhaButton: {
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    marginHorizontal: width * 0.01,
    backgroundColor: "transparent",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  minwhaButtonText: {
    fontSize: Math.min(width * 0.035, 28),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
    fontWeight: "bold",
  },

  // ===== FOOTER STYLES =====
  footer: {
    backgroundColor: "transparent",
    paddingVertical: 30,
    paddingHorizontal: width * 0.04,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    alignItems: "flex-end",
  },
  footerCopyright: {
    fontSize: Math.min(width * 0.015, 12),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
    lineHeight: 18,
  },
  footerGitHub: {
    fontSize: Math.min(width * 0.018, 14),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
    textDecorationLine: "underline",
  },
});
