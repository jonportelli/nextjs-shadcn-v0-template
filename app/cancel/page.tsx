import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-xl mb-8">Your payment was cancelled. No charges were made.</p>
      <Link href={'/'}>
        <Button>Return to Pricing</Button>
      </Link>
    </div>
  )
}

