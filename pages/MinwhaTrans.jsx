import React, { useState } from "react";
import Constants from "expo-constants";

const { API_URL } = Constants.expoConfig.extra;
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
  TextInput,
  ImageBackground,
} from "react-native";
import { styles } from "./MinwhaTrans.styles";
import { useAuth } from "../AuthContext";
import axios from "axios";

const { width, height } = Dimensions.get("window");
const API_BASE =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : `${API_URL}`;

// ✅ Web에서도 확실히 뜨게 하는 경량 알림 유틸
const showAlert = (title, message) => {
  if (Platform.OS === "web") {
    try {
      window.alert(message ? `${title}\n${message}` : title);
    } catch {
      console.log("ALERT:", title, message || "");
    }
  } else {
    Alert.alert(title, message);
  }
};

/* ===========================
   🧪 이미지 디버그 유틸
   - HEAD로 헤더/메타 먼저 로깅
   - 필요 시 GET으로 blob 크기/타입 로깅
   - ngrok 경고 우회 헤더 자동 포함(웹)
=========================== */
const headers_for_web =
  Platform.OS === "web" ? { "ngrok-skip-browser-warning": "true" } : {};

async function log_image_debug_all(url) {
  console.group("🧪 IMAGE DEBUG");
  console.log("URL:", url);

  // 1) HEAD 시도
  try {
    const t0 = performance?.now?.() ?? Date.now();
    const headRes = await fetch(url, {
      method: "HEAD",
      headers: headers_for_web,
    });
    const t1 = performance?.now?.() ?? Date.now();
    console.log("HEAD status:", headRes.status, headRes.statusText);
    const headHeaders = {};
    headRes.headers?.forEach?.((v, k) => (headHeaders[k] = v));
    console.log("HEAD headers:", headHeaders);
    console.log("HEAD duration(ms):", Math.round(t1 - t0));
  } catch (e) {
    console.warn("HEAD failed:", e?.message || e);
  }

  // 2) GET으로 본문 유형/크기 확인
  try {
    const t0 = performance?.now?.() ?? Date.now();
    const res = await fetch(url, { method: "GET", headers: headers_for_web });
    const t1 = performance?.now?.() ?? Date.now();

    const resHeaders = {};
    res.headers?.forEach?.((v, k) => (resHeaders[k] = v));
    const contentType = res.headers?.get?.("content-type") || "";
    console.log("GET status:", res.status, res.statusText);
    console.log("GET headers:", resHeaders);
    console.log("GET duration(ms):", Math.round(t1 - t0));

    if (contentType.startsWith("image/")) {
      const blob = await res.blob();
      console.log("Image blob -> type:", blob.type, " size(bytes):", blob.size);
    } else {
      const text = await res.text();
      console.log("Non-image body sample(0..300):", text.slice(0, 300));
    }
  } catch (e) {
    console.error("GET failed:", e?.message || e);
  }
  console.groupEnd();
}

