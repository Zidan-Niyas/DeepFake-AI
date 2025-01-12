'use client'

import { useState } from 'react'
import Header from './components/Header'
import AudioUpload from './components/AudioUpload'
import ResultsDisplay from './components/ResultsDisplay'
import ProjectInfo from './components/ProjectInfo'
import Footer from './components/Footer'
import { AudioWaveformIcon as Waveform } from 'lucide-react'

export default function Home() {
  const [result, setResult] = useState<number | null>(null)
  const [isBonafide, setIsBonafide] = useState<boolean | null>(null)

  const handleResult = (prediction: number, isBonafide: boolean) => {
    setResult(prediction)
    setIsBonafide(isBonafide)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Waveform className="inline-block mb-4 text-blue-400" size={48} />
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Deepfake Audio Detection
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Harness the power of AI to detect manipulated audio with precision and ease.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <AudioUpload onResult={handleResult} />
            <ResultsDisplay result={result} isBonafide={isBonafide} />
          </div>
          <ProjectInfo />
        </div>
      </main>
      <Footer />
    </div>
  )
}

