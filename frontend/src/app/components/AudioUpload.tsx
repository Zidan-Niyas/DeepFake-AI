'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Upload, Loader2 } from 'lucide-react'

export default function AudioUpload({ onResult }: { onResult: (result: number, isBonafide: boolean) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      onResult(data.prediction * 100, data.is_bonafide)
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while processing the audio file.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-100">Upload Audio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="audio-file" className="text-gray-300">Select an audio file</Label>
            <Input 
              id="audio-file" 
              type="file" 
              accept="audio/*" 
              onChange={handleFileChange}
              className="bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button 
            type="submit" 
            disabled={!file || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Analyze Audio
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

