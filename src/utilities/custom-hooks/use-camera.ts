import { useCallback, useEffect, useRef, useState } from "react";
import { cameraErrorMessage, createCameraSession } from "../camera-session";

interface CameraOptions {
  active: boolean;
  facingMode?: "user" | "environment";
  deviceId?: string;
}

interface CaptureOptions {
  quality?: number;
  mirrored?: boolean;
}

export default function useCamera({ active, facingMode = "user", deviceId }: CameraOptions) {
  const [session] = useState(() => createCameraSession());
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onVideoReady = useCallback(() => {
    const video = videoElement.current;
    setIsReady(Boolean(video && video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2));
  }, []);

  const videoRef = useCallback((video: HTMLVideoElement | null) => {
    const previous = videoElement.current;
    previous?.removeEventListener("loadeddata", onVideoReady);
    previous?.removeEventListener("canplay", onVideoReady);
    if (previous && previous !== video) previous.srcObject = null;
    videoElement.current = video;
    if (video) {
      video.addEventListener("loadeddata", onVideoReady);
      video.addEventListener("canplay", onVideoReady);
      video.srcObject = streamRef.current;
    }
  }, [onVideoReady]);

  const stopCamera = useCallback(() => {
    session.stop();
    streamRef.current = null;
    if (videoElement.current) videoElement.current.srcObject = null;
    setStream(null);
    setIsReady(false);
    setIsLoading(false);
  }, [session]);

  useEffect(() => {
    setIsReady(false);
    setError(null);
    setStream(null);
    if (!active) {
      stopCamera();
      return;
    }

    setIsLoading(true);
    // getUserMedia is the permission authority. Permissions.query("camera") is
    // optional and unavailable on some iOS/Android browsers.
    void session.start(
      { audio: false, video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode } },
      (nextStream) => {
        streamRef.current = nextStream;
        setStream(nextStream);
        if (videoElement.current) videoElement.current.srcObject = nextStream;
        setIsLoading(false);
      },
      (cause) => {
        setError(cameraErrorMessage(cause));
        setIsLoading(false);
      },
    );

    return () => {
      session.stop();
      streamRef.current = null;
      if (videoElement.current) videoElement.current.srcObject = null;
    };
  }, [active, deviceId, facingMode, session, stopCamera]);

  const capture = useCallback(({ quality = 0.92, mirrored = false }: CaptureOptions = {}) => {
    const video = videoElement.current;
    if (!video || !streamRef.current || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return null;
    if (mirrored) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    // Only draw the video pixels. Guides and controls remain outside the photo.
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  }, []);

  return { videoRef, stream, isReady, isLoading, error, capture, stopCamera };
}
