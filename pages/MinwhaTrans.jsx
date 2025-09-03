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

const MinwhaTrans = ({ navigation }) => {
  const { userId } = useAuth();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [convertedImages, setConvertedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // 새로운 옵션 상태들
  const [styleOption, setStyleOption] = useState("traditional");
  const [qualityOption, setQualityOption] = useState("high");
  const [customPrompt, setCustomPrompt] = useState("");

  // 스크롤 위치 상태
  const [scrollY, setScrollY] = useState(0);

  // 이미지 업로드 (갤러리에서 선택)
  const handleImageUpload = () => {
    pickImageFromGallery();
  };

  // 이미지 선택 (웹 환경)
  const pickImageFromGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage({ uri: e.target.result });
          Alert.alert("업로드 완료", "이미지가 업로드되었습니다.");
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // 민화 변환 시작
  const handleConvert = async () => {
    if (!uploadedImage) {
      Alert.alert("알림", "먼저 이미지를 업로드해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`http://localhost:8000/predict`, {
        user_id: userId,
      });

      console.log("✅ 변환 요청 성공:", res.data);

      // 예시: 썸네일 이미지 넣기 (실제 이미지 URL 있으면 교체)
      const dummyImage = require("../public/호랑이와 까치.jpg");

      const previewData = {
        id: res.data.image_id,
        image: dummyImage,
        timestamp: new Date(res.data.created_at).toLocaleString(),
      };

      setPreviewImage(previewData.image);
      setPreviewModalVisible(true);
    } catch (err) {
      console.error("❌ 변환 실패:", err.response?.data || err.message);
      Alert.alert("실패", "이미지 변환 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 미리보기 팝업 닫기
  const handleClosePreview = () => {
    setPreviewModalVisible(false);

    // 변환된 이미지를 오른쪽 목록에 추가
    if (previewImage) {
      const newConvertedImage = {
        id: Date.now(),
        image: previewImage,
        timestamp: new Date().toLocaleString(),
      };
      setConvertedImages((prev) => [newConvertedImage, ...prev]);
      setPreviewImage(null);
    }
  };

  // 이미지 삭제
  const handleDeleteImage = (imageId) => {
    Alert.alert("이미지 삭제", "이 이미지를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          setConvertedImages((prev) =>
            prev.filter((img) => img.id !== imageId)
          );
        },
      },
    ]);
  };

  // 이미지 공유
  const handleShareImage = (image) => {
    Alert.alert("공유", "이미지 공유 기능은 준비 중입니다.");
  };

  // 스크롤 이벤트 핸들러
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
        {/* 상단 헤더 - Hard Graft 스타일 */}
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

        {/* 메인 컨텐츠 영역 - 왼쪽만 스크롤 */}
        <View style={styles.mainContent}>
          {/* 왼쪽 영역 - 원본 이미지 및 결과 갤러리 */}
          <View style={styles.leftSection}>
            {/* 원본 이미지 업로드 영역 */}
            <View style={styles.originalImageSection}>
              <Text style={styles.sectionTitle}>원본 이미지</Text>

              {uploadedImage ? (
                <View style={styles.uploadedImageContainer}>
                  <Image
                    source={uploadedImage}
                    style={styles.uploadedImage}
                    resizeMode="contain"
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

            {/* 변환 결과 갤러리 영역 */}
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
                      />
                      <View style={styles.resultImageInfo}>
                        <Text style={styles.resultTimestamp}>
                          {item.timestamp}
                        </Text>
                        <View style={styles.resultActions}>
                          <TouchableOpacity
                            style={styles.resultActionButton}
                            onPress={() => handleShareImage(item.image)}
                          >
                            <Text style={styles.resultActionButtonText}>
                              공유
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.resultActionButton,
                              styles.deleteButton,
                            ]}
                            onPress={() => handleDeleteImage(item.id)}
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

        {/* 오른쪽 고정 영역 - 변환 옵션 및 버튼 */}
        <View
          style={[
            styles.rightFixedSection,
            { top: Math.max(120, height * 0.15) + scrollY },
          ]}
        >
          {/* 변환 옵션 카드 */}
          <View style={styles.optionsCard}>
            <Text style={styles.cardTitle}>변환 옵션</Text>

            {/* 스타일 선택 */}
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>민화 스타일</Text>
              <View style={styles.optionSelect}>
                <TouchableOpacity
                  style={[
                    styles.optionInput,
                    styleOption === "traditional" && {
                      borderColor: "#2C2C2C",
                    },
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
                    qualityOption === "standard" && {
                      borderColor: "#2C2C2C",
                    },
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
                  handleShareImage(previewImage);
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
