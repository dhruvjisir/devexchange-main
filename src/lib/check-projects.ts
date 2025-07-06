import { supabase } from './supabase';

export const checkAllProjects = async () => {
  console.log('🔍 Checking all projects in database...');
  
  try {
    // Get all projects with basic info
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, title, created_at, updated_at, maker')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching projects:', error);
      return { success: false, error };
    }
    
    console.log(`✅ Found ${projects?.length || 0} projects:`);
    
    if (projects && projects.length > 0) {
      projects.forEach((project, index) => {
        console.log(`${index + 1}. ID: ${project.id}`);
        console.log(`   Title: ${project.title}`);
        console.log(`   Created: ${project.created_at}`);
        console.log(`   Maker: ${project.maker?.name || project.maker?.email || 'Unknown'}`);
        console.log('   ---');
      });
    } else {
      console.log('📝 No projects found in database');
    }
    
    return { success: true, projects };
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { success: false, error };
  }
};

export const findProjectById = async (projectId: string) => {
  console.log(`🔍 Looking for project: ${projectId}`);
  
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('❌ Project not found in database');
        return { success: false, error: 'Project not found' };
      }
      console.error('❌ Error fetching project:', error);
      return { success: false, error };
    }
    
    if (!project) {
      console.log('❌ Project not found');
      return { success: false, error: 'Project not found' };
    }
    
    console.log('✅ Project found:', {
      id: project.id,
      title: project.title,
      created_at: project.created_at,
      hasMaker: !!project.maker,
      makerInfo: project.maker ? {
        id: project.maker.id,
        name: project.maker.name,
        email: project.maker.email
      } : 'No maker data'
    });
    
    return { success: true, project };
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { success: false, error };
  }
};

export const checkDatabaseTables = async () => {
  console.log('🔍 Checking database tables...');
  
  try {
    // Check if projects table exists and has data
    const { data: projectsCount, error: projectsError } = await supabase
      .from('projects')
      .select('id', { count: 'exact', head: true });
    
    if (projectsError) {
      console.error('❌ Error checking projects table:', projectsError);
      return { success: false, error: projectsError };
    }
    
    console.log(`✅ Projects table exists with ${projectsCount} records`);
    
    // Check if we can access the table
    const { data: sampleProject, error: sampleError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (sampleError) {
      console.error('❌ Error accessing projects table:', sampleError);
      return { success: false, error: sampleError };
    }
    
    console.log('✅ Can access projects table successfully');
    
    return { success: true, projectsCount };
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { success: false, error };
  }
}; 