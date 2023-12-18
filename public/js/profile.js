const updateProfileFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const email = document.querySelector('#email-update').value.trim();
  const alias = document.querySelector('#alias-update').value.trim();
  const password = document.querySelector('#password-update').value.trim();

  if (email && password) {
    // Send a PUT request to the API endpoint
    const response = await fetch('/api/users/', {
      method: 'PUT',
      body: JSON.stringify({ alias, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace('/login');
    } else {
      alert(response.statusText);
    }
  }
};

document.getElementById('updateprofile-form').addEventListener('submit', updateProfileFormHandler);

