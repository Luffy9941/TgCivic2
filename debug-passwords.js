// Quick utility to generate correct password hashes for debugging
const bcrypt = require("bcryptjs");

async function generateHashes() {
  console.log("Generating password hashes...");

  const adminPassword = "admin123";
  const citizenPassword = "citizen123";

  const adminHash = await bcrypt.hash(adminPassword, 12);
  const citizenHash = await bcrypt.hash(citizenPassword, 12);

  console.log('Admin password "admin123" hash:', adminHash);
  console.log('Citizen password "citizen123" hash:', citizenHash);

  // Verify the hashes work
  const adminVerify = await bcrypt.compare(adminPassword, adminHash);
  const citizenVerify = await bcrypt.compare(citizenPassword, citizenHash);

  console.log("Admin hash verification:", adminVerify);
  console.log("Citizen hash verification:", citizenVerify);

  // Test against existing hashes
  const existingAdminHash =
    "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewE4GKV6zrjKH.zK";
  const existingCitizenHash =
    "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

  const existingAdminVerify = await bcrypt.compare(
    adminPassword,
    existingAdminHash,
  );
  const existingCitizenVerify = await bcrypt.compare(
    citizenPassword,
    existingCitizenHash,
  );

  console.log("Existing admin hash verification:", existingAdminVerify);
  console.log("Existing citizen hash verification:", existingCitizenVerify);
}

generateHashes().catch(console.error);
