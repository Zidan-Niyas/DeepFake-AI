import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cpu, AudioWaveformIcon as Waveform, ShieldCheck } from 'lucide-react'

export default function ProjectInfo() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-100">About the Project</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-300">
          Our AI-ML based deepfake audio detection model uses advanced machine learning techniques to analyze audio files and determine the likelihood of them being artificially generated or manipulated.
        </p>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-100">How it works:</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <Waveform className="mr-2 h-6 w-6 text-blue-400 flex-shrink-0" />
              <span className="text-gray-300">Upload an audio file for analysis</span>
            </li>
            <li className="flex items-start">
              <Cpu className="mr-2 h-6 w-6 text-purple-400 flex-shrink-0" />
              <span className="text-gray-300">Our AI model processes the audio using advanced algorithms</span>
            </li>
            <li className="flex items-start">
              <ShieldCheck className="mr-2 h-6 w-6 text-green-400 flex-shrink-0" />
              <span className="text-gray-300">Get instant results on the probability of the audio being genuine or a deepfake</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

