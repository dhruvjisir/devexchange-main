import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { purchaseService, Purchase } from '@/lib/purchase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface PurchaseWithProject extends Purchase {
  project: {
    id: string;
    title: string;
    description: string;
  };
}

const Purchases = () => {
  const [purchases, setPurchases] = useState<PurchaseWithProject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await purchaseService.getUserPurchases();
        setPurchases(data as PurchaseWithProject[]);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load purchases',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [toast]);

  if (loading) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Loading purchases...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Purchases</h1>

      {purchases.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">You haven't made any purchases yet.</p>
          <Button onClick={() => navigate('/explore')}>
            Browse Projects
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {purchase.project.title}
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    {purchase.project.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Purchased on {format(new Date(purchase.created_at), 'PPP')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary mb-2">
                    ${purchase.amount.toLocaleString()}
                  </p>
                  <Badge
                    variant={
                      purchase.status === 'completed'
                        ? 'default'
                        : purchase.status === 'pending'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => navigate(`/project/${purchase.project_id}`)}
              >
                View Project
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/project/${purchase.project_id}/messages`)}
              >
                Message Seller
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Purchases; 