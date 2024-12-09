'use client'

import { useState, useEffect } from "react"
import { Check, Flag, HelpCircle, Clock, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { handleCheckout } from "@/app/actions/checkout"
import { toast } from "@/components/ui/use-toast"
import { ContactFormModal } from "./contact-form-modal"
import { BankTransferModal } from "./bank-transfer-modal"
import Image from "next/image"

interface Package {
  name: string
  price: number
  duration: number
  revisions: number
  deliveryDays: number
  description: string
  thumbnail: string
}

const packages: Package[] = [
  {
    name: "Basic",
    price: 3593,
    duration: 60,
    revisions: 2,
    deliveryDays: 30,
    description: "A 15-sec logo sting combined with animation, sound fx, music sting and logo animation",
    thumbnail: "https://res.cloudinary.com/diex8siap/image/upload/v1733491474/Video-Sasshttps:/www.hubspot.com/hs-fs/hubfs/video.jpg"
  },
  {
    name: "Standard",
    price: 3893,
    duration: 90,
    revisions: 3,
    deliveryDays: 45,
    description: "A 90-sec video combined with animation, screen recordings, and/or stock footage.",
    thumbnail: "https://res.cloudinary.com/diex8siap/image/upload/v1733491641/Screenshot_2024-12-06_at_13.27.04_jvizfw.png"
  },
  {
    name: "Premium",
    price: 4292,
    duration: 120,
    revisions: 4,
    deliveryDays: 60,
    description: "A 120-sec video combined with animation, screen recordings, and/or stock footage.",
    thumbnail: "https://res.cloudinary.com/diex8siap/image/upload/v1733491658/Screenshot_2024-12-06_at_13.27.28_artxjn.png"
  },
]

export default function PricingTable() {
  const [selectedPackage, setSelectedPackage] = useState<Package>(packages[0])
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({})
  const [isBankTransferModalOpen, setIsBankTransferModalOpen] = useState(false)

  useEffect(() => {
    const keepAlive = () => {
      fetch('/api/keep-alive').catch(console.error)
    }

    const interval = setInterval(keepAlive, 4 * 60 * 1000) // Every 4 minutes

    return () => clearInterval(interval)
  }, [])

  const onCheckout = async (pkg: Package) => {
    setLoadingStates(prev => ({ ...prev, [pkg.name]: true }))
    try {
      console.log('Starting checkout process')
      const result = await handleCheckout(pkg)
      console.log('Checkout result:', result)
      if (result.success && result.url) {
        window.location.href = result.url
      } else {
        throw new Error(result.error || 'Checkout failed')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "There was a problem processing your checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingStates(prev => ({ ...prev, [pkg.name]: false }))
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-4xl font-bold text-center py-2 tracking-tight text-black">
        Promo Videos
      </h1>
      <div className="grid lg:grid-cols-[1fr_300px] gap-2">
        <div className="grid gap-0">
          <div className="grid md:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <Card
                key={pkg.name}
                className="relative flex flex-col"
              >
                <CardHeader className="flex">
                  <div className="relative w-full h-40">
                    <Image
                      src={pkg.thumbnail}
                      alt={`${pkg.name} package thumbnail`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                  <CardTitle>€{pkg.price}</CardTitle>
                  <CardDescription className="text-lg font-medium">{pkg.name}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="font-medium">{`${pkg.duration}-SEC PRODUCT VIDEO`}</div>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  <div className="grid gap-2">
                    {[
                      "Voice over recording",
                      "Storyboard",
                      "Script writing",
                      "Illustrated background included",
                      "Original design",
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-2 text-sm">
                    {/* <div className="flex justify-between">
                      <span>Running time</span>
                      <span>{pkg.duration} seconds</span>
                    </div> */}
                    <div className="flex justify-between">
                      <span>Revisions</span>
                      <span>{pkg.revisions}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span>Delivery Time</span>
                      <span>{pkg.deliveryDays} days</span>
                    </div> */}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => onCheckout(pkg)}
                    disabled={loadingStates[pkg.name]}
                  >
                    {loadingStates[pkg.name] ? "Processing..." : "Buy Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{`${selectedPackage.duration}-sec product video`}</div>
                  <div className="font-medium">€{selectedPackage.price}</div>
                </div>
                <p className="text-sm text-muted-foreground">{selectedPackage.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="rounded-full border p-1">
                    <Clock className="h-3 w-3" />
                  </div>
                  {`${selectedPackage.deliveryDays}-day delivery`}
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full border p-1">
                    <RefreshCw className="h-3 w-3" />
                  </div>
                  {`${selectedPackage.revisions} Revisions`}
                </div>
              </div>
              <div className="grid gap-2">
                {[
                  "Voice over recording",
                  "Storyboard",
                  "Script writing",
                  "Illustrated background included",
                  "Original design",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              {/* <div className="flex items-start gap-2 rounded-lg border p-4">
                <Flag className="h-5 w-5 text-primary" />
                <div className="grid gap-1">
                  <div className="font-medium">Milestone Payments available</div>
                  <div className="text-sm text-muted-foreground">
                    Pay per milestone starting with €{(selectedPackage.price / 5).toFixed(2)}
                  </div>
                </div>
              </div> */}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                className="w-full" 
                size="lg" 
                onClick={() => onCheckout(selectedPackage)} 
                disabled={loadingStates[selectedPackage.name]}
              >
                {loadingStates[selectedPackage.name] ? "Processing..." : "Buy Now"}
              </Button>
              <Button className="w-full" variant="outline" onClick={() => setIsBankTransferModalOpen(true)}>
                Pay Bank Transfer
              </Button>
              <ContactFormModal />
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <HelpCircle className="h-4 w-4" />
                Offers hourly rates
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <BankTransferModal
        isOpen={isBankTransferModalOpen}
        onClose={() => setIsBankTransferModalOpen(false)}
        packageDetails={selectedPackage}
      />
    </div>
  )
}

