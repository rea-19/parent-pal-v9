document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
});

// --- Load Header ---
function loadHeader() {
  fetch("/html/include/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
      initHeader();
    })
    .catch(err => console.error("Error loading header:", err));
}

// --- Initialize Header ---
function initHeader() {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const logoutBtn = document.getElementById("logoutBtn");
  const profileBtn = document.getElementById("profileBtn");

  if (loggedIn) {
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (profileBtn) profileBtn.href = "/html/profile_rewards.html";
    if (profileBtn) profileBtn.onclick = null; // remove any old click handlers
  } else {
    if (logoutBtn) logoutBtn.style.display = "none";
    if (profileBtn) {
      profileBtn.href = "#";
      profileBtn.style.cursor = "pointer";
      profileBtn.onclick = e => {
        e.preventDefault();
        const popup = document.getElementById("popupContainer");
        const loginForm = document.getElementById("loginForm");
        const signupForm = document.getElementById("signupForm");
        if (!popup || !loginForm || !signupForm) return;

        popup.style.display = "flex";
        loginForm.style.display = "flex";
        signupForm.style.display = "none";
      };
    }
    initPopup(); // Only for logged-out users
  }

  updateProgressBar();

  if (logoutBtn) {
    logoutBtn.addEventListener("click", e => {
      e.preventDefault();
      if (confirm("Log out?")) {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("loggedInUser");
        alert("Logged out!");
        loadHeader(); // Reload header after logout
      }
    });
  }
}


// --- Update Progress Bar ---
function updateProgressBar() {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const notSignedInBar = document.getElementById("not-signedin-progressbar");
  const signedInBar = document.getElementById("signedin-progressbar");

  if (!notSignedInBar || !signedInBar) return;

  if (loggedIn) {
    notSignedInBar.style.display = "none";
    signedInBar.style.display = "block";

    // Click redirects to profile page
    signedInBar.style.cursor = "pointer";
    signedInBar.onclick = () => {
      window.location.href = "/html/profile_rewards.html";
    };
  } else {
    signedInBar.style.display = "none";
    notSignedInBar.style.display = "block";

    // Click opens login/signup popup
    notSignedInBar.style.cursor = "pointer";
    notSignedInBar.onclick = () => {
      const popup = document.getElementById("popupContainer");
      const loginForm = document.getElementById("loginForm");
      const signupForm = document.getElementById("signupForm");
      if (!popup || !loginForm || !signupForm) return;

      popup.style.display = "flex";
      loginForm.style.display = "flex";
      signupForm.style.display = "none";
    };
  }
}

// --- Popup Logic (for logged-out users) ---
function initPopup() {
  const popup = document.getElementById('popupContainer');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const closePopup = document.getElementById('closePopup');
  const showSignup = document.getElementById('showSignup');
  const showLogin = document.getElementById('showLogin');

  if (!popup || !loginForm || !signupForm) return;

  loginForm.style.display = 'flex';
  signupForm.style.display = 'none';

  if (closePopup) closePopup.onclick = () => popup.style.display = 'none';
  window.onclick = e => { if (e.target === popup) popup.style.display = 'none'; };

  if (showSignup) showSignup.onclick = e => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
  };
  if (showLogin) showLogin.onclick = e => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'flex';
  };

  // --- Signup ---
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = signupForm.querySelector('input[type="email"]').value.trim();
    const password = signupForm.querySelector('input[type="password"]').value.trim();
    const phone = signupForm.querySelector('input[type="tel"]').value.trim();
    if (!email || !password || !phone) return alert("Please fill out all fields.");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some(u => u.email === email)) return alert("Email already registered.");
    if (users.some(u => u.phone === phone)) return alert("Phone number already registered.");

    users.push({ email, password, phone });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("loggedInUser", email);

    alert("Signup successful!");
    popup.style.display = "none";
    initHeader();
  });

  // --- Login ---
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value.trim();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("loggedInUser", email);
      alert("Login successful!");
      popup.style.display = "none";
      initHeader();
    } else alert("Invalid email or password.");
  });
}

// --- Load Footer ---
fetch("/html/include/footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data);
