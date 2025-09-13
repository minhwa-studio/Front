import React, { useRef, useState, useEffect, useCallback } from "react";
import { Platform, View, Pressable, Text } from "react-native";
import { Video } from "expo-av";
import { BACKGROUND_VIDEO_URIS } from "../../constants/backgroundVideos.web";

interface VideoBackgroundProps {
  maskRegion?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  onVideoChange?: (index: number) => void;
}

export default function VideoBackground({ 
  maskRegion, 
  onVideoChange 
}: VideoBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  const sources = BACKGROUND_VIDEO_URIS.map((uri) => ({ uri }));

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % sources.length;
    setCurrentIndex(nextIndex);
    onVideoChange?.(nextIndex);
  }, [currentIndex, sources.length, onVideoChange]);

  // Expo-AV 상태 업데이트 핸들러
  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (status?.didJustFinish) {
      goToNext();
    }
    if (status?.isLoaded && status?.error) {
      console.warn("Video error:", status.error);
    }
    if (status?.isLoaded) {
      setIsPlaying(status.isPlaying);
    }
  }, [goToNext]);

  // 웹 자동재생 시도
  useEffect(() => {
    let mounted = true;
    
    const attemptAutoplay = async () => {
      try {
        if (Platform.OS === "web" && videoRef.current) {
          await videoRef.current.setIsMutedAsync(true);
          await videoRef.current.playAsync();
          setAutoplayFailed(false);
        }
      } catch (error) {
        console.warn("Autoplay failed:", error);
        if (mounted) {
          setAutoplayFailed(true);
        }
      }
    };

    attemptAutoplay();
    
    return () => { 
      mounted = false; 
    };
  }, [currentIndex]);

  // 수동 재생 핸들러
  const handleManualPlay = useCallback(async () => {
    try {
      if (videoRef.current) {
        await videoRef.current.setIsMutedAsync(true);
        await videoRef.current.playAsync();
        setAutoplayFailed(false);
      }
    } catch (error) {
      console.warn("Manual play failed:", error);
    }
  }, []);

  // 스타일 정의
  const containerStyle = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden" as const,
  };

  const videoStyle = {
    width: "100%",
    height: "100%",
    // RN-Web에서 expo-av의 resizeMode="cover"가 불완전한 경우 대비
    objectFit: "cover" as any,
  };

  // 워터마크 마스킹 오버레이
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

  // 웹 폴백: HTML5 <video> 태그 사용
  if (Platform.OS === "web") {
    return (
      <View style={containerStyle}>
        <video
          key={sources[currentIndex].uri}
          src={sources[currentIndex].uri}
          autoPlay
          muted
          loop={false}
          playsInline
          onEnded={goToNext}
          onError={() => setAutoplayFailed(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        
        {/* 자동재생 실패 시 재생 버튼 */}
        {autoplayFailed && (
          <Pressable
            onPress={() => {
              const videoElement = document.querySelector("video") as HTMLVideoElement | null;
              if (videoElement) {
                videoElement.muted = true;
                videoElement.play().catch(() => {});
              }
              setAutoplayFailed(false);
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
          >
            <View
              style={{
                padding: 20,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16, marginBottom: 8 }}>
                동영상 재생
              </Text>
              <Text style={{ color: "white", fontSize: 12, opacity: 0.8 }}>
                클릭하여 재생
              </Text>
            </View>
          </Pressable>
        )}
        
        {renderMaskOverlay()}
      </View>
    );
  }

  // 기본 구현: Expo-AV Video 컴포넌트
  return (
    <View style={containerStyle}>
      <Video
        ref={videoRef}
        source={sources[currentIndex]}
        style={videoStyle}
        resizeMode="cover"
        shouldPlay
        isLooping={false}
        isMuted
        useNativeControls={false}
        allowsFullscreen={false}
        allowsInlineMediaPlayback
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />
      
      {/* 자동재생 실패 시 재생 버튼 */}
      {autoplayFailed && (
        <Pressable
          onPress={handleManualPlay}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        >
          <View
            style={{
              padding: 20,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, marginBottom: 8 }}>
              동영상 재생
            </Text>
            <Text style={{ color: "white", fontSize: 12, opacity: 0.8 }}>
              클릭하여 재생
            </Text>
          </View>
        </Pressable>
      )}
      
      {renderMaskOverlay()}
    </View>
  );
}
