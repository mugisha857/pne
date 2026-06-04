// Run: node generate-hash.js
// Copy the output hash into database.sql or update it in MySQL directly

const bcrypt = require('bcrypt');

const password = 'Admin@1234'; // Change this to your desired password

bcrypt.hash(password, 10).then(hash => {
  console.log('\n✅ Bcrypt hash for password:', password);
  console.log('\nHash:\n' + hash);
  console.log('\nSQL to update admin password:');
  console.log(`UPDATE users SET Password='${hash}' WHERE UserName='admin';`);
});
