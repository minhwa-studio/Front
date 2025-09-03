import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import { styles } from "./Login.styles";
import { useAuth } from "../AuthContext"; 
const { width, height } = Dimensions.get("window");

const Login = ({ navigation }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // 폼 데이터 업데이트
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 에러 메시지 초기화
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // 비밀번호 표시/숨김 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 유효성 검사
const validateForm = () => {
  const errors = {};

  if (!formData.email?.trim()) {
    errors.email = "이메일을 입력해주세요.";
  }
  if (!formData.password?.trim()) {
    errors.password = "비밀번호를 입력해주세요.";
  }

  setErrors(errors);

  const isValid = Object.keys(errors).length === 0;
  console.log("⚠️ 유효성 검사 에러:", errors);
  return isValid;
};




  const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    console.log("🚀 axios 요청 전");

    const response = await axios.post(`http://localhost:8000/user/login`, formData);
    console.log("✅ 로그인 성공:", response.data);

    const { access_token, user } = response.data; // ✅ 구조 맞게 수정
    login(user); // ✅ user 그대로 넘기기 (name이 아닌 user 전체)

    navigation.replace("HomeScreen"); // ✅ 성공 시 이동
  } catch (err) {
    console.error("❌ 로그인 실패:", err);
    Alert.alert("로그인 실패", "이메일 또는 비밀번호가 올바르지 않습니다.");
  }
};




  // 비밀번호 찾기
  const handleForgotPassword = () => {
    Alert.alert(
      "비밀번호 찾기",
      "비밀번호 찾기 기능은 준비 중입니다.\n관리자에게 문의해주세요.",
      [{ text: "확인" }]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>로그인</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 배경 이미지 */}
      <View style={styles.backgroundContainer}>
        <Image
          source={require("../public/호랑이와 까치.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.backgroundOverlay} />
      </View>

      {/* 메인 컨텐츠 */}
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>다시 오신 것을 환영합니다</Text>
          <Text style={styles.subtitleText}>
            민화의 아름다운 세계로 돌아오세요
          </Text>

          {/* 이메일 입력 */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>이메일</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="이메일을 입력해주세요"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* 비밀번호 입력 */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>비밀번호</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  errors.password && styles.inputError,
                ]}
                placeholder="비밀번호를 입력해주세요"
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
                secureTextEntry={!showPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={togglePasswordVisibility}
              >
                <Text style={styles.eyeButtonText}>
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* 비밀번호 찾기 링크 */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>
              비밀번호를 잊으셨나요?
            </Text>
          </TouchableOpacity>

          {/* 로그인 버튼 */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>

          {/* 소셜 로그인 */}
          <View style={styles.socialLoginSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Kakao</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Naver</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 회원가입 링크 */}
          <View style={styles.signUpLinkContainer}>
            <Text style={styles.signUpLinkText}>계정이 없으신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.signUpLink}>회원가입하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;