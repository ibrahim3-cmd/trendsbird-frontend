import { Check, Crown, Eye } from "lucide-react"
import { Card, CardContent, CardHeader } from "./card"
import { Button } from "./button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog"
import { useState } from "react"

interface PlanCardProps {
  name: string
  description: string
  durationUnit: string
  durationValue: number
  price: number
  features: string[]
  showPremium?: boolean
  buttonText?: string
  systemColor?: boolean
  isCurrentPlan?: boolean
  onSelect?: () => void
}

const PlanCard = ({
  name,
  description,
  durationUnit,
  durationValue,
  price,
  features,
  showPremium = false,
  buttonText = "Select Plan",
  systemColor = false,
  isCurrentPlan = false,
  onSelect
}: PlanCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const maxVisibleFeatures = 6
  const visibleFeatures = features.slice(0, maxVisibleFeatures)
  const hasMoreFeatures = features.length > maxVisibleFeatures

  // Define color classes based on systemColor prop
  const gradientBg = systemColor
    ? "absolute -inset-1 bg-gradient-to-r from-system-primary via-system-secondary to-system-primary rounded-lg opacity-25 blur-lg animate-pulse"
    : "absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-lg blur opacity-25 animate-pulse"

  const premiumBadgeClasses = systemColor
    ? "bg-system-secondary text-system-secondary-text px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1"
    : "bg-secondary text-secondary-text px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1"

  const priceBgClasses = systemColor
    ? "text-center p-4 bg-system-primary/5 rounded-lg flex-shrink-0"
    : "text-center p-4 bg-primary/5 rounded-lg flex-shrink-0"

  const priceTextClasses = systemColor ? "text-4xl font-bold text-system-primary" : "text-4xl font-bold text-primary"

  const featureBgClasses = systemColor
    ? "w-5 h-5 rounded-full bg-system-primary flex items-center justify-center"
    : "w-5 h-5 rounded-full bg-primary flex items-center justify-center"

  const featureTextClasses = systemColor ? "w-3 h-3 text-system-primary-text" : "w-3 h-3 text-primary-text"

  const buttonClasses = systemColor
    ? "w-full bg-system-primary hover:bg-system-primary/90 text-system-primary-text shadow-lg"
    : "w-full bg-primary hover:bg-primary/90 text-primary-text shadow-lg"

  const crownColorClasses = systemColor ? "w-5 h-5 text-system-secondary" : "w-5 h-5 text-secondary"

  // Determine button text and styling based on current plan status
  const currentButtonText = isCurrentPlan ? "✓ Current Plan" : buttonText
  const currentButtonClasses = isCurrentPlan
    ? "w-full bg-primary hover:bg-primary/90 text-primary-text shadow-lg cursor-default border-0 font-semibold"
    : buttonClasses

  return (
    <div className="w-full max-w-sm mx-auto relative">
      <div className={gradientBg}></div>
      <Card className="relative bg-card border-0 shadow-xl min-h-[540px] flex flex-col">
        <CardHeader className="text-center pb-4 relative flex-shrink-0">
          {showPremium && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className={premiumBadgeClasses}>
                <Crown className="w-3 h-3" />
                <span>Premium</span>
              </div>
            </div>
          )}
          {
            isCurrentPlan && (
              <div className="absolute top-[-12px] right-3 z-20">
                <div className="bg-primary text-primary-text px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <div className="w-2 h-2 bg-primary-text rounded-full animate-pulse"></div>
                  ACTIVE
                </div>
              </div>
            )
          }
          <div className={showPremium ? "mt-4" : "mt-0"}>
            <h3 className="text-2xl font-bold text-card-foreground">{name}</h3>
            <p className="text-muted-foreground text-sm mt-2">{description}</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 space-y-4">
          <div className={priceBgClasses}>
            <div className={priceTextClasses}>${price}</div>
            <div className="text-muted-foreground text-sm">
              per {durationValue} {durationUnit.toLowerCase()}s
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-hidden">
            {visibleFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={featureBgClasses}>
                  <Check className={featureTextClasses} />
                </div>
                <span className="text-card-foreground text-sm">{feature}</span>
              </div>
            ))}

            {hasMoreFeatures && (
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 underline cursor-pointer text-xs font-medium transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View all {features.length} features</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {showPremium && <Crown className={crownColorClasses} />}
                      {name} - Complete Features
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 mt-4">
                    <div className={priceBgClasses}>
                      <div className={priceTextClasses}>${price}</div>
                      <div className="text-muted-foreground text-sm">
                        per {durationValue} {durationUnit.toLowerCase()}s
                      </div>
                      <p className="text-muted-foreground text-sm mt-2">{description}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-card-foreground">All Features:</h4>
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={featureBgClasses}>
                            <Check className={featureTextClasses} />
                          </div>
                          <span className="text-card-foreground text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={currentButtonClasses}
                      onClick={() => {
                        if (!isCurrentPlan) {
                          onSelect?.()
                          setIsModalOpen(false)
                        }
                      }}
                      disabled={isCurrentPlan}
                    >
                      {currentButtonText}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="flex-shrink-0 mt-auto">
            <Button
              className={currentButtonClasses}
              onClick={isCurrentPlan ? undefined : onSelect}
              disabled={isCurrentPlan}
            >
              {currentButtonText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PlanCard