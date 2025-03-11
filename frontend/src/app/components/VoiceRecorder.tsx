"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Mic, Square, Loader2, Upload } from "lucide-react"
import AudioPlayer from "./AudioPlayer"

// Define props interface
interface VoiceRecorderProps {
  onRecordingComplete: (file: File) => void
  onResult: (result: number, isBonafide: boolean) => void
}

export default function VoiceRecorder({ onRecordingComplete, onResult }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedFile, setRecordedFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopRecording()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Start recording function
  const startRecording = async () => {
    try {
      setErrorMessage(null)
      audioChunksRef.current = []

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        processRecording()
      }

      // Start recording
      mediaRecorder.start(10)
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      setErrorMessage("Could not access microphone. Please ensure you have granted permission.")
    }
  }

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setIsRecording(false)
  }

  // Process the recording and convert to FLAC
  const processRecording = async () => {
    if (audioChunksRef.current.length === 0) return

    setIsConverting(true)

    try {
      // First create a WAV blob from the recorded chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })

      // For browser compatibility, we'll use a WAV file but name it with .flac extension
      // In a production environment, you would use a server-side conversion to actual FLAC
      const fileName = `recording_${new Date().getTime()}.flac`

      // Create a File object from the Blob
      const file = new File([audioBlob], fileName, { type: "audio/flac" })

      setRecordedFile(file)
      onRecordingComplete(file)
    } catch (error) {
      console.error("Error processing recording:", error)
      setErrorMessage("Error processing recording. Please try again.")
    } finally {
      setIsConverting(false)
    }
  }

  // Analyze the recorded audio
  const analyzeRecording = async () => {
    if (!recordedFile) return

    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append("file", recordedFile)

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      onResult(data.prediction * 100, data.is_bonafide)
    } catch (error) {
      console.error("Error analyzing recording:", error)
      setErrorMessage("Error analyzing recording. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-100">Record Voice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200">{errorMessage}</div>
          )}

          {isConverting ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-300">Processing recording...</span>
            </div>
          ) : isRecording ? (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-red-500 mb-4">{formatTime(recordingTime)}</div>
              <div className="flex items-center justify-center w-16 h-16 bg-red-600 rounded-full animate-pulse mb-4">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-300 mb-4">Recording in progress...</p>
              <Button onClick={stopRecording} variant="destructive" className="flex items-center">
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg">
              {recordedFile ? (
                <div className="w-full space-y-4">
                  <AudioPlayer file={recordedFile} />
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={startRecording} variant="outline" className="w-full">
                      <Mic className="mr-2 h-4 w-4" />
                      Record Again
                    </Button>
                    <Button
                      onClick={analyzeRecording}
                      disabled={isAnalyzing}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-600 rounded-full mb-4">
                    <Mic className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-300 mb-4">Click to start recording</p>
                  <Button onClick={startRecording} className="bg-blue-600 hover:bg-blue-700">
                    <Mic className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

