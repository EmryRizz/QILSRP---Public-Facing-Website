import Link from "next/link";
import { API_BASE_URL } from "../../utils/api";
import {
  formatDate,
  getDate,
} from "../../utils/date";

type Opportunity = {
  id: string;
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  location?: string;
  region?: string;
  closingDate?: FirestoreTimestamp;
  minsalary?: number;
  maxsalary?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
};

type FirestoreTimestamp = {
  seconds?: number;
  _seconds?: number;
};

async function getOpportunity(id: string): Promise<Opportunity | null> {
  const res = await fetch(`${API_BASE_URL}/opportunities/${id}`,{
    cache: "no-store",
  });

  if (!res.ok) return null;

  const result = await res.json();
  return result.data;
}

function formatSalary(min?: number, max?: number) {
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  if (min) return `From $${min.toLocaleString()}`;
  if (max) return `Up to $${max.toLocaleString()}`;
  return "Not specified";
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: { id: string };
}) {
const { id } = await params;
const opportunity = await getOpportunity(id);

  if (!opportunity) {
    return <p>Opportunity not found.</p>;
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
            <div className="detail-layout">
              <section className="detail-main">


                <h1 className="detail-title">
                  {opportunity.title || "Untitled Opportunity"}
                </h1>

                <p className="detail-subtitle">
                {[opportunity.region, opportunity.type, opportunity.status]
                    .filter(Boolean)
                    .join(" • ") || "Not specified"}
                </p>

                <div className="detail-callout">
                  <div className="detail-callout-label">Closing date</div>
                  <div className="detail-callout-value">
                    {formatDate(opportunity.closingDate)}
                  </div>
                </div>

                <div className="detail-section">
                  <h2>Job opportunity overview</h2>
                  <p>{opportunity.description || "No description available."}</p>
                </div>

                <div className="detail-section">
                  <h2>Details</h2>

                  <div className="detail-grid">

                    <div className="detail-item">
                      <div className="detail-label">Position Status</div>
                      <div className="detail-value">
                        {opportunity.status || "Not specified"}
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Type</div>
                      <div className="detail-value">
                        {opportunity.type || "Not specified"}
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Location</div>
                      <div className="detail-value">{opportunity.location}</div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Region</div>
                      <div className="detail-value">{opportunity.region}</div>
                    </div>

                    {(opportunity.minsalary || opportunity.maxsalary) && (
                    <div className="detail-item">
                        <div className="detail-label">Yearly Salary</div>
                        <div className="detail-value">
                        {formatSalary(opportunity.minsalary, opportunity.maxsalary)}
                        </div>
                    </div>
                    )}

                    <div className="detail-item">
                      <div className="detail-label">Closing Date</div>
                      <div className="detail-value">
                        {formatDate(opportunity.closingDate)}
                      </div>
                    </div>


                  </div>
                </div>
              </section>

              <aside className="detail-side">
                <div className="panel-box">
                  <h3>Contact person</h3>
                  <p>
                    <strong>Name:</strong>{" "}
                    {opportunity.contactName || "Not specified"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {opportunity.contactEmail || "Not specified"}
                  </p>
                  <p>
                    <strong>Phone Number:</strong>{" "}
                    {opportunity.contactPhone || "Not specified"}
                  </p>
                </div>

                <div className="panel-box">
                  <h3>Position information</h3>
                  <p>
                    <strong>Status:</strong>{" "}
                    {opportunity.status || "Not specified"}
                  </p>
                  <p>
                    <strong>Type:</strong> {opportunity.type || "Not specified"}
                  </p>
                  {(opportunity.minsalary != null || opportunity.maxsalary != null) && (
                  <p>
                    <strong>Salary:</strong>{" "}
                    {formatSalary(opportunity.minsalary, opportunity.maxsalary)}
                  </p>
                  )}
                </div>

                <div className="panel-box">
                  <h3>Navigation</h3>
                  <p>
                    <Link href="/opportunities">Back to Job Opportunities</Link>
                  </p>
                  <p>
                    <Link href="/events">Browse Events</Link>
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}