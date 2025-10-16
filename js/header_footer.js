
// Load header
fetch("/html/include/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
  })
  .then(() => initPopup()) // run popup logic AFTER header loads
  .catch(err => console.error("Header load error:", err));

// Load footer
fetch("/html/include/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });

// Main popup logic
function initPopup() {
  const popup = document.getElementById('popupContainer');
  const profileBtn = document.getElementById('profileBtn');
  const closePopup = document.getElementById('closePopup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignup = document.getElementById('showSignup');
  const showLogin = document.getElementById('showLogin');
  const notSignedInBar = document.getElementById('not-signedin-progressbar');

  if (!popup || !loginForm || !signupForm) return;

  // Utility to show/hide
  const showElement = el => {
    el.style.display = 'flex';
    el.style.opacity = '1';
    el.style.transition = 'opacity 0.2s ease';
  };
  const hideElement = el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.2s ease';
    setTimeout(() => (el.style.display = 'none'), 200);
  };

  // Default state
  loginForm.style.display = 'flex';
  signupForm.style.display = 'none';

  // Open popup via Profile
  if (profileBtn) {
    profileBtn.addEventListener('click', e => {
      e.preventDefault();
      popup.style.display = 'flex';
      showElement(loginForm);
      signupForm.style.display = 'none';
    });
  }

  // Open popup via Progress Bar
  if (notSignedInBar) {
    notSignedInBar.style.cursor = 'pointer';
    notSignedInBar.addEventListener('click', () => {
      popup.style.display = 'flex';
      showElement(loginForm);
      signupForm.style.display = 'none';
    });
  }

  // Close popup
  if (closePopup) {
    closePopup.addEventListener('click', () => (popup.style.display = 'none'));
  }

  // Close when clicking outside
  window.addEventListener('click', e => {
    if (e.target === popup) popup.style.display = 'none';
  });

  // Toggle to Sign Up
  if (showSignup) {
    showSignup.addEventListener('click', e => {
      e.preventDefault();
      hideElement(loginForm);
      setTimeout(() => showElement(signupForm), 200);
    });
  }

  // Toggle back to Sign In
  if (showLogin) {
    showLogin.addEventListener('click', e => {
      e.preventDefault();
      hideElement(signupForm);
      setTimeout(() => showElement(loginForm), 200);
    });
  }

  // Prevent default form submission (demo only)
  [loginForm, signupForm].forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      alert(`${form.id === 'signupForm' ? 'Signed up!' : 'Signed in!'}`);
      popup.style.display = 'none';
    });
  });
}

