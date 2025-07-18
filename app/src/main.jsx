import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

// Mock user data with initial users
const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', password: 'password123', phone: '+1 (555) 123-4567', department: 'IT', joinDate: '2023-01-15', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face', password: 'password123', phone: '+1 (555) 234-5678', department: 'Marketing', joinDate: '2023-02-20', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', password: 'password123', phone: '+1 (555) 345-6789', department: 'Sales', joinDate: '2023-03-10', status: 'Active' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', password: 'password123', phone: '+1 (555) 456-7890', department: 'HR', joinDate: '2023-04-05', status: 'Active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', password: 'password123', phone: '+1 (555) 567-8901', department: 'IT', joinDate: '2023-05-12', status: 'Active' }
];

// Generate random avatar based on name
const generateAvatar = (name) => {
  const seed = name.split(' ').join('+');
  return `https://ui-avatars.com/api/?name=${seed}&size=150&background=random&color=fff&rounded=true`;
};

// User Detail Modal Component
const UserDetailModal = ({ user, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>User Details</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="user-detail-content">
          <div className="user-detail-header">
            <img src={user.avatar} alt={user.name} className="user-detail-avatar" />
            <div className="user-detail-info">
              <h2>{user.name}</h2>
              <p className="user-email">{user.email}</p>
              <span className={`user-status ${user.status.toLowerCase()}`}>{user.status}</span>
            </div>
          </div>
          
          <div className="user-detail-grid">
            <div className="detail-item">
              <label>Role</label>
              <span>{user.role}</span>
            </div>
            <div className="detail-item">
              <label>Department</label>
              <span>{user.department}</span>
            </div>
            <div className="detail-item">
              <label>Phone</label>
              <span>{user.phone}</span>
            </div>
            <div className="detail-item">
              <label>Join Date</label>
              <span>{new Date(user.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <label>User ID</label>
              <span>#{user.id}</span>
            </div>
            <div className="detail-item">
              <label>Account Status</label>
              <span className={`status-badge ${user.status.toLowerCase()}`}>
                {user.status}
              </span>
            </div>
          </div>
          
          <div className="user-actions">
            <button className="action-btn edit-btn">Edit User</button>
            <button className="action-btn message-btn">Send Message</button>
            <button className="action-btn danger-btn">Deactivate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login/Signup Component with Sliding Animation
const AuthPage = ({ onLogin, users, onSignup }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === signInData.email && u.password === signInData.password);
    if (user) {
      onLogin(user);
      showMessage('Login successful!', 'success');
    } else {
      showMessage('Invalid email or password!', 'error');
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    
    // Validation
    if (signUpData.password !== signUpData.confirmPassword) {
      showMessage('Passwords do not match!', 'error');
      return;
    }
    
    if (signUpData.password.length < 6) {
      showMessage('Password must be at least 6 characters!', 'error');
      return;
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === signUpData.email);
    if (existingUser) {
      showMessage('User already exists with this email!', 'error');
      return;
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      name: signUpData.name,
      email: signUpData.email,
      password: signUpData.password,
      role: 'User',
      avatar: generateAvatar(signUpData.name),
      phone: 'Not provided',
      department: 'General',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    onSignup(newUser);
    showMessage('Account created successfully!', 'success');
    
    // Reset form and switch to sign in
    setSignUpData({ name: '', email: '', password: '', confirmPassword: '' });
    setTimeout(() => setIsSignUp(false), 1500);
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${isSignUp ? 'sign-up-mode' : ''}`}>
        
        {/* Forms Container */}
        <div className="forms-wrap">
          
          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="sign-in-form">
            <div className="logo">
              <h2>Sign In</h2>
            </div>
            
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={signInData.email}
                onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={signInData.password}
                onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="btn">SIGN IN</button>
            
            <p className="text">
              Don't have an account? 
              <span className="link" onClick={() => setIsSignUp(true)}> Sign Up</span>
            </p>
          </form>

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="sign-up-form">
            <div className="logo">
              <h2>Sign Up</h2>
            </div>
            
            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                value={signUpData.name}
                onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                required
              />
            </div>
            
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={signUpData.confirmPassword}
                onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="btn">SIGN UP</button>
            
            <p className="text">
              Already have an account? 
              <span className="link" onClick={() => setIsSignUp(false)}> Sign In</span>
            </p>
          </form>
        </div>

        {/* Carousel */}
        <div className="carousel">
          <div className="images-wrapper">
            <img src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&h=600&fit=crop" alt="Welcome" className="image img-1" />
            <img src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=500&h=600&fit=crop" alt="Join Us" className="image img-2" />
          </div>
          
          <div className="text-slider">
            <div className="text-wrap">
              <div className="text-group">
                <h2>Welcome Back!</h2>
                <p>Sign in to access your personalized dashboard and manage your account.</p>
              </div>
            </div>
            
            <div className="text-wrap">
              <div className="text-group">
                <h2>Join Our Community!</h2>
                <p>Create an account to get started with our amazing features and connect with others.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Message Display */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

// Profile Modal Component
const ProfileModal = ({ user, onClose, onSave }) => {
  const [editUser, setEditUser] = useState({ ...user });
  const [message, setMessage] = useState('');

  const handleSave = () => {
    onSave(editUser);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Profile Details</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="profile-content">
          <div className="profile-avatar">
            <img src={editUser.avatar} alt={editUser.name} />
          </div>
          
          <div className="profile-form">
            <input
              type="text"
              placeholder="Name"
              value={editUser.name}
              onChange={(e) => setEditUser({...editUser, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              value={editUser.email}
              onChange={(e) => setEditUser({...editUser, email: e.target.value})}
            />
            <input
              type="text"
              placeholder="Role"
              value={editUser.role}
              onChange={(e) => setEditUser({...editUser, role: e.target.value})}
            />
            <button onClick={handleSave}>Save Changes</button>
            {message && <div className="success-message">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// All Users Component with Clickable User Details
const AllUsersModal = ({ users, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseUserDetail = () => {
    setSelectedUser(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>All Users ({filteredUsers.length})</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="users-grid">
          {filteredUsers.map(user => (
            <div key={user.id} className="user-card" onClick={() => handleUserClick(user)}>
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <div className="user-info">
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <span className="user-role">{user.role}</span>
              </div>
              <div className="user-hover-overlay">
                <span>Click to view details</span>
              </div>
            </div>
          ))}
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="no-results">
            <p>No users found matching your search.</p>
          </div>
        )}
      </div>
      
      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          onClose={handleCloseUserDetail} 
        />
      )}
    </div>
  );
};

// Main Dashboard Component
const Dashboard = ({ user, onLogout, users }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const handleProfileSave = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {currentUser.name}!</h1>
        <div className="header-actions">
          <button onClick={() => setShowAllUsers(true)} className="users-btn">
            All Users ({users.length})
          </button>
          <div className="profile-section" onClick={() => setShowProfile(true)}>
            <img src={currentUser.avatar} alt={currentUser.name} className="profile-pic" />
            <span>{currentUser.name}</span>
          </div>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>Dashboard</h2>
          <p>Welcome to your personal dashboard. You can manage your profile and view all users.</p>
          <div className="stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{users.length}</p>
            </div>
            <div className="stat-card">
              <h3>Your Role</h3>
              <p>{currentUser.role}</p>
            </div>
          </div>
        </div>
      </main>

      {showProfile && (
        <ProfileModal
          user={currentUser}
          onClose={() => setShowProfile(false)}
          onSave={handleProfileSave}
        />
      )}

      {showAllUsers && (
        <AllUsersModal
          users={users}
          onClose={() => setShowAllUsers(false)}
        />
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (newUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} users={users} />
      ) : (
        <AuthPage onLogin={handleLogin} users={users} onSignup={handleSignup} />
      )}
    </>
  );
};

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
