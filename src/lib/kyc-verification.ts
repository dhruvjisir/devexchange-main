import { supabase } from '@/lib/supabase';

interface KYCData {
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
  verification_status: 'pending' | 'verified' | 'rejected';
}

interface VerificationResult {
  is_valid: boolean;
  message?: string;
}

export const verifyKYCDocument = async (kycData: KYCData): Promise<VerificationResult> => {
  try {
    // Here you would typically integrate with a KYC verification service
    // For now, we'll simulate a verification process
    const isValid = true; // Simulated verification result
    const message = isValid ? 'Document verified successfully' : 'Document verification failed';

    return {
      is_valid: isValid,
      message
    };
  } catch (error) {
    console.error('Error verifying KYC document:', error);
    return {
      is_valid: false,
      message: 'Error during verification process'
    };
  }
};

export const updateKYCStatus = async (projectId: string, verificationResult: VerificationResult): Promise<void> => {
  try {
    // First, get the current project data
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('maker')
      .eq('id', projectId)
      .single();

    if (fetchError) throw fetchError;

    // Update the maker object with new KYC status
    const updatedMaker = {
      ...project.maker,
      kyc: {
        ...project.maker.kyc,
        verification_status: verificationResult.is_valid ? 'verified' : 'rejected',
        verification_message: verificationResult.message
      }
    };

    // Update the entire maker object
    const { error: updateError } = await supabase
      .from('projects')
      .update({ maker: updatedMaker })
      .eq('id', projectId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error updating KYC status:', error);
    throw error;
  }
}; 