import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { create } from 'zustand';

export type Project = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
  yearly_revenue: number | null;
  ttm_revenue: number | null;
  ttm_profit: number | null;
  last_month_revenue: number | null;
  last_month_profit: number | null;
  customer_count: string | null;
  arr: number | null;
  growth_rate: string | null;
  churn_rate: string | null;
  date_founded: string | null;
  team_size: number | null;
  business_models: string[];
  tech_stack: string[];
  competitors: string[];
  growth_opportunities: string[];
  key_assets: string[];
  selling_reason: string | null;
  financing: string | null;
  maker: {
    id: string;
    name: string;
    email: string;
    phone: string;
    kyc: {
      document_type: string;
      document_number: string;
      document_image: string | null;
      address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
      };
      verification_status: 'pending' | 'verified' | 'rejected';
      verification_date: string | null;
    };
  };
  is_new: boolean;
  is_verified: boolean;
};

// Fetch projects from Supabase
const getProjects = async (): Promise<Project[]> => {
  console.log('Fetching projects...');
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        maker:maker
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }

    console.log('Raw projects data:', data);
    
    // Transform and validate the data
    const validProjects = data?.map(project => ({
      id: project.id,
      created_at: project.created_at,
      updated_at: project.updated_at,
      title: project.title,
      description: project.description,
      price: project.price,
      category: project.category,
      image: project.image,
      is_new: project.is_new,
      is_verified: project.is_verified,
      maker: project.maker,
      tags: project.tags || [],
      yearly_revenue: project.yearly_revenue,
      ttm_revenue: project.ttm_revenue,
      ttm_profit: project.ttm_profit,
      last_month_revenue: project.last_month_revenue,
      last_month_profit: project.last_month_profit,
      customer_count: project.customer_count,
      arr: project.arr,
      growth_rate: project.growth_rate,
      churn_rate: project.churn_rate,
      date_founded: project.date_founded ? new Date(project.date_founded).toISOString() : null,
      team_size: typeof project.team_size === 'number' ? project.team_size : null,
      business_models: Array.isArray(project.business_models) ? project.business_models : [],
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack : [],
      competitors: Array.isArray(project.competitors) ? project.competitors : [],
      growth_opportunities: Array.isArray(project.growth_opportunities) ? project.growth_opportunities : [],
      key_assets: Array.isArray(project.key_assets) ? project.key_assets : [],
      selling_reason: project.selling_reason || null,
      financing: project.financing || null,
    })) || [];

    console.log('Valid projects:', validProjects);
    return validProjects;
  } catch (error) {
    console.error('Exception in getProjects:', error);
    throw error;
  }
};

// Add tag validation function
const validateTags = (tags: string[]): string[] => {
  return tags.filter(tag => {
    // Remove numbers
    if (/^\d+$/.test(tag)) {
      return false;
    }
    // Remove short tags
    if (tag.length < 2) {
      return false;
    }
    return true;
  });
};

// Add a new project to Supabase
const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to create a project');
  }

  const projectData = {
    ...project,
    maker: {
      id: user.id,
      name: user.user_metadata?.name || user.email,
      email: user.email,
      phone: project.maker?.phone || '',
      kyc: project.maker?.kyc || null
    },
    is_new: true,
    is_verified: false
  };

  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single();

  if (error) {
    console.error('Error adding project:', error);
    throw error;
  }

  return data;
};

