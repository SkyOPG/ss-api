const readlineSync = require('readline-sync');
const axios = require('axios');
let accessToken;
function login() {
  const username = readlineSync.question('Enter your username: ');
  const password = readlineSync.question('Enter your password: ', {
    hideEchoBack: true, // Hide user input for passwords
  });

  axios.post('http://localhost:3000/login', { username, password })
    .then(response => {
      console.log(response.data); // Handle successful login
      // Store the accessToken for further requests (useful for subsequent authenticated requests)
      accessToken = response.data.accessToken; // Assuming the server returns an access token
      // Example: Use accessToken for subsequent requests
      // uploadPackage(accessToken);
      // retrievePackages(accessToken);
    })
    .catch(error => {
      console.error('Error:', error.response.data); // Handle login failure
    });
}

function signup() {
  const username = readlineSync.question('Enter your username: ');
  const password = readlineSync.question('Enter your password: ', {
    hideEchoBack: true, // Hide user input for passwords
  });

  axios.post('http://localhost:3000/signup', { username, password })
    .then(response => {
      console.log(response.data); // Handle successful signup
    })
    .catch(error => {
      console.error('Error:', error.response.data); // Handle signup failure
    });
}

function uploadPackage() {
  const filename = readlineSync.question('Enter the filename to upload: ');

  axios.post('http://localhost:3000/upload', { filename }, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include the user's access token obtained after login
    },
  })
    .then(response => {
      console.log(response.data); // Handle successful upload
    })
    .catch(error => {
      console.error('Error:', error.response.data); // Handle upload failure
    });
}

function retrievePackages() {
  axios.get('http://localhost:3000/packages', {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include the user's access token obtained after login
    },
  })
    .then(response => {
      console.log('Your SSX files:');
      console.log(response.data); // Display retrieved packages
    })
    .catch(error => {
      console.error('Error:', error.response.data); // Handle retrieval failure
    });
}

// Example menu structure
while (true) {
  console.log('1. Login');
  console.log('2. Signup');
  console.log('3. Upload Package');
  console.log('4. Retrieve Packages');
  console.log('5. Exit');
  
  const choice = readlineSync.question('Enter your choice: ');

  switch (choice) {
    case '1':
      login();
      break;
    case '2':
      signup();
      break;
    case '3':
      uploadPackage();
      break;
    case '4':
      retrievePackages();
      break;
    case '5':
      process.exit(0);
    default:
      console.log('Invalid choice');
  }
}
