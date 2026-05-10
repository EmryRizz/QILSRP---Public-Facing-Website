"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type EventItem = {
  id: string;
  title?: string;
  description?: string;
  eventDate?: any;
  closingDate?: any;
  startDate?: any;
  endDate?: any;
  location?: string;
  region?: string;
};

type RangerTeam = {
  id: string;
  name: string;
};

async function getEvent(id: string): Promise<EventItem | null> {
  const res = await fetch(`http://localhost:5000/events/${id}`);

  if (!res.ok) return null;

  const result = await res.json();
  return result.data;
}

function formatDate(timestamp: any) {
  if (!timestamp) return "TBC";

  const seconds = timestamp.seconds || timestamp._seconds;
  if (!seconds) return timestamp;

  return new Date(seconds * 1000).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getEventDateRange(event: EventItem) {
  if (!event.startDate) return "TBC";

  const start = formatDate(event.startDate);
  const end = event.endDate ? formatDate(event.endDate) : null;

  if (!end || start === end) {
    return start;
  }

  return `${start} - ${end}`;
}

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rangerTeams, setRangerTeams] = useState<RangerTeam[]>([]);

  useEffect(() => {
    async function fetchEvent() {
      const data = await getEvent(id);
      setEvent(data);
      setLoading(false);
    }

    async function fetchRangerTeams() {
        const res = await fetch("http://localhost:5000/ranger-teams");
        const result = await res.json();
        setRangerTeams(result.data || []);
    }

fetchRangerTeams();

    fetchEvent();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget; 

    const formData = new FormData(form);

    const participantData = {
      name: formData.get("name"),
      rangerGroup: formData.get("rangerGroup"),
      dateOfBirth: formData.get("dateOfBirth"),
      phoneNumber: formData.get("phoneNumber"),
      email: formData.get("email") || null,
    };

    

    const res = await fetch(`http://localhost:5000/events/${id}/participants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(participantData),
    });

    if (res.ok) {
      setShowForm(false);
      setSuccess(true);
      form.reset();
    }
  }

  if (loading) {
    return <p>Loading event...</p>;
  }

  if (!event) {
    return <p>Event not found.</p>;
  }

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
            <Link href="/">Home</Link>
            <Link href="/opportunities">Job Opportunities</Link>
            <Link href="/events" className="active">
              Events
            </Link>
          </nav>
        </div>
      </header>

      <div className="section-line" />

      <main>
        <section className="page-intro">
          <div className="container">
            <div className="detail-layout">
              <section className="detail-main">
      

                <h1 className="detail-title">
                  {event.title || "Untitled Event"}
                </h1>

                <p className="detail-subtitle">
                  {event.region || "Region not specified"}
                </p>

                <div className="detail-section">
                  <h2>Event overview</h2>
                  <p>{event.description || "No description available."}</p>
                </div>

                <div className="detail-section">
                  <h2>Details</h2>

                  <div className="detail-grid">

                    <div className="detail-item">
                      <div className="detail-label">Event Date(s)</div>
                    <div className="detail-value">
                        {getEventDateRange(event)}
                    </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Closing Date</div>
                      <div className="detail-value">
                        {formatDate(event.closingDate)}
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Location</div>
                      <div className="detail-value">
                        {event.location || "Not specified"}
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Region</div>
                      <div className="detail-value">
                        {event.region || "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>


                <div className="apply-section">
                  <button
                    type="button"
                    className="apply-button"
                    onClick={() => setShowForm(!showForm)}
                  >
                    Apply for this event
                  </button>

                  {showForm && (
                    <div id="event-apply-form-wrapper">
                      <h3 className="apply-form-title">Application Form</h3>

                      <form className="apply-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                        <label htmlFor="event-name">Full Name</label>
                        <input type="text" id="event-name" name="name" required />
                        </div>

                        <div className="form-group">
                        <label htmlFor="event-ranger-group">Ranger Group</label>
                        <select id="event-ranger-group" name="rangerGroup" required>
                            <option value="">Select ranger group</option>

                            {rangerTeams.map((team) => (
                            <option key={team.id} value={team.name}>
                                {team.name}
                            </option>
                            ))}
                        </select>
                        </div>

                        <div className="form-group">
                        <label htmlFor="event-dob">Date of Birth</label>
                        <input
                            type="date"
                            id="event-dob"
                            name="dateOfBirth" 
                            required
                        />
                        </div>

                        <div className="form-group">
                        <label htmlFor="event-phone">Phone Number</label>
                        <input
                            type="tel"
                            id="event-phone"
                            name="phoneNumber"  
                            required
                        />
                        </div>

                        <div className="form-group">
                        <label htmlFor="event-email">Email Address (optional)</label>
                        <input
                            type="email"
                            id="event-email"
                            name="email"
                        />
                        </div>

                        <button type="submit" className="apply-button">
                        Submit application
                        </button>
                      </form>

                    </div>
                  )}
                    {success && (
                    <div className="popup-overlay">
                        <div className="popup-box">
                        <h3>Application Submitted</h3>
                        <p>Your event application has been submitted successfully.</p>

                        <button
                            type="button"
                            className="apply-button"
                            onClick={() => setSuccess(false)}
                        >
                            OK
                        </button>
                        </div>
                    </div>
                    )}
                </div>
              </section>

              <aside className="detail-side">
                <div className="panel-box">
                  <h3>Event summary</h3>
                  <p>
                    <strong>Date: </strong>                 
                    {getEventDateRange(event)}
                  </p>
                  <p>
                    <strong>Closing date:</strong> {formatDate(event.closingDate)}
                  </p>
                  <p>
                    <strong>Region:</strong>{" "}
                    {event.region || "Not specified"}
                  </p>
                </div>

                <div className="panel-box">
                  <h3>Navigation</h3>
                  <p>
                    <Link href="/events">Back to Events</Link>
                  </p>
                  <p>
                    <Link href="/opportunities">Browse Job Opportunities</Link>
                  </p>
                </div>
              </aside>
            </div>
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