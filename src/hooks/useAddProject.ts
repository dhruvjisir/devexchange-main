import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { subscriptionService } from '@/services/subscription';

interface ProjectData {
  title: string;
  description: string;
  category: string;
  price: number;
  metrics: {
    mrr: number;
    arr: number;
    profit: number;
    expenses: number;
    customers: number;
    growth_rate: number;
  };
  company: {
    name: string;
    website: string;
    founded: string;
    employees: number;
    location: string;
  };
  kyc: {
    document_type: 'passport' | 'drivers_license' | 'national_id';
    document_number: string;
    document_image: string | null;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postal_code: string;
    };
  };
}

export const useAddProject = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const addProject = async (projectData: ProjectData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to list a project');
      }

      // Check if user can list project based on subscription
      const canList = await subscriptionService.canListProject(user.id, projectData.price);
      if (!canList) {
        throw new Error('Your current subscription does not allow listing projects at this price point');
      }

      // Create project
      const { data: project, error: createError } = await supabase
        .from('projects')
        .insert([
          {
            ...projectData,
            maker: {
              id: user.id,
              email: user.email,
              kyc: {
                ...projectData.kyc,
                verification_status: 'pending'
              }
            },
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (createError) throw createError;

      // Redirect to project page
      navigate(`/projects/${project.id}`);

      return project;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addProject,
    isLoading,
    error
  };
}; 