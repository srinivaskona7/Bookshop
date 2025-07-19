import { login, register } from '../api.js';

const authHTML = `
<div class="auth-container">
    <div class="auth-card">
        <div class="forms-wrap">
            <form id="sign-in-form" class="sign-in-form">
                <div class="logo"><h2>Welcome Back</h2><p>Sign in to your account</p></div>
                <div class="input-group"><input type="email" id="signin-email" placeholder="Email Address" required /></div>
                <div class="input-group"><input type="password" id="signin-password" placeholder="Password" required /></div>
                <button type="submit" class="btn">SIGN IN</button>
                <p class="text">New here? <span id="sign-up-link" class="link">Create Account</span></p>
            </form>
            <form id="sign-up-form" class="sign-up-form">
                <div class="logo"><h2>Join Us</h2><p>Create your account</p></div>
                <div class="input-group"><input type="text" id="signup-name" placeholder="Full Name" required /></div>
                <div class="input-group"><input type="email" id="signup-email" placeholder="Email Address" required /></div>
                <div class="input-group"><input type="password" id="signup-password" placeholder="Password" required /></div>
                <div class="input-group"><input type="password" id="signup-confirm-password" placeholder="Confirm Password" required /></div>
                <button type="submit" class="btn">CREATE ACCOUNT</button>
                <p class="text">Already have an account? <span id="sign-in-link" class="link">Sign In</span></p>
            </form>
        </div>
        <div class="carousel"><div class="images-wrapper"><div class="image img-1"><div class="overlay"></div></div><div class="image img-2"><div class="overlay"></div></div></div><div class="text-slider"><div class="text-wrap"><div class="text-group"><h2>Welcome Back!</h2><p>Access your dashboard and manage your profile</p></div></div><div class="text-wrap"><div class="text-group"><h2>Start Your Journey!</h2><p>Join our community and unlock amazing features</p></div></div></div></div>
    </div>
</div>
`;

export function renderAuth(element, showMessage, onLoginSuccess) {
  element.innerHTML = authHTML;

  const authCard = element.querySelector('.auth-card');
  const signInForm = element.querySelector('#sign-in-form');
  const signUpForm = element.querySelector('#sign-up-form');

  element.querySelector('#sign-up-link').addEventListener('click', () => authCard.classList.add('sign-up-mode'));
  element.querySelector('#sign-in-link').addEventListener('click', () => authCard.classList.remove('sign-up-mode'));

  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('#signin-email').value;
    const password = e.target.querySelector('#signin-password').value;
    try {
      const data = await login({ email, password });
      onLoginSuccess(data);
    } catch (error) {
      showMessage(error.response?.data?.message || 'Login failed', 'error');
    }
  });

  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.querySelector('#signup-name').value;
    const email = e.target.querySelector('#signup-email').value;
    const password = e.target.querySelector('#signup-password').value;
    const confirmPassword = e.target.querySelector('#signup-confirm-password').value;
    
    if (password !== confirmPassword) return showMessage('Passwords do not match!', 'error');
    if (password.length < 6) return showMessage('Password must be at least 6 characters!', 'error');

    try {
      const data = await register({ name, email, password });
      onLoginSuccess(data);
    } catch (error) {
      showMessage(error.response?.data?.message || 'Registration failed', 'error');
    }
  });
}