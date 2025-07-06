// ... existing imports ...

export function PricingDemo({ plans }: PricingDemoProps) {
  // ... existing state and handlers ...

  return (
    <div>
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={cn(
            "relative flex flex-col rounded-lg border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-lg h-full",
            plan.badge === "Popular" && "border-primary shadow-lg hover:shadow-xl",
            plan.badge === "Best Value" && "border-green-500 shadow-md hover:shadow-lg",
            plan.badge === "Premium" && "border-purple-500 shadow-md hover:shadow-lg",
            plan.badge === "Custom" && "border-orange-500 shadow-md hover:shadow-lg"
          )}
        >
          {plan.badge && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
              <Badge
                variant="secondary"
                className={cn(
                  "px-2 py-0.5 text-xs font-medium",
                  plan.badge === "Popular" && "bg-primary/10 text-primary",
                  plan.badge === "Best Value" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                  plan.badge === "Premium" && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                  plan.badge === "Custom" && "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                )}
              >
                {plan.badge}
              </Badge>
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                {plan.price === 0 ? "Free" : `$${plan.price}`}
              </span>
              {plan.price > 0 && (
                  <span className="ml-1 text-xs font-medium text-muted-foreground">/month</span>
              )}
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{plan.description}</p>

            <ul className="mt-3 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                  </div>
                  <p className="ml-2 text-xs text-muted-foreground">{feature}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3">
            <Button
              className={cn(
                "w-full text-xs py-1",
                plan.price === 0
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : plan.badge === "Popular"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : plan.badge === "Best Value"
                  ? "bg-green-600 text-white hover:bg-green-500"
                  : plan.badge === "Premium"
                  ? "bg-purple-600 text-white hover:bg-purple-500"
                  : plan.badge === "Custom"
                  ? "bg-orange-600 text-white hover:bg-orange-500"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading === plan.id}
            >
              {plan.price === 0 ? "Get Started" : "Subscribe Now"}
            </Button>
          </div>
        </motion.div>
      ))}
      </div>
  )
} 