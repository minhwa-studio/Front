import React, { useEffect, useState } from "react";
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
} from "react-native";
import { styles } from "./MinwhaTrans.styles";
import { useAuth } from "../AuthContext";
import axios from "axios";

const { width, height } = Dimensions.get("window");
const API_BASE = Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";

const MinwhaTrans = ({ navigation }) => {
  const { userId } = useAuth();

  const [uploadedImage, setUploadedImage] = useState(null);
  const [convertedImages, setConvertedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (userId) loadHistory();
  }, [userId]);

  const loadHistory = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/images`, {
        params: { user_id: userId, limit: 50, skip: 0 },
      });

      const items = (data || []).map((x) => {
        // 백엔드가 absolute/relative 둘 다 올 수 있으니 안전하게 처리
        const rel = x.transform_url || `/image/${x.image_id}/transform`;
        const url = rel.startsWith("http") ? rel : `${API_BASE}${rel}`;
        return {
          id: x.image_id,
          image: { uri: `${url}?t=${Date.now()}` },
          timestamp: new Date(x.created_at).toLocaleString(),
          isFinal: x.is_final,
        };
      });
      setConvertedImages(items);
    } catch (e) {
      console.error("❌ 히스토리 로드 실패:", e.response?.data || e.message);
    }
  };

  // 이미지 업로드 (웹)
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

  // 민화 변환 시작
  const handleConvert = async () => {
    if (!uploadedImage) {
      Alert.alert("알림", "먼저 이미지를 업로드해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_id", String(userId ?? ""));

      // data URL → Blob
      const response = await fetch(uploadedImage.uri);
      const blob = await response.blob();

      if (Platform.OS === "web") {
        formData.append("file", blob, "input.png");
      } else {
        formData.append("file", {
          uri: uploadedImage.uri,
          name: "input.png",
          type: blob.type || "image/png",
        });
      }

      const res = await axios.post(`${API_BASE}/predict`, formData); // 헤더 지정 X

      // 서버의 변환 이미지 HTTP URL 생성
      const id = res.data.image_id;
      const transformUrl = `${API_BASE}/image/${id}/transform?t=${Date.now()}`;

      setPreviewImage({ uri: transformUrl });
      setPreviewModalVisible(true);

      // 목록 갱신
      loadHistory();
    } catch (err) {
      console.error("❌ 변환 실패:", err.response?.data || err.message);
      Alert.alert("실패", "이미지 변환 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 미리보기 닫기
  const handleClosePreview = () => {
    setPreviewModalVisible(false);
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

  const handleDeleteImage = (imageId) => {
    Alert.alert("이미지 삭제", "이 이미지를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          setConvertedImages((prev) => prev.filter((img) => img.id !== imageId));
        },
      },
    ]);
  };

  const handleShareImage = (image) => {
    Alert.alert("공유", "이미지 공유 기능은 준비 중입니다.");
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>민화 변환</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 메인 컨텐츠 */}
      <View style={styles.mainContent}>
        {/* 왼쪽 영역 - 이미지 업로드 */}
        <View style={styles.leftSection}>
          <Text style={styles.sectionTitle}>원본 이미지</Text>

          {uploadedImage ? (
            <View style={styles.uploadedImageContainer}>
              <Image source={uploadedImage} style={styles.uploadedImage} resizeMode="contain" />
              <TouchableOpacity style={styles.changeImageButton} onPress={handleImageUpload}>
                <Text style={styles.changeImageButtonText}>이미지 변경</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadArea} onPress={handleImageUpload}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>이미지를 업로드하세요</Text>
              <Text style={styles.uploadSubtext}>파일을 선택하거나 클릭하세요</Text>
              <Text style={styles.uploadSubtext}>JPG, PNG 파일을 지원합니다</Text>
            </TouchableOpacity>
          )}

          {/* 변환 버튼 */}
          <TouchableOpacity
            style={[styles.convertButton, (!uploadedImage || isLoading) && styles.convertButtonDisabled]}
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

        {/* 오른쪽 영역 - 변환된 이미지 목록 */}
        <View style={styles.rightSection}>
          <Text style={styles.sectionTitle}>변환된 이미지</Text>

          <ScrollView style={styles.convertedImagesList} showsVerticalScrollIndicator={false}>
            {convertedImages.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🎨</Text>
                <Text style={styles.emptyStateText}>변환된 이미지가 없습니다</Text>
                <Text style={styles.emptyStateSubtext}>이미지를 업로드하고 변환해보세요</Text>
              </View>
            ) : (
              convertedImages.map((item) => (
                <View key={item.id} style={styles.convertedImageItem}>
                  <Image source={item.image} style={styles.convertedImage} resizeMode="cover" />
                  <View style={styles.imageInfo}>
                    <Text style={styles.imageTimestamp}>{item.timestamp}</Text>
                    <View style={styles.imageActions}>
                      <TouchableOpacity style={styles.actionButton} onPress={() => handleShareImage(item.image)}>
                        <Text style={styles.actionButtonText}>공유</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeleteImage(item.id)}
                      >
                        <Text style={[styles.actionButtonText, styles.deleteButtonText]}>삭제</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>

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
    </View>
  );
};

export default MinwhaTrans;
