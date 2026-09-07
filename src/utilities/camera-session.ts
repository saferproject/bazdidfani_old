export const stopMediaStream = (stream: MediaStream | null) => {
  stream?.getTracks().forEach((track) => track.stop());
};

/** Serializes requests and releases streams that arrive after a close or switch. */
export function createCameraSession(
  getUserMedia: (constraints: MediaStreamConstraints) => Promise<MediaStream> =
    (constraints) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        return Promise.reject(new Error("CAMERA_UNSUPPORTED"));
      }
      return navigator.mediaDevices.getUserMedia(constraints);
    },
) {
  let generation = 0;
  let stream: MediaStream | null = null;
  let pending: Promise<void> = Promise.resolve();

  const stop = () => {
    generation += 1;
    stopMediaStream(stream);
    stream = null;
  };

  const start = (
    constraints: MediaStreamConstraints,
    onStream: (stream: MediaStream) => void,
    onError: (error: unknown) => void,
  ) => {
    stop();
    const requestGeneration = generation;
    pending = pending.then(async () => {
      if (requestGeneration !== generation) return;
      try {
        const nextStream = await getUserMedia(constraints);
        if (requestGeneration !== generation) {
          stopMediaStream(nextStream);
          return;
        }
        stream = nextStream;
        onStream(nextStream);
      } catch (error) {
        if (requestGeneration === generation) onError(error);
      }
    });
    return pending;
  };

  return { start, stop };
}

export function cameraErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message === "CAMERA_UNSUPPORTED") {
      return "این مرورگر قابلیت استفاده از دوربین دستگاه را ندارد.";
    }
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      return "دسترسی به دوربین برقرار نشد. لطفا مجوز دوربین را بررسی کنید.";
    }
    if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      return "دوربینی برای دریافت تصویر پیدا نشد.";
    }
  }
  return "مرورگر نمی‌تواند تصویر را از دوربین دریافت کند. لطفا دوباره امتحان کنید.";
}
