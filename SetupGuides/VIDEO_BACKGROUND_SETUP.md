# Video Background Setup Guide

## Recommended Free Video Sources

1. **Coverr** (https://coverr.co)
   - Search: "technology", "repair", "electronics"
   - Format: MP4
   - Free for commercial use

2. **Pexels Videos** (https://www.pexels.com/videos)
   - Search: "tech repair", "electronics"
   - High quality, free

## Setup Steps

### Option 1: Use External URL
Replace the video src with a CDN URL:
```html
<source src="https://example.com/video.mp4" type="video/mp4" />
```

### Option 2: Local Video File
1. Download video (keep under 5MB for fast loading)
2. Place in `public/videos/hero-background.mp4`
3. Already configured in code

## Optimization

- **Size:** Keep under 5MB
- **Format:** MP4 (H.264)
- **Resolution:** 1920x1080 max
- **Duration:** 10-30 seconds loop
- **Attributes:**  
  - `autoPlay` - Starts automatically
  - `loop` - Continuous playback
  - `muted` - Required for autoplay
  - `playsInline` - Mobile compatibility

## Fallback
- Add `poster` attribute with static image
- Gradient background shows if video fails
