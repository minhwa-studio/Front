# 웹 동영상 배경 구현 가이드

## 개요
React Native + Expo 웹 환경에서 풀스크린 배경 동영상을 구현하는 방법을 설명합니다.

## 폴더 구조
```
src/
├── components/
│   └── VideoBackground/
│       └── index.tsx          # 메인 동영상 배경 컴포넌트
├── constants/
│   └── backgroundVideos.web.ts # 웹용 동영상 URI 상수
public/
└── home_mp4/                  # 동영상 파일들
    ├── cloud.mp4
    ├── flowers.mp4
    ├── nan.mp4
    ├── opencharmkke.mp4
    ├── hojakhodoh.mp4
    └── hwajodoh.mp4
```

## 퍼블릭 경로 규칙
- 웹에서는 `/home_mp4/<filename>.mp4`로 접근
- 파일명은 영문/숫자만 사용 (특수문자, 공백, 한글 제거)
- 404 오류 방지를 위해 정확한 경로 확인 필요

## 자동재생 정책
### 웹 브라우저 제약사항
- **반드시 muted=true로 시작**
- `allowsInlineMediaPlayback`/`playsInline` 활성화
- 사용자 상호작용 없이는 자동재생 제한

### 구현 방식
```javascript
// 자동재생 시도
await videoRef.current.setIsMutedAsync(true);
await videoRef.current.playAsync();

// 실패 시 수동 재생 버튼 표시
{autoplayFailed && (
  <Pressable onPress={handleManualPlay}>
    {/* 재생 버튼 UI */}
  </Pressable>
)}
```

## 동영상 정렬 및 크기 조정
### 스타일 전략
```javascript
const containerStyle = {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
  width: "100%", height: "100%",
  overflow: "hidden",
};

const videoStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover", // RN-Web에서 추가 보장
};
```

### resizeMode 옵션
- `cover`: 화면을 완전히 채움 (일부 잘릴 수 있음)
- `contain`: 비율 유지하며 화면에 맞춤 (여백 생길 수 있음)
- `stretch`: 비율 무시하고 화면에 맞춤

## 순차 재생 구현
```javascript
const onPlaybackStatusUpdate = useCallback((status) => {
  if (status?.didJustFinish) {
    goToNext(); // 다음 동영상으로 전환
  }
}, [goToNext]);

// isLooping={false}로 설정하여 순차 재생
<Video
  isLooping={false}
  onPlaybackStatusUpdate={onPlaybackStatusUpdate}
/>
```

## 폴백 전략
### 웹 전용 HTML5 video 태그
expo-av가 특정 브라우저에서 문제가 있을 경우:

```javascript
if (Platform.OS === "web") {
  return (
    <video
      src={sources[currentIndex].uri}
      autoPlay
      muted
      loop={false}
      playsInline
      onEnded={goToNext}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}
```

## 워터마크 정책
### 제한사항
- 동영상 파일에 내장된 워터마크는 제거 불가
- 파일 자체를 수정해야 함

### 대안: 마스킹 오버레이
```javascript
// 워터마크 영역 마스킹
const renderMaskOverlay = () => {
  if (!maskRegion) return null;
  
  return (
    <View
      style={{
        position: "absolute",
        top: maskRegion.top,
        left: maskRegion.left,
        width: maskRegion.width,
        height: maskRegion.height,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(10px)",
      }}
    />
  );
};
```

## 브라우저별 주의사항
### Chrome/Edge
- 자동재생 정책이 엄격함
- muted 상태에서만 자동재생 가능

### Safari
- `playsInline` 속성 필수
- iOS에서 전체화면 모드 방지

### Firefox
- 대부분의 기능 지원
- 일부 CSS 속성 제한 가능

## 성능 최적화
### 메모리 관리
```javascript
useEffect(() => {
  let mounted = true;
  
  const attemptAutoplay = async () => {
    // 자동재생 로직
  };
  
  return () => { 
    mounted = false; // 메모리 누수 방지
  };
}, [currentIndex]);
```

### 탭 가시성 처리
```javascript
// 페이지 가시성 변화 감지
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // 일시정지
    } else {
      // 재생
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, []);
```

## 테스트 체크리스트
- [ ] 다양한 브라우저 창 크기에서 중앙 정렬 확인
- [ ] 6개 동영상 순차 재생 및 순환 확인
- [ ] 자동재생 성공/실패 시나리오 테스트
- [ ] 탭 전환 시 재생 상태 확인
- [ ] 폴백 모드(HTML5 video) 동작 확인
- [ ] 메모리 누수 없음 확인

## 문제 해결
### 동영상이 재생되지 않는 경우
1. 파일 경로 확인 (`/home_mp4/` 접두사)
2. 파일명에 특수문자/공백 없는지 확인
3. 브라우저 개발자 도구에서 404 오류 확인

### 자동재생이 실패하는 경우
1. `muted=true` 설정 확인
2. `playsInline` 속성 추가
3. 사용자 상호작용 후 재생 시도

### 동영상이 중앙에 오지 않는 경우
1. `objectFit: "cover"` 속성 확인
2. 컨테이너 스타일 `position: absolute` 확인
3. 브라우저별 CSS 호환성 확인

## 환경변수 설정
```bash
# 웹 전용 video 태그 사용 강제
REACT_APP_USE_NATIVE_VIDEO=false

# 워터마크 마스킹 활성화
REACT_APP_ENABLE_WATERMARK_MASK=true
```
