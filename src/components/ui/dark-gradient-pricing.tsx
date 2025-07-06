import { motion } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface PricingCardProps {
  tier: string
  price: string
  period: string
  description: string
  button?: ReactNode
}

export function PricingCard({ tier, price, period, description, button }: PricingCardProps) {
  const isPro = tier === "Pro"
  const isAnantam = tier === "Anantam"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { 
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
    >
      <Card
        className={cn(
          "relative overflow-hidden p-6 transition-all duration-500",
          isPro && "border-primary shadow-lg hover:shadow-xl",
          isAnantam && "border-primary/50 shadow-md hover:shadow-lg"
        )}
      >
        {isPro && (
          <motion.div 
            className="absolute -right-12 top-6 rotate-45 bg-primary px-12 py-1 text-xs font-medium text-primary-foreground"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: 0.4, 
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            Popular
          </motion.div>
        )}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.3, 
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <h3 className="text-2xl font-bold">{tier}</h3>
            <motion.div 
              className="mt-2 flex items-baseline gap-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.4, 
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <span className="text-4xl font-bold">{price}</span>
              <span className="text-muted-foreground">{period}</span>
            </motion.div>
            <motion.p 
              className="mt-2 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                delay: 0.5, 
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {description}
            </motion.p>
          </motion.div>
          {button}
        </div>
      </Card>
    </motion.div>
  )
} 