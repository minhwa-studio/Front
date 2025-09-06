import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

// Hard Graft 스타일의 미니멀하고 고급스러운 색상 팔레트
const colors = {
  // 배경 및 기본 색상
  background: "#F8F8F8", // 밝은 회색 배경
  white: "#FFFFFF", // 순백색
  surface: "#F5F5F5", // 미묘한 회색 표면

  // 텍스트 색상
  textPrimary: "#1A1A1A", // 진한 검은색 (제목용)
  textSecondary: "#4A4A4A", // 중간 회색 (부제목용)
  textTertiary: "#8A8A8A", // 연한 회색 (설명용)

  // 액센트 색상
  accent: "#2C2C2C", // 어두운 회색 (버튼, 테두리용)
  accentLight: "#E0E0E0", // 연한 회색 (테두리용)

  // 상태 색상
  success: "#27AE60",
  error: "#E74C3C",
  warning: "#F39C12",

  // 그림자
  shadowLight: "rgba(0, 0, 0, 0.05)",
  shadowMedium: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.15)",
};

export const styles = StyleSheet.create({
  // 전체 컨테이너 - Hard Graft 스타일
  container: {
    flex: 1,
    backgroundColor: colors.background,
    minWidth: 1200,
  },

  // 스크롤 컨텐츠 컨테이너
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },

  // 상단 헤더 - Hard Graft 스타일
  header: {
    height: Math.max(80, height * 0.1),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.accentLight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Math.max(24, width * 0.02),
    width: "100%",
  },
  // 헤더 센터 영역
  headerCenter: {
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: Math.max(28, Math.min(width * 0.04, 36)),
    color: colors.textPrimary,
    fontFamily: "ChusaLoveBold",
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: Math.max(14, Math.min(width * 0.015, 16)),
    color: colors.textTertiary,
    marginTop: Math.max(4, height * 0.005),
    fontFamily: "ChusaLoveBold",
    letterSpacing: 0.5,
  },

  // 헤더 좌측 버튼
  headerLeftButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: Math.max(16, width * 0.015),
    paddingVertical: Math.max(8, height * 0.008),
    borderRadius: 8,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: Math.max(120, width * 0.1),
    alignItems: "center",
  },
  headerLeftButtonText: {
    fontSize: Math.max(14, Math.min(width * 0.018, 16)),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
    textAlign: "center",
  },

  // 헤더 우측 버튼
  headerRightButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: Math.max(16, width * 0.015),
    paddingVertical: Math.max(8, height * 0.008),
    borderRadius: 8,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: Math.max(140, width * 0.12),
    alignItems: "center",
  },
  headerRightButtonText: {
    fontSize: Math.max(14, Math.min(width * 0.018, 16)),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
    textAlign: "center",
  },

  // 메인 컨텐츠 영역 - 왼쪽만 스크롤
  mainContent: {
    flex: 1,
    paddingHorizontal: Math.max(40, width * 0.035),
    paddingVertical: Math.max(40, height * 0.04),
    paddingRight: Math.max(360, width * 0.3), // 오른쪽 고정 영역 공간 확보
    width: "100%",
  },

  // 왼쪽 영역 - 원본 이미지 및 결과 갤러리
  leftSection: {
    width: "100%",
    gap: Math.max(40, height * 0.04),
  },

  // 원본 이미지 업로드 영역
  originalImageSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: Math.max(32, width * 0.025),
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    width: "100%",
  },
  sectionTitle: {
    fontSize: Math.max(20, Math.min(width * 0.025, 24)),
    color: colors.textPrimary,
    marginBottom: Math.max(24, height * 0.025),
    fontFamily: "ChusaLoveBold",
  },

  // 업로드 영역
  uploadArea: {
    height: Math.max(400, height * 0.45),
    borderWidth: 2,
    borderColor: colors.accentLight,
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    marginBottom: Math.max(24, height * 0.025),
    width: "100%",
  },
  uploadIcon: {
    fontSize: Math.max(48, Math.min(width * 0.06, 64)),
    marginBottom: Math.max(16, height * 0.015),
    color: colors.textTertiary,
  },
  uploadText: {
    fontSize: Math.max(16, Math.min(width * 0.02, 18)),
    color: colors.textSecondary,
    marginBottom: Math.max(8, height * 0.008),
    fontFamily: "ChusaLoveBold",
    textAlign: "center",
  },
  uploadSubtext: {
    fontSize: Math.max(14, Math.min(width * 0.018, 16)),
    color: colors.textTertiary,
    textAlign: "center",
    fontFamily: "ChusaLoveBold",
  },

  // 업로드된 이미지 컨테이너
  uploadedImageContainer: {
    height: Math.max(400, height * 0.45),
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.white,
    marginBottom: Math.max(24, height * 0.025),
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    width: "100%",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  changeImageButton: {
    position: "absolute",
    bottom: Math.max(16, width * 0.015),
    right: Math.max(16, width * 0.015),
    backgroundColor: colors.accent,
    paddingHorizontal: Math.max(16, width * 0.015),
    paddingVertical: Math.max(8, height * 0.008),
    borderRadius: 8,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  changeImageButtonText: {
    fontSize: Math.max(12, Math.min(width * 0.015, 14)),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
  },

  // 변환 결과 갤러리 영역
  resultsSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: Math.max(32, width * 0.025),
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    width: "100%",
  },
  resultsTitle: {
    fontSize: Math.max(20, Math.min(width * 0.025, 24)),
    color: colors.textPrimary,
    marginBottom: Math.max(24, height * 0.025),
    fontFamily: "ChusaLoveBold",
  },

  // 결과 이미지 그리드
  resultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Math.max(16, width * 0.015),
    justifyContent: "flex-start",
    width: "100%",
  },

  // 결과 이미지 아이템
  resultImageItem: {
    width: Math.max(180, width * 0.15),
    backgroundColor: colors.surface,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  resultImage: {
    width: "100%",
    height: Math.max(180, width * 0.15),
  },
  resultImageInfo: {
    padding: Math.max(12, width * 0.012),
  },
  resultTimestamp: {
    fontSize: Math.max(11, Math.min(width * 0.012, 12)),
    color: colors.textTertiary,
    marginBottom: Math.max(8, height * 0.008),
    fontFamily: "ChusaLoveBold",
  },
  resultActions: {
    flexDirection: "row",
    gap: Math.max(6, width * 0.006),
  },
  resultActionButton: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: Math.max(6, height * 0.006),
    borderRadius: 4,
    alignItems: "center",
  },
  resultActionButtonText: {
    fontSize: Math.max(10, Math.min(width * 0.01, 11)),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
  },
  deleteButton: {
    backgroundColor: colors.error,
  },

  // 빈 상태
  emptyState: {
    alignItems: "center",
    paddingVertical: Math.max(40, height * 0.04),
    width: "100%",
  },
  emptyStateIcon: {
    fontSize: Math.max(48, Math.min(width * 0.06, 64)),
    marginBottom: Math.max(16, height * 0.015),
    color: colors.textTertiary,
  },
  emptyStateText: {
    fontSize: Math.max(16, Math.min(width * 0.02, 18)),
    color: colors.textSecondary,
    marginBottom: Math.max(8, height * 0.008),
    fontFamily: "ChusaLoveBold",
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: Math.max(14, Math.min(width * 0.018, 16)),
    color: colors.textTertiary,
    textAlign: "center",
    fontFamily: "ChusaLoveBold",
  },

  // 오른쪽 고정 영역 - 변환 옵션 및 버튼
  rightFixedSection: {
    position: "absolute",
    right: Math.max(40, width * 0.035),
    width: Math.max(320, width * 0.25),
    gap: Math.max(32, height * 0.03),
    zIndex: 10,
  },

  // 변환 옵션 카드
  optionsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: Math.max(32, width * 0.025),
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    width: "100%",
  },
  cardTitle: {
    fontSize: Math.max(18, Math.min(width * 0.022, 20)),
    color: colors.textPrimary,
    marginBottom: Math.max(20, height * 0.02),
    fontFamily: "ChusaLoveBold",
  },

  // 변환 버튼
  convertButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: Math.max(16, height * 0.015),
    alignItems: "center",
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: Math.max(24, height * 0.025),
    width: "100%",
  },
  convertButtonDisabled: {
    backgroundColor: colors.textTertiary,
    shadowOpacity: 0,
    elevation: 0,
  },
  convertButtonText: {
    fontSize: Math.max(16, Math.min(width * 0.02, 18)),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Math.max(12, width * 0.012),
  },

  // 옵션 그룹
  optionGroup: {
    marginBottom: Math.max(24, height * 0.025),
    width: "100%",
  },
  optionLabel: {
    fontSize: Math.max(14, Math.min(width * 0.018, 16)),
    color: colors.textSecondary,
    marginBottom: Math.max(8, height * 0.008),
    fontFamily: "ChusaLoveBold",
  },
  optionInput: {
    borderWidth: 1,
    borderColor: colors.accentLight,
    borderRadius: 6,
    paddingHorizontal: Math.max(12, width * 0.012),
    paddingVertical: Math.max(10, height * 0.01),
    fontSize: Math.max(14, Math.min(width * 0.018, 16)),
    color: colors.textPrimary,
    backgroundColor: colors.white,
    fontFamily: "ChusaLoveBold",
    width: "100%",
  },
  optionSelect: {
    borderWidth: 1,
    borderColor: colors.accentLight,
    borderRadius: 6,
    paddingHorizontal: Math.max(12, width * 0.012),
    paddingVertical: Math.max(10, height * 0.01),
    backgroundColor: colors.white,
    width: "100%",
  },

  // 미리보기 팝업 - Hard Graft 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Math.max(20, width * 0.02),
    width: "100%",
    height: "100%",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: "100%",
    maxWidth: Math.max(800, width * 0.7),
    maxHeight: Math.max(600, height * 0.7),
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Math.max(32, width * 0.025),
    paddingVertical: Math.max(24, height * 0.025),
    borderBottomWidth: 1,
    borderBottomColor: colors.accentLight,
  },
  modalTitle: {
    fontSize: Math.max(20, Math.min(width * 0.025, 24)),
    color: colors.textPrimary,
    fontFamily: "ChusaLoveBold",
  },
  closeButton: {
    width: Math.max(32, width * 0.025),
    height: Math.max(32, width * 0.025),
    borderRadius: Math.max(16, width * 0.0125),
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.accentLight,
  },
  closeButtonText: {
    fontSize: Math.max(18, width * 0.02),
    color: colors.textSecondary,
    fontFamily: "ChusaLoveBold",
  },
  modalImageContainer: {
    padding: Math.max(32, width * 0.025),
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: Math.max(300, height * 0.35),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accentLight,
  },
  modalActions: {
    flexDirection: "row",
    paddingHorizontal: Math.max(32, width * 0.025),
    paddingBottom: Math.max(32, height * 0.03),
    gap: Math.max(16, width * 0.015),
  },
  modalActionButton: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: Math.max(14, height * 0.013),
    borderRadius: 8,
    alignItems: "center",
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalActionButtonText: {
    fontSize: Math.max(14, Math.min(width * 0.018, 16)),
    color: colors.white,
    fontFamily: "ChusaLoveBold",
  },
  shareButton: {
    backgroundColor: colors.success,
  },
});
