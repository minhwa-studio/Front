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
    backgroundColor: colors.white,
  },

  // ===== HEADER STYLES =====
  header: {
    width: "100%",
    paddingTop: Platform.OS === "web" ? 20 : 40,
    paddingBottom: 20,
    backgroundColor: colors.black,
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
    backgroundColor: colors.white,
  },
  mainContent: {
    alignItems: "center",
    maxWidth: width * 0.8,
  },
  mainTitle: {
    fontSize: Math.min(width * 0.045, 36),
    color: colors.black,
    textAlign: "center",
    marginBottom: height * 0.04,
    fontFamily: "ChusaLoveBold",
    lineHeight: Math.min(width * 0.055, 44),
  },
  subTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  subTitle: {
    fontSize: Math.min(width * 0.035, 28),
    color: colors.darkGray,
    fontFamily: "ChusaLoveBold",
  },
  minwhaButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 25,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    marginHorizontal: width * 0.01,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  minwhaButtonText: {
    fontSize: Math.min(width * 0.035, 28),
    color: colors.primary,
    fontFamily: "ChusaLoveBold",
    fontWeight: "bold",
  },

  // ===== FOOTER STYLES =====
  footer: {
    backgroundColor: colors.black,
    paddingVertical: 30,
    paddingHorizontal: width * 0.04,
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
    color: colors.lightGray,
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
