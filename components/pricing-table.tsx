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

interface Package {
  name: string
  price: number
  duration: number
  revisions: number
  deliveryDays: number
  description: string
}

const packages: Package[] = [
  {
    name: "Basic",
    price: 3593,
    duration: 60,
    revisions: 2,
    deliveryDays: 30,
    description: "A 60-sec video combined with animation, screen recordings, and/or stock footage.",
  },
  {
    name: "Standard",
    price: 3893,
    duration: 90,
    revisions: 3,
    deliveryDays: 45,
    description: "A 90-sec video combined with animation, screen recordings, and/or stock footage.",
  },
  {
    name: "Premium",
    price: 4292,
    duration: 120,
    revisions: 4,
    deliveryDays: 60,
    description: "A 120-sec video combined with animation, screen recordings, and/or stock footage.",
  },
]

export default function PricingTable() {
  const [selectedPackage, setSelectedPackage] = useState<Package>(packages[0])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const keepAlive = () => {
      fetch('/api/keep-alive').catch(console.error)
    }

    const interval = setInterval(keepAlive, 4 * 60 * 1000) // Every 4 minutes

    return () => clearInterval(interval)
  }, [])

  const onCheckout = async () => {
    setIsLoading(true)
    try {
      console.log('Starting checkout process')
      const result = await handleCheckout(selectedPackage)
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
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <div className="grid gap-6">
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card
                key={pkg.name}
                className={`relative ${
                  selectedPackage.name === pkg.name ? "border-primary" : ""
                }`}
              >
                <CardHeader>
                  <CardTitle>€{pkg.price}</CardTitle>
                  <CardDescription className="text-lg font-medium">{pkg.name}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="font-medium">{`${pkg.duration}-SEC PRODUCT VIDEO`}</div>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  <div className="grid gap-2">
                    {[
                      "Characters included",
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
                    <div className="flex justify-between">
                      <span>Running time</span>
                      <span>{pkg.duration} seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revisions</span>
                      <span>{pkg.revisions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Time</span>
                      <span>{pkg.deliveryDays} days</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={selectedPackage.name === pkg.name ? "default" : "outline"}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    {selectedPackage.name === pkg.name ? "Selected" : "Select"}
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
                  "Characters included",
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
              <div className="flex items-start gap-2 rounded-lg border p-4">
                <Flag className="h-5 w-5 text-primary" />
                <div className="grid gap-1">
                  <div className="font-medium">Milestone Payments available</div>
                  <div className="text-sm text-muted-foreground">
                    Pay per milestone starting with €{(selectedPackage.price / 5).toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" size="lg" onClick={onCheckout} disabled={isLoading}>
                {isLoading ? "Processing..." : "Continue to Checkout"}
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
    </div>
  )
}

