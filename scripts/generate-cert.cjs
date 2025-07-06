const fs = require('fs');
const path = require('path');
const mkcert = require('mkcert');

// Create .cert directory if it doesn't exist
const certDir = path.join(__dirname, '..', '.cert');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

async function generateCertificates() {
  try {
    // Create a certificate authority
    const ca = await mkcert.createCA({
      organization: 'DevExchange Development CA',
      countryCode: 'US',
      state: 'State',
      locality: 'City',
      validityDays: 365
    });

    // Create the certificate
    const cert = await mkcert.createCert({
      domains: ['localhost', '127.0.0.1'],
      validityDays: 365,
      caKey: ca.key,
      caCert: ca.cert
    });

    // Write the certificates to files
    fs.writeFileSync(path.join(certDir, 'key.pem'), cert.key);
    fs.writeFileSync(path.join(certDir, 'cert.pem'), cert.cert);

    console.log('SSL certificates generated successfully!');
  } catch (error) {
    console.error('Error generating SSL certificates:', error);
    process.exit(1);
  }
}

generateCertificates(); 