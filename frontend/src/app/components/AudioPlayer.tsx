"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/app/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/app/components/ui/slider"

interface AudioPlayerProps {
  file: File
}

export default function AudioPlayer({ file }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioUrl = useRef<string>("")
  const animationRef = useRef<number>(0)

  // Create audio element and URL when file changes
  useEffect(() => {
    if (file) {
      // Clean up previous URL if it exists
      if (audioUrl.current) {
        URL.revokeObjectURL(audioUrl.current)
      }

      // Create new URL and audio element
      audioUrl.current = URL.createObjectURL(file)

      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl.current)
      } else {
        audioRef.current.src = audioUrl.current
      }

      // Set up event listeners
      const audio = audioRef.current

      const handleLoadedMetadata = () => {
        setDuration(audio.duration)
      }

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
      }

      const handleEnded = () => {
        setIsPlaying(false)
        setCurrentTime(0)
        audio.currentTime = 0
      }

      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("ended", handleEnded)

      // Draw waveform
      drawWaveform()

      // Clean up
      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("ended", handleEnded)

        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }

        URL.revokeObjectURL(audioUrl.current)
      }
    }
  }, [file])

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  // Handle seeking
  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return

    const newTime = value[0]
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return

    const newVolume = value[0]
    audioRef.current.volume = newVolume
    setVolume(newVolume)

    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Draw waveform visualization
  const drawWaveform = async () => {
    if (!canvasRef.current || !file) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()

      // Create AudioContext
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Decode audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      // Get channel data
      const channelData = audioBuffer.getChannelData(0)

      // Draw waveform
      const step = Math.ceil(channelData.length / canvas.width)
      const amp = canvas.height / 2

      ctx.fillStyle = "#3b82f6" // Blue color

      for (let i = 0; i < canvas.width; i++) {
        let min = 1.0
        let max = -1.0

        for (let j = 0; j < step; j++) {
          const datum = channelData[i * step + j]
          if (datum < min) min = datum
          if (datum > max) max = datum
        }

        ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp))
      }
    } catch (error) {
      console.error("Error drawing waveform:", error)

      // Draw a placeholder waveform if there's an error
      ctx.fillStyle = "#3b82f6"
      const height = canvas.height

      for (let i = 0; i < canvas.width; i++) {
        const h = Math.sin(i * 0.05) * (height / 4) + height / 4
        ctx.fillRect(i, height / 2 - h / 2, 1, h)
      }
    }
  }

  return (
    <div className="p-4 bg-gray-700 rounded-lg">
      <div className="mb-2">
        <canvas ref={canvasRef} width={500} height={80} className="w-full h-20 bg-gray-800 rounded" />
      </div>

      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={togglePlay}
          className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <div className="text-xs text-gray-300 w-16">{formatTime(currentTime)}</div>

        <div className="flex-grow">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>

        <div className="text-xs text-gray-300 w-16 text-right">{formatTime(duration)}</div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="h-8 w-8 text-gray-300 hover:text-white"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>

        <div className="w-20">
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

