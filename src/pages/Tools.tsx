import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

const Tools = () => {
  const [valuationInputs, setValuationInputs] = useState({
    mrr: '',
    growthRate: '',
    churnRate: '',
    profitMargin: ''
  });
  const [valuation, setValuation] = useState<number | null>(null);

  const calculateValuation = () => {
    const mrr = parseFloat(valuationInputs.mrr);
    const growthRate = parseFloat(valuationInputs.growthRate) / 100;
    const churnRate = parseFloat(valuationInputs.churnRate) / 100;
    const profitMargin = parseFloat(valuationInputs.profitMargin) / 100;

    if (isNaN(mrr) || isNaN(growthRate) || isNaN(churnRate) || isNaN(profitMargin)) {
      return;
    }

    // Simple SaaS valuation formula
    // ARR * (Growth Rate / Churn Rate) * Profit Margin * 10
    const arr = mrr * 12;
    const calculatedValuation = arr * (growthRate / churnRate) * profitMargin * 10;
    setValuation(calculatedValuation);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValuationInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Free Tools</h1>
          <p className="text-lg text-muted-foreground">
            Helpful tools for entrepreneurs and developers
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">SaaS Valuation Calculator</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="mrr">Monthly Recurring Revenue (MRR)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="mrr"
                    name="mrr"
                    type="number"
                    placeholder="0"
                    value={valuationInputs.mrr}
                    onChange={handleInputChange}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="growthRate">Monthly Growth Rate (%)</Label>
                <div className="relative">
                  <Input
                    id="growthRate"
                    name="growthRate"
                    type="number"
                    placeholder="0"
                    value={valuationInputs.growthRate}
                    onChange={handleInputChange}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="churnRate">Monthly Churn Rate (%)</Label>
                <div className="relative">
                  <Input
                    id="churnRate"
                    name="churnRate"
                    type="number"
                    placeholder="0"
                    value={valuationInputs.churnRate}
                    onChange={handleInputChange}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
              <div>
                <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                <div className="relative">
                  <Input
                    id="profitMargin"
                    name="profitMargin"
                    type="number"
                    placeholder="0"
                    value={valuationInputs.profitMargin}
                    onChange={handleInputChange}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button 
              onClick={calculateValuation}
              className="w-full"
            >
              Calculate Valuation
            </Button>
          </div>
          {valuation !== null && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Estimated Business Value</p>
                <p className="text-3xl font-bold text-primary">
                  ${valuation.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          )}
          <div className="mt-6 text-sm text-muted-foreground">
            <p className="text-center">
              This is a simplified valuation estimate. For a more accurate assessment, 
              consider consulting with a business valuation expert.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools; 