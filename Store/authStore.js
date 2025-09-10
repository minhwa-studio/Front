// src/store/authStore.js
import create from "zustand";
import axios from "axios";
import Constants from "expo-constants";

const { API_URL } = Constants.expoConfig.extra;
import { Alert, Platform } from "react-native";

/** 로컬/에뮬레이터 접근 가이드
 * - Android 에뮬레이터: http://10.0.2.2:8000
 * - iOS 시뮬레이터:    http://localhost:8000
 * - 실디바이스:       http://<PC_IP>:8000
 */
const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : `${API_URL}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 토큰 헤더 헬퍼(로그인 붙일 경우 대비용)
const setAuthHeader = (token) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
};

const useAuthStore = create((set, get) => ({
  // -------- 상태 --------
  user: null, // { id, name, token? } ← 로그인 붙일 때 사용
  tempImages: [], // 임시(미확정) 이미지 목록 (is_final=false)
  artsByUser: [], // 최종 확정 이미지 목록 (is_final=true)
  loading: false,

  // -------- 공통 유틸 --------
  setUser: (user) => {
    set({ user });
    setAuthHeader(user?.token);
  },
  logout: () => {
    set({ user: null, tempImages: [], artsByUser: [] });
    setAuthHeader(null);
  },

  // -------- API 액션 --------

  /** 1) 이미지 생성 요청 (POST /predict)
   * 백엔드 규격: JSON { user_id?: string }
   * - 프롬프트/파일 전송 없음 (현재 스펙)
   * - 응답: { message, image_id, user_id, created_at }
   */
  requestImagePrediction: async () => {
    const userId = get().user?.id ?? null; // 없으면 null로 보냄
    try {
      set({ loading: true });
      const res = await api.post("/predict", { user_id: userId });
      Alert.alert("성공", "이미지 생성 요청 완료");
      return res.data;
    } catch (err) {
      console.error(
        "[requestImagePrediction] error:",
        err?.response?.data || err
      );
      Alert.alert("실패", "이미지 생성 중 오류가 발생했습니다.");
      return null;
    } finally {
      set({ loading: false });
    }
  },

  /** 2) 임시 이미지 목록 조회 (GET /images?user_id=...)
   * - 쿼리: user_id(문자열,ObjectId string)
   * - 응답: ImageModel[] (is_final=false만)
   */
  getTempImages: async () => {
    const userId = get().user?.id;
    if (!userId) return [];
    try {
      set({ loading: true });
      const res = await api.get("/images", { params: { user_id: userId } });
      const list = Array.isArray(res.data) ? res.data : [];
      set({ tempImages: list });
      return list;
    } catch (err) {
      console.error("[getTempImages] error:", err?.response?.data || err);
      return [];
    } finally {
      set({ loading: false });
    }
  },

  /** 3) 최종 확정 이미지 목록 (GET /art/{user_id})
   * - 경로파라미터: user_id(문자열,ObjectId string)
   * - 응답: ImageModel[] (is_final=true만)
   */
  getArtsByUserId: async (userId) => {
    try {
      set({ loading: true });
      const res = await api.get(`/art/${encodeURIComponent(userId)}`);
      const list = Array.isArray(res.data) ? res.data : [];
      set({ artsByUser: list });
      return list;
    } catch (err) {
      console.error("[getArtsByUserId] error:", err?.response?.data || err);
      return [];
    } finally {
      set({ loading: false });
    }
  },

  /** 4) 이미지 최종 확정 (POST /images/finalize?image_id=...)
   * 백엔드 규격: 쿼리 파라미터로 image_id 전달 (본문 아님)
   * - 응답: { message, image_id }
   */
  finalizeImage: async (imageId) => {
    try {
      set({ loading: true });
      const res = await api.post(`/images/finalize`, null, {
        params: { image_id: imageId },
      });
      Alert.alert("완료", "이미지를 갤러리에 확정했습니다.");
      return res.data;
    } catch (err) {
      console.error("[finalizeImage] error:", err?.response?.data || err);
      Alert.alert("실패", "이미지 확정 중 오류가 발생했습니다.");
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
