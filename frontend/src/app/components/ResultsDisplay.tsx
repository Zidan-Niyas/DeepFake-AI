import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Progress } from '@/app/components/ui/progress'
import { CheckCircle, XCircle } from 'lucide-react'

interface ResultsDisplayProps {
  result: number | null;
  isBonafide: boolean | null;
}

export default function ResultsDisplay({ result, isBonafide }: ResultsDisplayProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-100">Detection Results</CardTitle>
      </CardHeader>
      <CardContent>
        {result === null ? (
          <p className="text-gray-400">Upload an audio file to see the results.</p>
        ) : (
          <div className="space-y-4">
            <p className="text-lg text-gray-300">Likelihood of being genuine:</p>
            <Progress value={result} className="w-full h-3" />
            <p className="text-right text-2xl font-bold text-blue-400">{result.toFixed(2)}%</p>
            <div className="flex items-center justify-center p-4 bg-gray-700 rounded-lg">
              {isBonafide ? (
                <div className="flex items-center text-green-400">
                  <CheckCircle className="mr-2 h-6 w-6" />
                  <p className="text-lg font-semibold">This audio is likely genuine (bonafide).</p>
                </div>
              ) : (
                <div className="flex items-center text-red-400">
                  <XCircle className="mr-2 h-6 w-6" />
                  <p className="text-lg font-semibold">This audio is likely a deepfake (spoof).</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