// Get a single project by ID
export const getProject = async (id: string): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      maker:maker
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Project not found');
  }

  // Ensure all fields are present and properly typed
  const project: Project = {
    id: data.id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    title: data.title || '',
    description: data.description || '',
    price: data.price || 0,
    category: data.category || '',
    image: data.image || '',
    is_new: data.is_new || false,
    is_verified: data.is_verified || false,
    maker: data.maker || {
      id: '',
      name: '',
      email: '',
      phone: '',
      kyc: {
        document_type: '',
        document_number: '',
        document_image: null,
        address: {
          street: '',
          city: '',
          state: '',
          country: '',
          postal_code: ''
        },
        verification_status: 'pending',
        verification_date: null
      }
    },
    tags: Array.isArray(data.tags) ? data.tags : [],
    yearly_revenue: data.yearly_revenue || null,
    ttm_revenue: data.ttm_revenue || null,
    ttm_profit: data.ttm_profit || null,
    last_month_revenue: data.last_month_revenue || null,
    last_month_profit: data.last_month_profit || null,
    customer_count: data.customer_count || null,
    arr: data.arr || null,
    growth_rate: data.growth_rate || null,
    churn_rate: data.churn_rate || null,
    date_founded: data.date_founded ? new Date(data.date_founded).toISOString() : null,
    team_size: typeof data.team_size === 'number' ? data.team_size : null,
    business_models: Array.isArray(data.business_models) ? data.business_models : [],
    tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack : [],
    competitors: Array.isArray(data.competitors) ? data.competitors : [],
    growth_opportunities: Array.isArray(data.growth_opportunities) ? data.growth_opportunities : [],
    key_assets: Array.isArray(data.key_assets) ? data.key_assets : [],
    selling_reason: data.selling_reason || null,
    financing: data.financing || null,
  };

  return project;
};

// Delete a project
const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Update a project
const updateProject = async ({ id, project }: { id: string; project: Partial<Project> }): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select(`
      *,
      maker:maker
    `)
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  return data;
};

// React Query hooks
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    retry: 1,
    retryDelay: 1000,
    staleTime: 30000 // Consider data fresh for 30 seconds
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Project ID is required');
      }

      console.log('🔍 useProject: Fetching project with ID:', id);

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          maker:maker
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ useProject: Error fetching project:', error);
        throw error;
      }

      if (!data) {
        console.error('❌ useProject: Project not found for ID:', id);
        throw new Error('Project not found');
      }

      console.log('✅ useProject: Project fetched successfully:', {
        id: data.id,
        title: data.title,
        hasMaker: !!data.maker,
        makerInfo: data.maker ? {
          id: data.maker.id,
          name: data.maker.name,
          email: data.maker.email
        } : 'No maker data'
      });

      // Ensure all fields are present and properly typed
      const project: Project = {
        id: data.id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        title: data.title || '',
        description: data.description || '',
        price: data.price || 0,
        category: data.category || '',
        image: data.image || '',
        is_new: data.is_new || false,
        is_verified: data.is_verified || false,
        maker: data.maker || {
          id: '',
          name: '',
          email: '',
          phone: '',
          kyc: {
            document_type: '',
            document_number: '',
            document_image: null,
            address: {
              street: '',
              city: '',
              state: '',
              country: '',
              postal_code: ''
            },
            verification_status: 'pending',
            verification_date: null
          }
        },
        tags: Array.isArray(data.tags) ? data.tags : [],
        yearly_revenue: data.yearly_revenue || null,
        ttm_revenue: data.ttm_revenue || null,
        ttm_profit: data.ttm_profit || null,
        last_month_revenue: data.last_month_revenue || null,
        last_month_profit: data.last_month_profit || null,
        customer_count: data.customer_count || null,
        arr: data.arr || null,
        growth_rate: data.growth_rate || null,
        churn_rate: data.churn_rate || null,
        date_founded: data.date_founded ? new Date(data.date_founded).toISOString() : null,
        team_size: typeof data.team_size === 'number' ? data.team_size : null,
        business_models: Array.isArray(data.business_models) ? data.business_models : [],
        tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack : [],
        competitors: Array.isArray(data.competitors) ? data.competitors : [],
        growth_opportunities: Array.isArray(data.growth_opportunities) ? data.growth_opportunities : [],
        key_assets: Array.isArray(data.key_assets) ? data.key_assets : [],
        selling_reason: data.selling_reason || null,
        financing: data.financing || null,
      };

      return project;
    },
    enabled: !!id, // Only run the query if id is not empty
    retry: 1,
    retryDelay: 1000,
    staleTime: 30000
  });
};

export const useAddProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

interface ProjectsStore {
  data: Project[];
  isLoading: boolean;
  error: Error | null;
}

// Initialize store with empty data
export const useProjectsStore = create<ProjectsStore>(() => ({
  data: [],
  isLoading: false,
  error: null
})); 