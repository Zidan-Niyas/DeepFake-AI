import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Headphones } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-100 flex items-center">
          <Headphones className="mr-2 text-blue-400" />
          <span>AudioDetect AI</span>
        </Link>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="#about">About</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#contact">Contact</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

