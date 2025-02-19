"use client"; // Ensure this runs only on the client side in Next.js App Router

import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react"
import Hls from "hls.js";

interface HLSPlayerProps {
  streamUrl: string;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ streamUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if(!document.fullscreenElement){
        containerRef.current.requestFullscreen().then(()=> setIsFullscreen(true));
      } else {
        document.exitFullscreen().then(()=> setIsFullscreen(false));
      }
    }
  }
  useEffect(() => {
    if (!videoRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);

      return () => {
        hls.destroy(); // Cleanup on unmount
      };
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // Fallback for Safari (native HLS support)
      videoRef.current.src = streamUrl;
    }

    const fullscreenChangeHandler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", fullscreenChangeHandler);
    return () => {
      document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
    }
  }, [streamUrl]);

  return <div ref={containerRef} className="relative w-full max-w-3xl mx-auto">
      {/* Video Element */}
      <video ref={videoRef} src="/sample.mp4" className="w-full" controls />

      {/* Persistent Overlay */}
      <div
        className={`absolute top-0 left-0 w-full h-full flex items-center justify-center ${
          isFullscreen ? "bg-black/30" : "bg-black/50"
        } transition-opacity`}
      >
        <Button className="text-white bg-red-500" onPress={toggleFullscreen}>
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
      </div>
    </div>;
};

export default HLSPlayer;
