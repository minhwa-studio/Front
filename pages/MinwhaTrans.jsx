import React, { useState } from "react";
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
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";

const MinwhaTrans = ({ navigation }) => {
  // ✅ AuthContext에서 user 객체 사용 (id 안전 추출)
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

  // 스크롤 위치
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
        Alert.alert("업로드 완료", "이미지가 업로드되었습니다.");
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleConvert = async () => {
    if (!uploadedImage) {
      Alert.alert("알림", "먼저 이미지를 업로드해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_id", String(userId ?? ""));
      // 웹 DataURL -> Blob
      const resp = await fetch(uploadedImage.uri);
      const blob = await resp.blob();
      formData.append("file", blob, "input.png");
      // (옵션 전달 필요시 추가)
      formData.append("style", styleOption);
      formData.append("quality", qualityOption);
      if (customPrompt) formData.append("prompt", customPrompt);

      // axios가 FormData 헤더 자동 설정
      const res = await axios.post(`${API_BASE}/predict`, formData);
      const id = res.data.image_id;
      const ts = res.data.created_at;
      const url = `${API_BASE}/image/${id}/transform?t=${Date.now()}`;

      setPreviewImage({ uri: url });
      setLastCreated({ id, url, ts });
      setPreviewModalVisible(true);
    } catch (err) {
      console.error("❌ 변환 실패:", err?.response?.data || err?.message);
      Alert.alert("실패", "이미지 변환 중 오류가 발생했습니다.");
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
    Alert.alert("이미지 삭제", "이 이미지를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            // 서버 이미지(문자열 id)인 경우 서버에도 삭제 요청
            if (typeof imageId === "string") {
              await axios.delete(`${API_BASE}/images/${imageId}`);
            }
            // ✅ 프론트 상태에서 해당 카드만 제거
            setConvertedImages((prev) => prev.filter((img) => img.id !== imageId));
          } catch (e) {
            Alert.alert("삭제 실패", e?.response?.data?.detail || e.message);
          }
        },
      },
    ]);
  };

  const handleShareImage = () => {
    // ✅ 요청사항: "업데이트 예정" 알림만
    Alert.alert("업데이트 예정");
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
            <Text style={styles.headerSubtitle}>AI로 만나는 전통 민화의 아름다움</Text>
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
                  />
                  <TouchableOpacity style={styles.changeImageButton} onPress={handleImageUpload}>
                    <Text style={styles.changeImageButtonText}>변경</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadArea} onPress={handleImageUpload}>
                  <Text style={styles.uploadIcon}>📷</Text>
                  <Text style={styles.uploadText}>이미지를 업로드하세요</Text>
                  <Text style={styles.uploadSubtext}>JPG, PNG 파일을 지원합니다</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 결과 갤러리 */}
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>변환된 민화 작품</Text>

              {convertedImages.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>🎨</Text>
                  <Text style={styles.emptyStateText}>변환된 이미지가 없습니다</Text>
                  <Text style={styles.emptyStateSubtext}>이미지를 업로드하고 변환해보세요</Text>
                </View>
              ) : (
                <View style={styles.resultsGrid}>
                  {convertedImages.map((item) => (
                    <View key={item.id} style={styles.resultImageItem}>
                      <Image source={item.image} style={styles.resultImage} resizeMode="cover" />
                      <View style={styles.resultImageInfo}>
                        <Text style={styles.resultTimestamp}>{item.timestamp}</Text>
                        <View style={styles.resultActions}>
                          <TouchableOpacity
                            style={styles.resultActionButton}
                            onPress={handleShareImage}
                          >
                            <Text style={styles.resultActionButtonText}>공유</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.resultActionButton, styles.deleteButton]}
                            onPress={() => handleDeleteImage(item.id)}
                          >
                            <Text style={styles.resultActionButtonText}>삭제</Text>
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

        {/* 오른쪽 고정: 옵션/버튼 */}
        <View
          style={[
            styles.rightFixedSection,
            { top: Math.max(120, height * 0.15) + scrollY },
          ]}
        >
          <View style={styles.optionsCard}>
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
              <TouchableOpacity style={styles.closeButton} onPress={handleClosePreview}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalImageContainer}>
              <Image source={previewImage} style={styles.modalImage} resizeMode="contain" />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalActionButton} onPress={handleClosePreview}>
                <Text style={styles.modalActionButtonText}>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionButton, styles.shareButton]}
                onPress={() => {
                  Alert.alert("업데이트 예정"); // ✅ 요청 메시지
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
