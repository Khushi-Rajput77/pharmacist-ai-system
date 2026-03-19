import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const authModalRef = useRef(null);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form State
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPhoneNumber, setRegPhoneNumber] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regRole, setRegRole] = useState('patient');

  /**
   * Handle login with JWT token
   */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!loginEmail.trim() || !loginPassword.trim()) {
        setError('Email and password are required');
        setLoading(false);
        return;
      }

      // Call login API
      const response = await authAPI.login(loginEmail, loginPassword);
      
      if (response.data.success) {
        // Use handleLogin from AuthContext to store token and user data
        handleLogin(response.data);
        
        // Redirect based on role
        const userRole = response.data.data.role;
        if (userRole === 'admin' || userRole === 'pharmacist') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
        
        setShowAuthModal(false);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle registration with JWT token
   */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate all required fields
      if (!regFirstName.trim()) {
        setError('First name is required');
        setLoading(false);
        return;
      }
      if (!regLastName.trim()) {
        setError('Last name is required');
        setLoading(false);
        return;
      }
      if (!regEmail.trim()) {
        setError('Email is required');
        setLoading(false);
        return;
      }
      if (!regPassword.trim()) {
        setError('Password is required');
        setLoading(false);
        return;
      }
      if (regPassword !== regConfirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (regPassword.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Prepare registration data
      const registrationData = {
        firstName: regFirstName.trim(),
        lastName: regLastName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        phoneNumber: regPhoneNumber.trim(),
        address: regAddress.trim(),
        role: 'patient' // Always register as patient (admin created manually)
      };

      // Call register API
      const response = await authAPI.register(registrationData);
      
      if (response.data.success) {
        // Use handleLogin from AuthContext
        handleLogin(response.data);
        navigate('/dashboard');
        setShowAuthModal(false);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle CTA (Call-to-Action) button click - opens auth modal
   */
  const handleCTAClick = () => {
    setShowAuthModal(true);
    setAuthMode('register');
    setError('');
  };

  // Scroll modal to top when it opens
  useEffect(() => {
    if (showAuthModal && authModalRef.current) {
      // Use multiple methods to ensure scroll
      authModalRef.current.scrollTop = 0;
      requestAnimationFrame(() => {
        authModalRef.current.scrollTop = 0;
      });
    }
  }, [showAuthModal, authMode]);

  return (
    <div className="landing-page">
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div ref={authModalRef} className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAuthModal(false)}>×</button>
            
            <div className="auth-container">
              {/* Tab Selection */}
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                  onClick={() => {
                    setAuthMode('login');
                    setError('');
                  }}
                >
                  Login
                </button>
                <button
                  className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                  onClick={() => {
                    setAuthMode('register');
                    setError('');
                  }}
                >
                  Register
                </button>
              </div>

              {/* Error Message */}
              {error && <div className="auth-error">{error}</div>}

              {/* Login Form */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="auth-form">
                  <h2>Welcome Back 👋</h2>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              )}

              {/* Register Form */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="auth-form">
                  <h2>Create Account 🎉</h2>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        placeholder="John"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        placeholder="Doe"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={regPhoneNumber}
                      onChange={(e) => setRegPhoneNumber(e.target.value)}
                      placeholder="+91 9876543210"
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="Your delivery address"
                      rows="1"
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Register'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Meet Your AI Pharmacist</h1>
          <p>Never miss a medicine refill again</p>
          <button className="cta-button" onClick={handleCTAClick}>Get Started Free</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>💬 Chat with AI</h3>
            <p>Ask for medicines naturally. Our AI understands you.</p>
          </div>
          <div className="feature-card">
            <h3>✅ Smart Validation</h3>
            <p>Automatic prescription check, stock verification.</p>
          </div>
          <div className="feature-card">
            <h3>🔔 Proactive Alerts</h3>
            <p>Never run out. Get reminded before you need to.</p>
          </div>
          <div className="feature-card">
            <h3>📱 Voice Ordering</h3>
            <p>Just speak. No typing needed.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial">
            <p>"I never forget my diabetes medicine now!"</p>
            <p className="author">- Raj Kumar</p>
          </div>
          <div className="testimonial">
            <p>"The voice feature is a lifesaver for my elderly mom."</p>
            <p className="author">- Priya Singh</p>
          </div>
          <div className="testimonial">
            <p>"Most convenient pharmacy experience ever."</p>
            <p className="author">- Ahmed Hassan</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-items">
          <details>
            <summary>How does the prescription validation work?</summary>
            <p>We check our database for valid prescriptions. If a medicine requires a prescription and you don't have one, we'll ask you to upload it.</p>
          </details>
          <details>
            <summary>Is my data secure?</summary>
            <p>Yes! We use industry-standard encryption and comply with health data privacy regulations.</p>
          </details>
          <details>
            <summary>How long does delivery take?</summary>
            <p>Standard delivery is 2-3 days. Express delivery available in select areas.</p>
          </details>
          <details>
            <summary>What if medicine is out of stock?</summary>
            <p>We'll notify you immediately and suggest alternatives or set you a reminder for when it's back.</p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 AI Pharmacy System. All rights reserved.</p>
        <div className="footer-links">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;










