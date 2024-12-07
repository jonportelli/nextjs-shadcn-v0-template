import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

interface BankTransferModalProps {
  isOpen: boolean
  onClose: () => void
  packageDetails: {
    name: string
    price: number
  }
}

export function BankTransferModal({ isOpen, onClose, packageDetails }: BankTransferModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    // Here you would typically send this information to your server
    // For now, we'll just simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast({
      title: "Transfer Confirmation Received",
      description: "We'll process your order once the transfer is verified.",
    })
    setIsSubmitting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bank Transfer Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <p className="text-sm font-medium">Bank Account Details:</p>
            <p className="text-sm">Bank Name: Your Bank</p>
            <p className="text-sm">Account Name: Your Company Name</p>
            <p className="text-sm">IBAN: XX00 0000 0000 0000 0000 0000</p>
            <p className="text-sm">BIC/SWIFT: XXXXXXXX</p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium">Transfer Amount:</p>
            <p className="text-sm">€{packageDetails.price} for {packageDetails.name} Package</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="Enter your email"
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Confirming...' : "I've Made the Transfer"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

