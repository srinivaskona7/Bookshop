import React, { useState, useEffect } from 'react';
import { authAPI, userAPI } from './services/api';
import './style.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      fetchUsers();
    }
  }, []);

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUsers();
      setUsers(response.users);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authAPI.login(signInData);
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      showMessage('Login successful!', 'success');
      await fetchUsers();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      showMessage('Passwords do not match!', 'error');
      return;
    }
    
    if (signUpData.password.length < 6) {
      showMessage('Password must be at least 6 characters!', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.register({
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password
      });
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      showMessage('Registration successful!', 'success');
      await fetchUsers();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setUsers([]);
    }
  };

  const handleUserUpdate = async (updatedUser) => {
    try {
      const response = await userAPI.updateUser(updatedUser.id, updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? response.user : u));
      if (user.id === updatedUser.id) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      showMessage('User updated successfully!', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Update failed', 'error');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="auth-container">
        <div className={`auth-card ${isSignUp ? 'sign-up-mode' : ''}`}>
          <div className="forms-wrap">
            <form onSubmit={handleLogin} className="sign-in-form">
              <div className="logo">
                <h2>Welcome Back</h2>
                <p>Sign in to your account</p>
              </div>
              
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signInData.email}
                  onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Signing In...' : 'SIGN IN'}
              </button>
              
              <p className="text">
                New here? 
                <span className="link" onClick={() => setIsSignUp(true)}> Create Account</span>
              </p>
            </form>

            <form onSubmit={handleRegister} className="sign-up-form">
              <div className="logo">
                <h2>Join Us</h2>
                <p>Create your account</p>
              </div>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
              </button>
              
              <p className="text">
                Already have an account? 
                <span className="link" onClick={() => setIsSignUp(false)}> Sign In</span>
              </p>
            </form>
          </div>

          <div className="carousel">
            <div className="images-wrapper">
              <div className="image img-1">
                <div className="overlay"></div>
              </div>
              <div className="image img-2">
                <div className="overlay"></div>
              </div>
            </div>
            
            <div className="text-slider">
              <div className="text-wrap">
                <div className="text-group">
                  <h2>Welcome Back!</h2>
                  <p>Access your dashboard and manage your profile</p>
                </div>
              </div>
              
              <div className="text-wrap">
                <div className="text-group">
                  <h2>Start Your Journey!</h2>
                  <p>Join our community and unlock amazing features</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <p>Welcome back, {user.name}!</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowAllUsers(true)} className="users-btn">
            <span>👥</span> All Users ({users.length})
          </button>
          <div className="profile-section" onClick={() => setShowProfile(true)}>
            <img src={user.avatar} alt={user.name} className="profile-pic" />
            <div className="profile-info">
              <span className="profile-name">{user.name}</span>
              <span className="profile-role">{user.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="welcome-card">
            <h2>Welcome Back!</h2>
            <p>Here's what's happening in your workspace today.</p>
            <div className="stats">
              <div className="stat-item">
                <h3>{users.length}</h3>
                <p>Total Users</p>
              </div>
              <div className="stat-item">
                <h3>{users.filter(u => u.status === 'Active').length}</h3>
                <p>Active Users</p>
              </div>
              <div className="stat-item">
                <h3>{new Set(users.map(u => u.department)).size}</h3>
                <p>Departments</p>
              </div>
            </div>
          </div>
          
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button onClick={() => setShowAllUsers(true)} className="action-card">
                <span>👥</span>
                <div>
                  <h4>View All Users</h4>
                  <p>Browse and manage users</p>
                </div>
              </button>
              <button onClick={() => setShowProfile(true)} className="action-card">
                <span>⚙️</span>
                <div>
                  <h4>My Profile</h4>
                  <p>Edit your profile</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      {showProfile && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>My Profile</h3>
              <button className="close-btn" onClick={() => setShowProfile(false)}>×</button>
            </div>
            <div className="profile-content">
              <div className="profile-avatar">
                <img src={user.avatar} alt={user.name} />
              </div>
              <div className="profile-form">
                <input type="text" placeholder="Name" defaultValue={user.name} />
                <input type="email" placeholder="Email" defaultValue={user.email} />
                <input type="text" placeholder="Role" defaultValue={user.role} />
                <button onClick={() => setShowProfile(false)}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Users Modal */}
      {showAllUsers && (
        <div className="modal-overlay" onClick={() => setShowAllUsers(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>All Users ({filteredUsers.length})</h3>
              <button className="close-btn" onClick={() => setShowAllUsers(false)}>×</button>
            </div>
            
            <div className="search-container">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="users-grid">
              {filteredUsers.map(user => (
                <div key={user.id} className="user-card" onClick={() => setSelectedUser(user)}>
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                  <div className="user-info">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    <div className="user-meta">
                      <span className="user-role">{user.role}</span>
                      <span className="user-department">{user.department}</span>
                    </div>
                  </div>
                  <div className="user-hover-overlay">
                    <span>Click to view details</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content user-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>
            </div>
            
            <div className="user-detail-content">
              <div className="user-detail-header">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="user-detail-avatar" />
                <div className="user-detail-info">
                  <h2>{selectedUser.name}</h2>
                  <p className="user-email">{selectedUser.email}</p>
                  <span className={`user-status ${selectedUser.status?.toLowerCase()}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
              
              <div className="user-detail-grid">
                <div className="detail-item">
                  <label>Role</label>
                  <span>{selectedUser.role}</span>
                </div>
                <div className="detail-item">
                  <label>Department</label>
                  <span>{selectedUser.department}</span>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <span>{selectedUser.phone}</span>
                </div>
                <div className="detail-item">
                  <label>Join Date</label>
                  <span>{new Date(selectedUser.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default App;
