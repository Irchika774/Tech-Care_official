import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

/**
 * Video Hero Background Component
 * Displays a video background with fallback poster image
 * Optimized for performance and accessibility
 */
export default function VideoHeroBackground({
    videoUrl = '/videos/hero-background.mp4',
    posterUrl = '/images/hero-poster.jpg',
    opacity = 0.3,
    children
}) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        // Check if mobile device
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setIsPlaying(false);
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || isMobile) return;

        if (isPlaying) {
            video.play().catch(() => {
                console.warn('Video autoplay failed');
                setIsPlaying(false);
            });
        } else {
            video.pause();
        }
    }, [isPlaying, isMobile]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleError = () => {
        console.warn('Video failed to load, showing poster instead');
        setHasError(true);
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Video Background */}
            {!isMobile && !hasError ? (
                <>
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ opacity }}
                        loop
                        muted
                        playsInline
                        poster={posterUrl}
                        onError={handleError}
                    >
                        <source src={videoUrl} type="video/mp4" />
                        {/* Fallback for browsers that don't support video */}
                        <img src={posterUrl} alt="Hero background" className="w-full h-full object-cover" />
                    </video>

                    {/* Play/Pause Control */}
                    <button
                        onClick={togglePlay}
                        className="absolute bottom-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5" />
                        ) : (
                            <Play className="w-5 h-5" />
                        )}
                    </button>
                </>
            ) : (
                /* Fallback Poster Image for Mobile/Error */
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${posterUrl})`,
                        opacity,
                    }}
                />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-pink-900/80 z-10" />

            {/* Content */}
            <div className="relative z-20 h-full">
                {children}
            </div>
        </div>
    );
}
