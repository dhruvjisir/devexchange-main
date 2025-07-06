import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/store/projects';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { SubscriptionStatus } from '../components/SubscriptionStatus'

export function Dashboard() {
  const { user } = useAuth();
  const { data: projects = [], isLoading, refetch } = useProjects();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!user) return <div className="container py-8">Please sign in to view your listings.</div>;

  const myListings = projects.filter(p => p.maker?.id === user.id);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    // TODO: Replace with actual delete logic (API or Supabase call)
    // await deleteProject(id);
    // await refetch();
    setDeletingId(null);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid gap-6">
          <div className="col-span-1">
            <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
            <SubscriptionStatus />
          </div>
          
          {/* Stats Grid */}
          <div className="grid-layout sm:grid-cols-2 lg:grid-cols-4">
            <div className="card card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <h3 className="mt-2 text-2xl font-bold">12</h3>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="badge-primary">+2 this week</div>
              </div>
            </div>

            <div className="card card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Tasks</p>
                  <h3 className="mt-2 text-2xl font-bold">24</h3>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="badge-primary">+5 today</div>
              </div>
            </div>

            <div className="card card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Messages</p>
                  <h3 className="mt-2 text-2xl font-bold">8</h3>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="badge-primary">3 unread</div>
              </div>
            </div>

            <div className="card card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <h3 className="mt-2 text-2xl font-bold">6</h3>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="badge-primary">+1 this month</div>
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Projects</h2>
              <button className="btn-primary">New Project</button>
            </div>
            <div className="mt-4 grid-layout sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((project) => (
                <div key={project} className="card card-hover">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-lg bg-primary/10" />
                    <div className="badge-secondary">In Progress</div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium">Project {project}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((member) => (
                        <div
                          key={member}
                          className="h-8 w-8 rounded-full border-2 border-background bg-primary/10"
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">2 days ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <div className="mt-4 card">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((activity) => (
                  <div key={activity} className="flex items-start space-x-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">John Doe</span> completed task{' '}
                        <span className="font-medium">Design System</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <div className="badge-secondary">Completed</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h1 className="text-2xl font-bold mb-6">My Listings</h1>
            {isLoading ? (
              <div>Loading...</div>
            ) : myListings.length === 0 ? (
              <div>You have no listings yet.</div>
            ) : (
              <div className="grid gap-6">
                {myListings.map(listing => (
                  <div key={listing.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-lg">{listing.title}</div>
                      <div className="text-sm text-muted-foreground">{listing.description}</div>
                    </div>
                    <Button
                      variant="destructive"
                      disabled={deletingId === listing.id}
                      onClick={() => handleDelete(listing.id)}
                    >
                      {deletingId === listing.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 