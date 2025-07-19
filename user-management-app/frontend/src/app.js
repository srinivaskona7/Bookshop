import { renderAuth } from './components/auth.js';
import { renderDashboard } from './components/dashboard.js';

const appElement = document.getElementById('app');
const messageContainer = document.getElementById('message-container');

function showMessage(message, type = 'success') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  messageContainer.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 3000);
}

function handleLoginSuccess(data) {
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  router(); // Re-route to the dashboard
  showMessage('Login successful!', 'success');
}

function router() {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user'));

  appElement.innerHTML = ''; // Clear the app container

  if (token && user) {
    renderDashboard(appElement, user, showMessage);
  } else {
    renderAuth(appElement, showMessage, handleLoginSuccess);
  }
}

// Listen for custom events to re-route
window.addEventListener('logout', router);
window.addEventListener('unauthorized', router);

// Initial call to set up the correct view on page load
document.addEventListener('DOMContentLoaded', router);