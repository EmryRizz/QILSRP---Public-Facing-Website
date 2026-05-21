"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import {
  formatDate,
  isClosingSoon,
  getDate,
} from "../utils/date";

type EventItem = {
  id: string;
  title?: string;
  description?: string;
  eventDate?: FirestoreTimestamp;
  closingDate?: FirestoreTimestamp;
  startDate?: FirestoreTimestamp;
  endDate?: FirestoreTimestamp;
  location?: string;
  region?: string;
};

type FirestoreTimestamp = {
  seconds?: number;
  _seconds?: number;
};

async function getEvents(): Promise<EventItem[]> {
  const res = await fetch(`${API_BASE_URL}/events`);
  const result = await res.json();
  return result.data || [];
}

function truncateWords(text = "", maxWords = 25) {
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

function getEventDateText(eventItem: EventItem) {
  if (!eventItem.startDate) return null;

  const start = formatDate(eventItem.startDate);
  const end = eventItem.endDate ? formatDate(eventItem.endDate) : null;

  if (start && end && start === end) return start;
  if (start && end) return `${start} - ${end}`;

  return start;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");


  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchEvents() {
      const data = await getEvents();
      setEvents(data);
    }

    fetchEvents();
  }, []);

 
  useEffect(() => {
     // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [search, regionFilter]);

  const regionOptions = Array.from(
    new Set(events.map((item) => item.region).filter(Boolean))
  );

    const filteredEvents = events.filter((event) => {
    const searchLower = search.toLowerCase();

    const matchesSearch =
      event.title?.toLowerCase().includes(searchLower) ||
      event.description?.toLowerCase().includes(searchLower) ||
      event.region?.toLowerCase().includes(searchLower);

    const matchesRegion = regionFilter
      ? event.region === regionFilter
      : true;

    return matchesSearch && matchesRegion;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



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
            <Link href="/events" className="active">Events</Link>
          </nav>
        </div>
      </header>

      <div className="section-line" />

      <main>
        <section className="page-intro">
          <div className="container">
            <div className="title-search-layout">
              <div className="title-text">
                <h1>Events</h1>
              </div>

              <div className="search-panel compact events-search">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="">All regions</option>
                  {regionOptions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>

  
              </div>
            </div>

            <div className="single-column-layout">
              <section className="main-content wide-content">
                <div id="current-events" className="content-section">
                  {currentEvents.length === 0 && <p>No events available.</p>}

                  {currentEvents.map((event) => (
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
                            {[event.region, getEventDateText(event)].filter(Boolean).join(" • ")}
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
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={currentPage === index + 1 ? "active-page" : ""}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </section>
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