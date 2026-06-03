import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, LayoutGrid, Settings, ChevronRight, Wrench, HelpCircle } from 'lucide-react';
import TrustNotice from '../../components/common/TrustNotice';

export default function More() {
  return (
    <div className="grid">
      <section className="card">
        <h1 className="h1">More</h1>
        <p className="p">Quick access to information and settings.</p>
      </section>

      <section className="card">
        <div className="kicker" style={{ color: 'var(--text)' }}>Explore</div>
        <div className="link-list" style={{ marginTop: 12 }}>
          <MoreLink
            to="/"
            icon={<Home size={16} />}
            title="Home"
            description="Return to the overview and access all tools."
          />
          <MoreLink
            to="/tools"
            icon={<Wrench size={16} />}
            title="Analysis Tools"
            description="Quick access to all 4 specialized analyzers in one place."
          />
          <MoreLink
            to="/how-it-works"
            icon={<HelpCircle size={16} />}
            title="How It Works"
            description="Learn how Cyberstition analyzes content and detects scams."
          />
          <MoreLink
            to="/about"
            icon={<BookOpen size={16} />}
            title="About"
            description="Learn about Cyberstition and our mission."
          />
        </div>
      </section>

      <section className="card">
        <div className="kicker" style={{ color: 'var(--text)' }}>Manage</div>
        <div className="link-list" style={{ marginTop: 12 }}>
          <MoreLink
            to="/dashboard"
            icon={<LayoutGrid size={16} />}
            title="Dashboard"
            description="View and manage your saved reports and documents."
          />
          <MoreLink
            to="/account"
            icon={<Settings size={16} />}
            title="Preferences"
            description="Configure analysis settings and preferences."
          />
        </div>
      </section>

      <TrustNotice />
    </div>
  );
}

function MoreLink({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link to={to} className="link-card">
      <div className="link-content">
        <div className="link-icon">{icon}</div>
        <div className="link-meta">
          <div className="link-title">{title}</div>
          <div className="link-desc">{description}</div>
        </div>
      </div>
      <div className="link-actions">
        <ChevronRight size={16} />
      </div>
    </Link>
  );
}
