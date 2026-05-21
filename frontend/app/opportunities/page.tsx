"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import {
  formatDate,
  isClosingSoon,
  getDate,
} from "../utils/date";


type Opportunity = {
  id: string;
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  location?: string;
  region?: string;
  closingDate?: FirestoreTimestamp;
};

type FirestoreTimestamp = {
  seconds?: number;
  _seconds?: number;
};

async function getOpportunities(): Promise<Opportunity[]> {
  const res = await fetch(`${API_BASE_URL}/opportunities`);
  const result = await res.json();
  return result.data || [];
}

function truncateWords(text = "", maxWords = 25) {
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");


  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchOpportunities() {
      const data = await getOpportunities();
      setOpportunities(data);
    }

    fetchOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter((item) => {
  const searchLower = search.toLowerCase();

  const matchesSearch =
    item.title?.toLowerCase().includes(searchLower) ||
    item.description?.toLowerCase().includes(searchLower);

  const matchesType = typeFilter ? item.type === typeFilter : true;

  const matchesRegion = regionFilter
    ? item.region?.toLowerCase().includes(regionFilter.toLowerCase())
    : true;

  return matchesSearch && matchesType && matchesRegion;
  });



  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

  const currentOpportunities = filteredOpportunities.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
  setCurrentPage(1);
  }, [search, typeFilter, regionFilter]);

  const typeOptions = Array.from(
  new Set(opportunities.map((item) => item.type).filter(Boolean))
  );

  const regionOptions = Array.from(
  new Set(opportunities.map((item) => item.region).filter(Boolean))
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
            <Link href="/opportunities" className="active">
              Job Opportunities
            </Link>
            <Link href="/events">Events</Link>
          </nav>
        </div>
      </header>

      <div className="section-line" />

      <main>
        <section className="page-intro">
          <div className="container">
            <div className="single-column-layout">
              <section className="main-content wide-content">
                <div className="title-search-layout">
                  <div className="title-text">
                    <h1>Job Opportunities</h1>
                  </div>

                  <div id="search-section" className="search-panel compact">
                  <input
                    type="text"
                    placeholder="Search job opportunities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    />

                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="">All Type</option>
                    {typeOptions.map((type) => (
                        <option key={type} value={type}>
                        {type}
                        </option>
                    ))}
                    </select>

                    <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
                    <option value="">All Region</option>
                    {regionOptions.map((region) => (
                        <option key={region} value={region}>
                        {region}
                        </option>
                    ))}
                    </select>
                  </div>
                </div>

                <div id="listings-section" className="content-section">
                  {currentOpportunities.length === 0 && (
                    <p>No opportunities available.</p>
                  )}

                  {currentOpportunities.map((item) => (
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
                            {[item.region, item.type, item.status]
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