const MinwhaTrans = ({ navigation }) => {
  const { user } = useAuth?.() || {};
  const userId = user?.id;

  const [uploadedImage, setUploadedImage] = useState(null);
  const [convertedImages, setConvertedImages] = useState([]); // [{ id, image:{uri}, timestamp }]
  const [isLoading, setIsLoading] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [lastCreated, setLastCreated] = useState(null); // { id, url, ts }

  // 변환 옵션
  const [styleOption, setStyleOption] = useState("traditional");
  const [qualityOption, setQualityOption] = useState("high");
  const [customPrompt, setCustomPrompt] = useState("");

  // 스크롤 위치 (우측 패널 위치 계산용)
  const [scrollY, setScrollY] = useState(0);

  // 이미지 업로드 (웹 전용)
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({ uri: e.target.result });
        showAlert("업로드 완료", "이미지가 업로드되었습니다.");
        console.log("🧪 Uploaded file:", {
          name: file.name,
          type: file.type,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleConvert = async () => {
    if (!uploadedImage) {
      showAlert("알림", "먼저 이미지를 업로드해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_id", String(userId ?? ""));
      // 웹 DataURL -> Blob 변환
      const resp = await fetch(uploadedImage.uri);
      const blob = await resp.blob();
      formData.append("file", blob, "input.png");
      // 옵션 전달(서버에서 사용 시)
      formData.append("style", styleOption);
      formData.append("quality", qualityOption);
      if (customPrompt) formData.append("prompt", customPrompt);

      const res = await axios.post(`${API_BASE}/predict`, formData);
      // 🧪 /predict 디버그 로그
      try {
        console.group("🧪 /predict RESPONSE");
        console.log("status:", res.status);
        console.log("statusText:", res.statusText);
        console.log("headers:", res.headers);
        console.log("data:", res.data);
        console.groupEnd();
      } catch {}

      const id = res.data.image_id;
      const ts = res.data.created_at;
      const url = `${API_BASE}/image/${id}/transform?t=${Date.now()}`;

      // 🧪 이미지 요청/헤더/본문 타입/사이즈 전부 로깅
      log_image_debug_all(url);

      setPreviewImage({ uri: url });
      setLastCreated({ id, url, ts });
      setPreviewModalVisible(true);
    } catch (err) {
      console.error("❌ 변환 실패:", err?.response?.data || err?.message);
      showAlert("실패", "이미지 변환 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewModalVisible(false);
    if (lastCreated) {
      const newItem = {
        id: lastCreated.id,
        image: { uri: lastCreated.url },
        timestamp: new Date(lastCreated.ts).toLocaleString(),
      };
      setConvertedImages((prev) => [newItem, ...prev]);
      setLastCreated(null);
      setPreviewImage(null);
    }
  };

  const handleDeleteImage = (imageId) => {
    showAlert("확인", "삭제 버튼 눌림"); // 디버그 토스트
    Alert.alert?.("이미지 삭제", "이 이미지를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            if (typeof imageId === "string") {
              await axios.delete(`${API_BASE}/images/${imageId}`);
            }
            // ✅ 프론트 상태에서 해당 카드 제거
            setConvertedImages((prev) =>
              prev.filter((img) => img.id !== imageId)
            );
          } catch (e) {
            showAlert("삭제 실패", e?.response?.data?.detail || e.message);
          }
        },
      },
    ]) ||
      // RN Web에서 Alert API가 막힌 경우 직접 바로 삭제 처리
      setConvertedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleShareImage = () => {
    console.log("share pressed");
    showAlert("업데이트 예정");
  };

  const handleScroll = (event) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  };

  return (
    <ImageBackground
      source={require("../public/hanjiBack.png")}
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ width: "100%", height: "100%" }}
    >
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerLeftButton}
            onPress={() => navigation.navigate("HomeScreen")}
          >
            <Text style={styles.headerLeftButtonText}>민화 사진관</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>민화 변환소</Text>
            <Text style={styles.headerSubtitle}>
              AI로 만나는 전통 민화의 아름다움
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerRightButton}
            onPress={() => navigation.navigate("Gallery")}
          >
            <Text style={styles.headerRightButtonText}>나의 전시관 꾸미기</Text>
          </TouchableOpacity>
        </View>

        {/* 메인 컨텐츠 */}
        <View style={styles.mainContent}>
          {/* 왼쪽: 업로드/결과 */}
          <View style={styles.leftSection}>
            {/* 원본 업로드 */}
            <View style={styles.originalImageSection}>
              <Text style={styles.sectionTitle}>원본 이미지</Text>

              {uploadedImage ? (
                <View style={styles.uploadedImageContainer}>
                  <Image
                    source={uploadedImage}
                    style={styles.uploadedImage}
                    resizeMode="contain"
                    /* 🧪 원본 미리보기 로딩 로그 */
                    onLoadStart={() =>
                      console.log(
                        "📷 original onLoadStart:",
                        uploadedImage?.uri
                      )
                    }
                    onLoad={({ nativeEvent }) =>
                      console.log("📷 original onLoad:", nativeEvent?.source)
                    }
                    onError={(e) =>
                      console.log("📷 original onError:", e?.nativeEvent)
                    }
                    onLoadEnd={() => console.log("📷 original onLoadEnd")}
                  />
                  <TouchableOpacity
                    style={styles.changeImageButton}
                    onPress={handleImageUpload}
                  >
                    <Text style={styles.changeImageButtonText}>변경</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadArea}
                  onPress={handleImageUpload}
                >
                  <Text style={styles.uploadIcon}>📷</Text>
                  <Text style={styles.uploadText}>이미지를 업로드하세요</Text>
                  <Text style={styles.uploadSubtext}>
                    JPG, PNG 파일을 지원합니다
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 결과 갤러리 */}
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>변환된 민화 작품</Text>

              {convertedImages.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>🎨</Text>
                  <Text style={styles.emptyStateText}>
                    변환된 이미지가 없습니다
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    이미지를 업로드하고 변환해보세요
                  </Text>
                </View>
              ) : (
                <View style={styles.resultsGrid}>
                  {convertedImages.map((item) => (
                    <View key={item.id} style={styles.resultImageItem}>
                      <Image
                        source={item.image}
                        style={styles.resultImage}
                        resizeMode="cover"
                        /* 🧪 갤러리 이미지 로딩 로그 */
                        onLoadStart={() =>
                          console.log(
                            "🖼️ gallery onLoadStart:",
                            item.image?.uri
                          )
                        }
                        onLoad={({ nativeEvent }) =>
                          console.log("🖼️ gallery onLoad:", {
                            id: item.id,
                            timestamp: item.timestamp,
                            source: nativeEvent?.source,
                          })
                        }
                        onError={(e) =>
                          console.log("🖼️ gallery onError:", {
                            id: item.id,
                            error: e?.nativeEvent,
                          })
                        }
                        onLoadEnd={() =>
                          console.log("🖼️ gallery onLoadEnd:", item.id)
                        }
                      />
                      <View style={styles.resultImageInfo}>
                        <Text style={styles.resultTimestamp}>
                          {item.timestamp}
                        </Text>
                        <View style={styles.resultActions}>
                          <TouchableOpacity
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            style={styles.resultActionButton}
                            onPress={handleShareImage}
                            onPressIn={() => console.log("share pressIn")} // fallback 로그
                          >
                            <Text style={styles.resultActionButtonText}>
                              공유
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            style={[
                              styles.resultActionButton,
                              styles.deleteButton,
                            ]}
                            onPress={() => handleDeleteImage(item.id)}
                            onPressIn={() => console.log("delete pressIn")} // fallback 로그
                          >
                            <Text style={styles.resultActionButtonText}>
                              삭제
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 오른쪽 고정: 옵션/버튼 (컨테이너는 터치 무시, 자식은 터치 허용) */}
        <View
          style={[
            styles.rightFixedSection,
            {
              top: Math.max(120, height * 0.15) + scrollY,
              pointerEvents: "none",
            },
          ]}
        >
          <View style={[styles.optionsCard, { pointerEvents: "auto" }]}>
            <Text style={styles.cardTitle}>변환 옵션</Text>

            {/* 스타일 선택 */}
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>민화 스타일</Text>
              <View style={styles.optionSelect}>
                <TouchableOpacity
                  style={[
                    styles.optionInput,
                    styleOption === "traditional" && { borderColor: "#2C2C2C" },
                  ]}
                  onPress={() => setStyleOption("traditional")}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      styleOption === "traditional" && { color: "#2C2C2C" },
                    ]}
                  >
                    전통 민화
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionInput,
                    styleOption === "modern" && { borderColor: "#2C2C2C" },
                  ]}
                  onPress={() => setStyleOption("modern")}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      styleOption === "modern" && { color: "#2C2C2C" },
                    ]}
                  >
                    현대 민화
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 품질 선택 */}
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>변환 품질</Text>
              <View style={styles.optionSelect}>
                <TouchableOpacity
                  style={[
                    styles.optionInput,
                    qualityOption === "standard" && { borderColor: "#2C2C2C" },
                  ]}
                  onPress={() => setQualityOption("standard")}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      qualityOption === "standard" && { color: "#2C2C2C" },
                    ]}
                  >
                    표준
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionInput,
                    qualityOption === "high" && { borderColor: "#2C2C2C" },
                  ]}
                  onPress={() => setQualityOption("high")}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      qualityOption === "high" && { color: "#2C2C2C" },
                    ]}
                  >
                    고품질
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 커스텀 프롬프트 */}
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>커스텀 프롬프트 (선택사항)</Text>
              <TextInput
                style={styles.optionInput}
                placeholder="원하는 스타일을 자유롭게 입력하세요"
                placeholderTextColor="#8A8A8A"
                value={customPrompt}
                onChangeText={setCustomPrompt}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* 변환 버튼 */}
          <TouchableOpacity
            style={[
              styles.convertButton,
              (!uploadedImage || isLoading) && styles.convertButtonDisabled,
              { pointerEvents: "auto" },
            ]}
            onPress={handleConvert}
            disabled={!uploadedImage || isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.convertButtonText}>변환 중...</Text>
              </View>
            ) : (
              <Text style={styles.convertButtonText}>민화로 변환</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 미리보기 팝업 */}
      <Modal
        visible={previewModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClosePreview}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>변환 완료!</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClosePreview}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalImageContainer}>
              <Image
                source={previewImage}
                style={styles.modalImage}
                resizeMode="contain"
                /* 🧪 미리보기 이미지 로딩 로그 */
                onLoadStart={() =>
                  console.log("🔎 preview onLoadStart:", previewImage?.uri)
                }
                onLoad={({ nativeEvent }) =>
                  console.log("🔎 preview onLoad:", nativeEvent?.source)
                }
                onError={(e) =>
                  console.log("🔎 preview onError:", e?.nativeEvent)
                }
                onLoadEnd={() => console.log("🔎 preview onLoadEnd")}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={handleClosePreview}
              >
                <Text style={styles.modalActionButtonText}>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionButton, styles.shareButton]}
                onPress={() => {
                  showAlert("업데이트 예정");
                  handleClosePreview();
                }}
              >
                <Text style={styles.modalActionButtonText}>공유</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default MinwhaTrans;
