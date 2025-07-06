import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { MainLayout } from '../components/layout/MainLayout'
import { useAuth } from '@/contexts/AuthContext'
import { SubscriptionStatus } from '../components/SubscriptionStatus'
import { motion } from 'framer-motion'
import { Calendar, Mail, User, Building } from 'lucide-react'
import { useProjects } from "@/store/projects";
import { Suspense } from "react";
import MyListings from "@/pages/MyListings";

export default function Profile() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const projectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projectId && projectRef.current) {
      // Scroll to the project after a short delay to ensure content is loaded
      setTimeout(() => {
        projectRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [projectId]);

  if (!user) {
    return (
      <MainLayout>
        <div className="container py-8">
          <p>Please sign in to view your profile.</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-4xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 sm:gap-6"
          >
            {/* Profile Header */}
            <div className="bg-card rounded-lg border p-4 sm:p-6 w-full">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-0">
                  <User className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-lg sm:text-2xl font-bold break-words">{user.user_metadata?.full_name || 'User'}</h1>
                  <p className="text-muted-foreground text-sm sm:text-base break-all">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="w-full">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Subscription Status</h2>
              <SubscriptionStatus />
            </div>

            {/* Account Information */}
            <div className="bg-card rounded-lg border p-4 sm:p-6 w-full">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Account Information</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-sm sm:text-base break-all">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium text-sm sm:text-base">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Building className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Account Type</p>
                    <p className="font-medium text-sm sm:text-base capitalize">
                      {user.user_metadata?.account_type || 'Individual'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Listings Section */}
            <div ref={projectRef} className="w-full">
              <Suspense fallback={<div>Loading listings...</div>}>
                <MyListings />
              </Suspense>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}