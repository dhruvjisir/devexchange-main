// Document validation patterns
export const documentPatterns = {
  passport: /^[A-Z0-9]{6,9}$/, // Most passports are 6-9 alphanumeric characters
  drivers_license: /^[A-Z0-9]{5,15}$/, // Driver's license numbers vary by country
  national_id: /^[A-Z0-9]{8,12}$/, // National ID numbers vary by country
};

// Document validation messages
export const documentMessages = {
  passport: "Passport number should be 6-9 alphanumeric characters",
  drivers_license: "Driver's license number should be 5-15 alphanumeric characters",
  national_id: "National ID number should be 8-12 alphanumeric characters",
};

// Validate document number based on type
export const validateDocumentNumber = (type: string, number: string): boolean => {
  const pattern = documentPatterns[type as keyof typeof documentPatterns];
  return pattern ? pattern.test(number) : false;
};

// Validate document image
export const validateDocumentImage = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!file) {
      resolve(false);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      resolve(false);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      resolve(false);
      return;
    }

    // Check image dimensions
    const img = new Image();
    img.onload = () => {
      // Minimum dimensions for clear document image
      const isValid = img.width >= 800 && img.height >= 600;
      resolve(isValid);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
}; 