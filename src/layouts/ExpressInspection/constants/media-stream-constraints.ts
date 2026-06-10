const MEDIA_STREAM_CONSTRAINTS: MediaStreamConstraints = {
	video: {
		facingMode: "environment",
		width: { ideal: 1080 },
		height: { ideal: 1920 },
    aspectRatio: { ideal: 9 / 16 },
    frameRate: { ideal: 120, min: 30, max: 120 },
	},
};

export default MEDIA_STREAM_CONSTRAINTS;