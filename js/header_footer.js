// --- Load Header ---
const headerContainer = document.getElementById("header");

function loadHeader() {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const headerFile = loggedIn 
    ? "/html/include/logged-in-header.html"
    : "/html/include/header.html";

  fetch(headerFile)
    .then(res => res.text())
    .then(data => {
      headerContainer.innerHTML = data;
    })
    .then(() => {
      if (!loggedIn) initPopup();  // only init popup for not signed-in users
      else initLogout();           // enable logout for signed-in users
    })
    .catch(err => console.error("Header load error:", err));
}

// --- Load Footer Once ---
fetch("/html/include/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });

// --- Initialize Logout Button ---
function initLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", e => {
    e.preventDefault();
    if (confirm("Log out?")) {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("loggedInUser");
      alert("You have been logged out.");
      loadHeader(); // reload normal header
    }
  });
}

// --- Initialize Popup Logic ---
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

  // Default to login form
  loginForm.style.display = 'flex';
  signupForm.style.display = 'none';

  // --- Open popup when clicking "Profile" ---
  function openPopup(e) {
    e.preventDefault();
    popup.style.display = 'flex';
    showElement(loginForm);
    signupForm.style.display = 'none';
  }
  if (profileBtn) profileBtn.addEventListener('click', openPopup);

  // --- Open popup via progress bar ---
  if (notSignedInBar) {
    notSignedInBar.style.cursor = 'pointer';
    notSignedInBar.addEventListener('click', () => {
      popup.style.display = 'flex';
      showElement(loginForm);
      signupForm.style.display = 'none';
    });
  }

  // --- Close popup ---
  if (closePopup) {
    closePopup.addEventListener('click', () => (popup.style.display = 'none'));
  }
  window.addEventListener('click', e => {
    if (e.target === popup) popup.style.display = 'none';
  });

  // --- Toggle between forms ---
  if (showSignup) {
    showSignup.addEventListener('click', e => {
      e.preventDefault();
      hideElement(loginForm);
      setTimeout(() => showElement(signupForm), 200);
    });
  }
  if (showLogin) {
    showLogin.addEventListener('click', e => {
      e.preventDefault();
      hideElement(signupForm);
      setTimeout(() => showElement(loginForm), 200);
    });
  }

  // --- Handle Sign Up ---
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = signupForm.querySelector('input[type="email"]').value.trim();
    const password = signupForm.querySelector('input[type="password"]').value.trim();
    const phone = signupForm.querySelector('input[type="tel"]').value.trim();

    if (!email || !password || !phone)
      return alert("Please fill out all fields.");

    // Get existing users or empty array
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check duplicates
    const emailExists = users.some(u => u.email === email);
    const phoneExists = users.some(u => u.phone === phone);

    if (emailExists) return alert("This email is already registered.");
    if (phoneExists) return alert("This phone number is already registered.");

    // Add new user
    users.push({ email, password, phone });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("loggedInUser", email);

    alert("Signup successful!");
    popup.style.display = "none";
    loadHeader(); // reload to show logged-in header
  });

  // --- Handle Login ---
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value.trim();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      alert("Login successful!");
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("loggedInUser", email);
      popup.style.display = "none";
      loadHeader(); // reload to show logged-in header
    } else {
      alert("Invalid email or password.");
    }
  });
}

// --- Start Everything ---
loadHeader();
