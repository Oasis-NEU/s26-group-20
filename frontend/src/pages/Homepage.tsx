import '../styles/Homepage.css'

function Homepage() {
  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">🏁 F1 Academy</div>
          <ul className="nav-menu">
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#get-started">Get Started</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to F1 Academy</h1>
          <p className="hero-subtitle">Your Complete Guide to Formula 1 for Beginners</p>
          <p className="hero-description">
            Confused by F1 jargon? Don't understand race strategy? We break down the world's fastest motorsport into digestible lessons, real statistics, and expert insights designed just for you.
          </p>
          <button className="cta-button">Start Learning Now</button>
        </div>
        <div className="hero-image">
          <div className="placeholder">🏎️</div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2>Our Mission</h2>
        <p>
          Formula 1 is one of the most thrilling sports in the world, but it can feel overwhelming for beginners. Unfamiliar terminology, complex strategies, and racing dynamics can make it hard to enjoy the spectacle. Our goal is to make F1 accessible, understandable, and exciting for everyone—whether you're watching your first race or just starting to get hooked on the sport.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h3>Beginner's Guide</h3>
            <p>Learn the fundamentals of F1, from basic rules to how seasons work</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Race Strategy 101</h3>
            <p>Understand pit stops, tire management, DRS, and tactical decision-making</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Statistics & Data</h3>
            <p>Explore data-driven insights that explain why teams and drivers win</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Driver Profiles</h3>
            <p>Get to know the current drivers, their strengths, and their stories</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>F1 Jargon Decoder</h3>
            <p>Demystify terminology and understand what commentators are talking about</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Odds & Favorites</h3>
            <p>See predictions, odds, and fan favorites for upcoming races</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>F1 History</h3>
            <p>Explore legendary moments, iconic drivers, and championship stories</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Quick Facts</h3>
            <p>Bite-sized trivia and fascinating facts about F1</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="get-started" className="cta-section">
        <h2>Ready to Become an F1 Fan?</h2>
        <p>Dive into our resources and start your F1 journey today</p>
        <div className="cta-buttons">
          <button className="btn-primary">Explore Guides</button>
          <button className="btn-secondary">Browse Drivers</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 F1 Academy. Making Formula 1 accessible for everyone.</p>
      </footer>
    </div>
  )
}

export default Homepage
