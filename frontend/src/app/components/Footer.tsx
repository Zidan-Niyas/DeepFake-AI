import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold text-blue-400">AudioDetect AI</h3>
            <p className="mt-2">Detecting deepfake audio with cutting-edge AI</p>
          </div>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">Contact</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AudioDetect AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

