"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

interface SafeVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
	src: string;
	className?: string;
	poster?: string;
	showCustomControls?: boolean;
}

const SafeVideo: React.FC<SafeVideoProps> = ({
	src,
	className = "",
	poster,
	showCustomControls = true,
	controls,
	...videoProps
}) => {
	const [isClient, setIsClient] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isRetrying, setIsRetrying] = useState(false);
	const [retryCount, setRetryCount] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [showControls, setShowControls] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();
	const retryTimeoutRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		setIsClient(true);
	}, []);

	// Cleanup timeouts on unmount
	useEffect(() => {
		return () => {
			if (hideControlsTimeoutRef.current) {
				clearTimeout(hideControlsTimeoutRef.current);
			}
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current);
			}
		};
	}, []);
	// Auto-retry logic for any video error
	const handleVideoError = useCallback(() => {
		if (retryCount < 5) {
			setIsRetrying(true);
			const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s, etc.

			retryTimeoutRef.current = setTimeout(() => {
				setRetryCount((prev) => prev + 1);
				setIsRetrying(false);
				setIsError(false);

				// Force reload the video
				if (videoRef.current) {
					const currentSrc = videoRef.current.src;
					videoRef.current.src = "";
					videoRef.current.src = currentSrc;
					videoRef.current.load();
				}
			}, delay);
		} else {
			setIsError(true);
			setIsRetrying(false);
		}
	}, [retryCount]);

	// Manual retry function
	const handleManualRetry = useCallback(() => {
		setIsError(false);
		setIsRetrying(true);
		setRetryCount(0);

		if (videoRef.current) {
			const currentSrc = videoRef.current.src;
			videoRef.current.src = "";
			videoRef.current.src = currentSrc;
			videoRef.current.load();
		}

		setTimeout(() => {
			setIsRetrying(false);
		}, 1000);
	}, []);

	// Handle fullscreen change events
	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () =>
			document.removeEventListener(
				"fullscreenchange",
				handleFullscreenChange
			);
	}, []);

	const handleTimeUpdate = () => {
		if (videoRef.current) {
			setCurrentTime(videoRef.current.currentTime);
		}
	};

	const handleLoadedMetadata = () => {
		if (videoRef.current) {
			setDuration(videoRef.current.duration);
		}
	};

	const handlePlay = () => setIsPlaying(true);
	const handlePause = () => setIsPlaying(false);

	const togglePlay = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
		}
	};

	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (videoRef.current && duration) {
			const rect = e.currentTarget.getBoundingClientRect();
			const clickPosition = (e.clientX - rect.left) / rect.width;
			const newTime = clickPosition * duration;
			videoRef.current.currentTime = newTime;
			setCurrentTime(newTime);
		}
	};

	const toggleFullscreen = async () => {
		if (!containerRef.current) return;

		try {
			if (!document.fullscreenElement) {
				await containerRef.current.requestFullscreen();
			} else {
				await document.exitFullscreen();
			}
		} catch (error) {
			console.error("Error toggling fullscreen:", error);
		}
	};

	const showControlsTemporarily = useCallback(() => {
		setShowControls(true);

		// Clear existing timeout
		if (hideControlsTimeoutRef.current) {
			clearTimeout(hideControlsTimeoutRef.current);
		}

		// Hide controls after 3 seconds
		hideControlsTimeoutRef.current = setTimeout(() => {
			setShowControls(false);
		}, 3000);
	}, []);

	const handleMouseMove = () => {
		if (showCustomControls && controls !== false) {
			showControlsTemporarily();
		}
	};

	const handleMouseLeave = () => {
		if (hideControlsTimeoutRef.current) {
			clearTimeout(hideControlsTimeoutRef.current);
		}
		setShowControls(false);
	};

	// Format time in MM:SS format
	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	// Calculate progress percentage
	const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

	if (!isClient) {
		return (
			<div
				className={`bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-sm text-gray-500 aspect-square ${className}`}
			>
				Loading...
			</div>
		);
	}

	if (isError || isRetrying) {
		return (
			<div
				className={`bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center text-sm text-gray-500 dark:text-gray-400 aspect-square p-4 ${className}`}
			>
				{isRetrying ? (
					<>
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mb-3"></div>
						<div className="text-center">
							<p>Retrying...</p>
							<p className="text-xs mt-1">
								Attempt {retryCount + 1}/5
							</p>
						</div>
					</>
				) : (
					<>
						<div className="text-center mb-4">
							<svg
								className="w-12 h-12 mx-auto mb-2 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
							<p className="font-medium">Video failed to load</p>
							{retryCount > 0 && (
								<p className="text-xs mt-1">
									Failed after {retryCount} retries
								</p>
							)}
						</div>
						<button
							onClick={handleManualRetry}
							className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors duration-200 flex items-center gap-2"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							Retry
						</button>
					</>
				)}
			</div>
		);
	}

	const shouldShowCustomControls = showCustomControls && controls !== false;
	const shouldShowPlaybackControls = controls !== false;

	return (
		<div
			ref={containerRef}
			className={`relative group ${className}`}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			<video
				ref={videoRef}
				className="w-full h-full"
				poster={poster}
				onError={handleVideoError}
				onTimeUpdate={handleTimeUpdate}
				onLoadedMetadata={handleLoadedMetadata}
				onPlay={handlePlay}
				onPause={handlePause}
				controls={!shouldShowCustomControls}
				{...videoProps}
			>
				<source src={src} type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			{/* Always Present Progress Bar */}
			{showCustomControls && (
				<div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
					{/* Minimal Progress Bar */}
					<div
						className="w-full h-1 bg-gray-300 dark:bg-gray-600 cursor-pointer hover:h-2 transition-all duration-200"
						onClick={handleProgressClick}
					>
						<div
							className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-100"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>
			)}

			{/* Conditional Controls Overlay - Only when controls are enabled */}
			{shouldShowCustomControls && shouldShowPlaybackControls && (
				<div
					className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
						showControls ? "opacity-100" : "opacity-0"
					}`}
				>
					{/* Play/Pause Button Overlay */}
					<div
						className="absolute inset-0 flex items-center justify-center pointer-events-auto cursor-pointer"
						onClick={togglePlay}
					>
						{!isPlaying && (
							<div className="bg-black bg-opacity-50 rounded-full p-4 transition-transform hover:scale-110">
								<svg
									className="w-8 h-8 text-white"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M8 5v10l8-5-8-5z" />
								</svg>
							</div>
						)}
					</div>

					{/* Bottom Controls Bar */}
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pb-6 pointer-events-auto">
						{/* Control Buttons Row */}
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								{/* Play/Pause Button */}
								<button
									onClick={togglePlay}
									className="text-white hover:text-gray-300 transition-colors"
								>
									{isPlaying ? (
										<svg
											className="w-6 h-6"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
										</svg>
									) : (
										<svg
											className="w-6 h-6"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M8 5v10l8-5-8-5z" />
										</svg>
									)}
								</button>

								{/* Time Display */}
								<div className="text-white text-sm font-mono">
									{formatTime(currentTime)} /{" "}
									{formatTime(duration)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Always Present Fullscreen Button */}
			{showCustomControls && (
				<div
					className={`absolute top-2 right-2 transition-opacity duration-300 ${
						showControls || !shouldShowPlaybackControls
							? "opacity-100"
							: "opacity-0 group-hover:opacity-100"
					}`}
				>
					<button
						onClick={toggleFullscreen}
						className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 pointer-events-auto"
						title={
							isFullscreen
								? "Exit fullscreen"
								: "Enter fullscreen"
						}
					>
						{isFullscreen ? (
							<svg
								className="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M3 3h5v2H5v3H3V3zm9 0h5v5h-2V5h-3V3zM3 12h2v3h3v2H3v-5zm14 0v5h-5v-2h3v-3h2z" />
							</svg>
						) : (
							<svg
								className="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M3 3v5h2V5h3V3H3zm9 0v2h3v3h2V3h-5zM5 12H3v5h5v-2H5v-3zm10 0v3h-3v2h5v-5h-2z" />
							</svg>
						)}
					</button>
				</div>
			)}
		</div>
	);
};

export default SafeVideo;
