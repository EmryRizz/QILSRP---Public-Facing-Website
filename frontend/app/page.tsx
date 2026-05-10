import Link from "next/link";
import MapEmbed from './components/MapEmbed'

type Opportunity = {
  id: string;
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  location?: string;
  closingDate?: any;
};

type EventItem = {
  id: string;
  title?: string;
  description?: string;
  eventDate?: any;
  closingDate?: any;
  location?: string;
};

async function getOpportunities(): Promise<Opportunity[]> {
  const res = await fetch("http://localhost:5000/opportunities", {
    cache: "no-store",
  });
  const result = await res.json();
  return result.data || [];
}

async function getEvents(): Promise<EventItem[]> {
  const res = await fetch("http://localhost:5000/events", {
    cache: "no-store",
  });
  const result = await res.json();
  return result.data || [];
}

function getDate(timestamp: any) {
  const seconds = timestamp?.seconds || timestamp?._seconds;
  if (!seconds) return null;
  return new Date(seconds * 1000);
}

function formatDate(timestamp: any) {
  const date = getDate(timestamp);
  if (!date) return "TBC";

  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function truncateWords(text = "", maxWords = 25) {
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

function isClosingWithinSevenDays(timestamp: any) {
  const closingDate = getDate(timestamp);
  if (!closingDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysFromToday = new Date(today);
  sevenDaysFromToday.setDate(today.getDate() + 14);

  return closingDate >= today && closingDate <= sevenDaysFromToday;
}

function isClosingSoon(timestamp: any) {
  if (!timestamp) return false;

  const seconds = timestamp.seconds || timestamp._seconds;
  if (!seconds) return false;

  const closingDate = new Date(seconds * 1000);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const twoWeeks = new Date(today);
  twoWeeks.setDate(today.getDate() + 14);

  return closingDate >= today && closingDate <= twoWeeks;
}

export default async function Home() {
  const opportunities = await getOpportunities();
  const events = await getEvents();

  const closingSoonOpportunities = opportunities
    .filter((item) => isClosingWithinSevenDays(item.closingDate))
    .slice(0, 2);

  const closingSoonEvents = events
    .filter((item) => isClosingWithinSevenDays(item.closingDate))
    .slice(0, 2);

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <div className="site-brand">
            <div>
              <div className="brand-title">Ranger Opportunities Platform</div>
              <div className="brand-subtitle">Public information portal</div>
            </div>
          </div>

          <nav className="main-nav">
            <Link href="/" className="active">Home</Link>
            <Link href="/opportunities">Job Opportunities</Link>
            <Link href="/events">Events</Link>
          </nav>
        </div>
      </header>

      <div className="section-line" />

      <main>
        <section className="page-intro">
          <div className="container">
            <section className="main-content">
              <div className="intro-contact-layout">
                <div className="intro-text">
                  <h1>Explore job opportunities and events across Queensland</h1>
                  <p className="lead">
                    Browse current listings by location, review featured pathways, and view opportunities on the Queensland map.
                  </p>
                </div>

                <div className="contact-inline-box">
                  <h3>Contact</h3>
                  <p><strong>Email:</strong> landandsea@detsi.qld.gov.au</p>
                  <p><strong>Phone:</strong> 0460 011 660</p>
                </div>

                <div className="map-panel-header">
                  <h2>Ranger Groups &amp; Opportunities Map</h2>
                  <p>Preview available job opportunities and event locations across Queensland.</p>
                </div>

                <div id="map-home" className="map-panel">
                  <MapEmbed />
                </div>


              </div>

              <div id="featured-home" className="content-section">
                <h2>Job Opportunities Closing Soon</h2>

                {closingSoonOpportunities.length === 0 && (
                  <p>No job opportunities closing within the next 14 days.</p>
                )}

                {closingSoonOpportunities.map((item) => (
                  <div key={item.id} className="listing-card">
                    <div className="listing-card-top">
                      <div>

                        <h3>
                          <Link href={`/opportunities/${item.id}`}>
                            {item.title || "Untitled Opportunity"}
                          </Link>
                          {isClosingSoon(item.closingDate) && (
                            <span className="closing-soon-badge">Closing soon</span>
                          )}
                        </h3>

                        <p className="meta">
                          {[item.location, item.type, item.status]
                            .filter(Boolean)
                            .join(" • ")}
                        </p>
                      </div>

                      <div className="date-box">
                        <span>Closing date</span>
                        <strong>{formatDate(item.closingDate)}</strong>
                      </div>
                    </div>

                    <p>
                      {truncateWords(
                        item.description || "No description available.",
                        25
                      )}
                    </p>
                  </div>
                ))}

                <div className="view-all-container">
                  <Link href="/opportunities" className="view-all-button">
                    View all job opportunities
                  </Link>
                </div>
              </div>

              <div id="events-home" className="content-section">
                <h2>Events Closing Soon</h2>

                {closingSoonEvents.length === 0 && (
                  <p>No events closing within the next 14 days.</p>
                )}

                {closingSoonEvents.map((event) => (
                  <div key={event.id} className="listing-card">
                    <div className="listing-card-top">
                      <div>

                        <h3>
                          <Link href={`/events/${event.id}`}>
                            {event.title || "Untitled Event"}
                          </Link>
                          {isClosingSoon(event.closingDate) && (
                            <span className="closing-soon-badge">Closing soon</span>
                          )}
                        </h3>

                        <p className="meta">
                          {event.location || "Location not specified"}
                        </p>
                      </div>

                      <div className="date-box">
                        <span>Closing date</span>
                        <strong>{formatDate(event.closingDate)}</strong>
                      </div>
                    </div>

                    <p>
                      {truncateWords(
                        event.description || "No description available.",
                        25
                      )}
                    </p>
                  </div>
                ))}

                <div className="view-all-container">
                  <Link href="/events" className="view-all-button">
                    View all events
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <div className="footer-title">Ranger Opportunities Platform</div>
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