import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";
const server = import.meta.env.SERVER_URL;
interface VoiceMessageRendererProps {
  fileUrl: string;
}

const VoiceMessageRenderer: React.FC<VoiceMessageRendererProps> = ({
  fileUrl,
}) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#3b82f6",
      progressColor: "#2563eb",
      cursorColor: "#2563eb",
      barWidth: 4,
      barRadius: 3,
      cursorWidth: 1,
      height: 30,
      normalize: true,
    });

    wavesurferRef.current.load(`${server}${fileUrl}`);

    wavesurferRef.current.on("ready", () => {
      setDuration(wavesurferRef.current?.getDuration() || 0);
    });

    wavesurferRef.current.on("audioprocess", () => {
      setCurrentTime(wavesurferRef.current?.getCurrentTime() || 0);
    });

    wavesurferRef.current.on("finish", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [fileUrl]);

  const togglePlay = () => {
    if (!wavesurferRef.current) return;

    wavesurferRef.current.playPause();
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="w-full max-w-2xl p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md flex items-center gap-4">
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
        aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1 flex flex-col gap-1">
        {/* Явно зададим ширину для контейнера волны */}
        <div ref={waveformRef} style={{ width: "100%" }} />

        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 font-mono px-1 select-none">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceMessageRenderer;
