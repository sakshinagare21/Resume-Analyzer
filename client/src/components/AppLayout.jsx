import { Link, NavLink, Outlet } from 'react-router-dom';

const navigation = [
  { to: '/', label: 'Overview', end: true },
  { to: '/history', label: 'History' },
  { to: '/help', label: 'Help' },
];

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="AI Resume Analyzer home">
            <span className="brand-mark" aria-hidden="true">R</span>
            <span className="brand-name">Resume<span>Review</span></span>
          </Link>

          <nav className="main-nav" aria-label="Main navigation">
            {navigation.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <Link className="button button-primary header-action" to="/upload">
            New analysis <span aria-hidden="true">+</span>
          </Link>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <span>ResumeReview</span>
          <span>Clear feedback for your next application.</span>
        </div>
      </footer>
    </div>
  );
}