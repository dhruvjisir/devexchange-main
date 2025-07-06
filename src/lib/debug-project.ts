import { supabase } from './supabase';

export const debugProjectLoading = async (projectId: string) => {
  console.log('🔍 Debugging project loading for ID:', projectId);
  
  try {
    // Test basic connection
    console.log('1. Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Connection test failed:', testError);
      return { success: false, error: testError };
    }
    
    console.log('✅ Connection test passed');
    
    // Test project fetch
    console.log('2. Testing project fetch...');
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (projectError) {
      console.error('❌ Project fetch failed:', projectError);
      return { success: false, error: projectError };
    }
    
    if (!project) {
      console.error('❌ Project not found');
      return { success: false, error: 'Project not found' };
    }
    
    console.log('✅ Project fetch successful:', {
      id: project.id,
      title: project.title,
      hasMaker: !!project.maker,
      makerKeys: project.maker ? Object.keys(project.maker) : 'No maker data'
    });
    
    return { success: true, project };
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { success: false, error };
  }
};

export const listAllProjects = async () => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error listing projects:', error);
      return [];
    }
    
    console.log('📋 Available projects:', projects);
    return projects;
  } catch (error) {
    console.error('Error in listAllProjects:', error);
    return [];
  }
}; 