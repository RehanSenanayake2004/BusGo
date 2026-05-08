import { useState, useEffect } from 'react';

// ============================================================
// CUSTOM IMAGE URL - Replace this with your own image URL!
// ============================================================
// To use your own image:
// 1. Upload your image to any image hosting service like:
//    - Imgur (imgur.com) - Upload and get direct link
//    - Cloudinary (cloudinary.com) - Upload and get URL
//    - Firebase Storage - Upload and get download URL
//    - GitHub - Upload to a repo and get raw URL
//    - Postimage (postimage.org) - Upload and get direct link
//    - FreeImageHost (freeimage.host) - Upload and get URL
//
// 2. Paste the direct image URL below (must end in .jpg, .png, etc.)
// ============================================================
const CUSTOM_IMAGE_URL = 'https://i.ibb.co/VY5tTKtP/photo-2026-05-08-23-23-41.jpg';
// Replace the line above with your image URL, for example:
// const CUSTOM_IMAGE_URL = 'https://i.imgur.com/YOUR_IMAGE_ID.jpg';
// ============================================================

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [exiting, setExiting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // 5 second timer for loading
    const timer = setTimeout(() => {
      setExiting(true);
      // After exit animation (0.5s), unmount
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(exitTimer);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`loading-screen ${exiting ? 'loading-screen__exit' : ''}`}>
      {/* Custom Image */}
      <img
        src={CUSTOM_IMAGE_URL}
        alt="BusGo"
        className="loading-screen__image"
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          // Fallback to Bus icon if image fails
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const fallback = document.createElement('div');
            fallback.className = 'loading-screen__image flex items-center justify-center bg-blue-700';
            fallback.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>';
            parent.insertBefore(fallback, target);
          }
        }}
      />

      {/* Loading Bar */}
      <div className="loading-bar-container">
        <div className="loading-bar" />
      </div>

      {/* Loading Text */}
      <p className="loading-text">
        {imageLoaded ? 'Loading BusGo...' : 'Loading image...'}
      </p>
    </div>
  );
}
