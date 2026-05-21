import Link from "next/link";
import { API_BASE_URL } from "../../utils/api";

type RangerTeam = {
  id: string;
  name?: string;
  addresses?: string[];
  email?: string;
  host?: string;
  location?: string;
  logoUrl?: string;
  phone?: string;
  published?: boolean;
  region?: string;
  websites?: string[];
};

async function getRangerTeam(id: string): Promise<RangerTeam | null> {
  const res = await fetch(`${API_BASE_URL}/ranger-teams/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const result = await res.json();
  return result.data;
}

export default async function RangerTeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getRangerTeam(id);

  if (!team) {
    return <p>Ranger team not found.</p>;
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <div className="site-brand">
            <div>
              <div className="brand-title">Junior Ranger Academy Placement Platform</div>
              <div className="brand-subtitle">Public information portal</div>
            </div>
          </div>

          <nav className="main-nav">
            <Link href="/">Home</Link>
            <Link href="/opportunities">Job Opportunities</Link>
            <Link href="/events">Events</Link>
          </nav>
        </div>
      </header>

      <div className="section-line" />

      <main>
        <section className="page-intro">
          <div className="container">
            <section className="detail-layout">
              <div className="detail-main">
        

                <h1 className="detail-title">{team.name || "Unnamed Ranger Team"}</h1>

                <p className="detail-subtitle">
                  {[team.host, team.location, team.region].filter(Boolean).join(" • ")}
                </p>

                <div className="detail-section">
                  <h2>Ranger group overview</h2>
                  <p>
                    {team.name || "This ranger team"} supports land, sea, cultural,
                    and environmental management activities across Queensland.
                  </p>
                </div>

                <div className="detail-section">
                  <h2>Details</h2>

                  <div className="detail-grid">
                    <div className="detail-item">
                      <div className="detail-label">Ranger Team</div>
                      <div className="detail-value">{team.name || "Not specified"}</div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Host Organisation</div>
                      <div className="detail-value">{team.host || "Not specified"}</div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Location</div>
                      <div className="detail-value">{team.location || "Not specified"}</div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Region</div>
                      <div className="detail-value">{team.region || "Not specified"}</div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Address</div>
                      <div className="detail-value">
                        {team.addresses && team.addresses.length > 0
                          ? team.addresses.join(", ")
                          : "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h2>Ranger work areas</h2>
                  <p>
                    This ranger team may support biodiversity protection, cultural site
                    management, invasive species monitoring, community education, and
                    Junior Ranger engagement activities.
                  </p>
                </div>

                <div className="apply-section">
                  <Link href="/" className="apply-button">
                    Back to map
                  </Link>
                </div>
              </div>

              <aside className="detail-side">
                <div className="panel-box">
                  <h3>Contact</h3>

                  <p>
                    <strong>Host:</strong>
                    <br />
                    {team.host || "Not specified"}
                  </p>

                  <p>
                    <strong>Ranger team:</strong>
                    <br />
                    {team.name || "Not specified"}
                  </p>

                  <p>
                    <strong>Phone:</strong>
                    <br />
                    {team.phone || "Not specified"}
                  </p>

                  <p>
                    <strong>Email:</strong>
                    <br />
                    {team.email ? (
                      <a href={`mailto:${team.email}`}>{team.email}</a>
                    ) : (
                      "Not specified"
                    )}
                  </p>

                  <p>
                    <strong>Website:</strong>
                    <br />
                    {team.websites && team.websites.length > 0
                      ? team.websites.map((website, index) => (
                          <span key={website}>
                            <a href={website} target="_blank" rel="noreferrer">
                              {website}
                            </a>
                            {index < team.websites!.length - 1 && <br />}
                          </span>
                        ))
                      : "Not specified"}
                  </p>
                </div>

                <div className="panel-box">
                  <h3>Navigation</h3>
                  <p>
                    <Link href="/">Back to map</Link>
                  </p>
                  <p>
                    <Link href="/opportunities">Browse Job Opportunities</Link>
                  </p>
                  <p>
                    <Link href="/events">Browse Events</Link>
                  </p>
                </div>
              </aside>
            </section>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <div className="footer-title">Junior Ranger Academy Placement Platform</div>
            <div className="footer-text">
              Public-facing prototype for browsing job opportunities and events across Queensland.
            </div>
          </div>

          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/opportunities">Job Opportunities</Link>
            <Link href="/events">Events</Link>
          </div>
        </div>
      </footer>
    </>
  );
}