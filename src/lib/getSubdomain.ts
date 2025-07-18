export function getSubdomain(hostname: string) {
  // Remove port if present
  hostname = hostname.split(':')[0];
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0]; // e.g., 'dhruv' in 'dhruv.startupbazzar.com'
  }
  return null;
} 