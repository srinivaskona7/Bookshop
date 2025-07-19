import { getUsers, logout } from '../api.js';

const dashboardHTML = `
<div class="dashboard">
    <header class="dashboard-header">
        <div class="header-left"><h1>Dashboard</h1><p id="welcome-message"></p></div>
        <div class="header-actions">
            <button id="all-users-btn" class="users-btn"><span>👥</span> All Users (<span id="total-users-header">0</span>)</button>
            <div class="profile-section"><img id="profile-pic" src="" class="profile-pic" /><div class="profile-info"><span id="profile-name"></span><span id="profile-role"></span></div></div>
            <button id="logout-btn" class="logout-btn">Logout</button>
        </div>
    </header>
    <main class="dashboard-main">
        <div class="welcome-card"><h2>Welcome Back!</h2><p>Here's what's happening today.</p><div class="stats"><div class="stat-item"><h3 id="total-users-stat">0</h3><p>Total Users</p></div><div class="stat-item"><h3 id="active-users-stat">0</h3><p>Active Users</p></div><div class="stat-item"><h3 id="departments-stat">0</h3><p>Departments</p></div></div></div>
    </main>
</div>
<div id="all-users-modal" class="modal-overlay" style="display: none;"><div class="modal-content large-modal"><div class="modal-header"><h3>All Users</h3><button id="close-users-modal-btn" class="close-btn">×</button></div><div id="users-grid" class="users-grid"></div></div></div>
`;

const userCardTemplate = (user) => `
<div class="user-card">
    <img src="${user.avatar}" alt="${user.name}" class="user-avatar" />
    <div class="user-info"><h4>${user.name}</h4><p>${user.email}</p><div class="user-meta"><span class="user-role">${user.role}</span><span class="user-department">${user.department}</span></div></div>
</div>
`;

export async function renderDashboard(element, user, showMessage) {
  element.innerHTML = dashboardHTML;

  const updateUI = (currentUser, allUsers) => {
    element.querySelector('#welcome-message').textContent = `Welcome back, ${currentUser.name}!`;
    element.querySelector('#profile-pic').src = currentUser.avatar;
    element.querySelector('#profile-name').textContent = currentUser.name;
    element.querySelector('#profile-role').textContent = currentUser.role;
    element.querySelector('#total-users-header').textContent = allUsers.length;
    element.querySelector('#total-users-stat').textContent = allUsers.length;
    element.querySelector('#active-users-stat').textContent = allUsers.filter(u => u.status === 'Active').length;
    element.querySelector('#departments-stat').textContent = new Set(allUsers.map(u => u.department)).size;
    
    const usersGrid = element.querySelector('#users-grid');
    usersGrid.innerHTML = allUsers.map(userCardTemplate).join('');
  };

  element.querySelector('#logout-btn').addEventListener('click', async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed on server, logging out client-side.", err);
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('logout'));
  });

  const allUsersModal = element.querySelector('#all-users-modal');
  element.querySelector('#all-users-btn').addEventListener('click', () => allUsersModal.style.display = 'flex');
  element.querySelector('#close-users-modal-btn').addEventListener('click', () => allUsersModal.style.display = 'none');

  try {
    const { users } = await getUsers();
    updateUI(user, users);
  } catch (error) {
    showMessage('Could not load dashboard data.', 'error');
  }
}