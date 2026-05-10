'use client'

/// <reference types="google.maps" />

import { useEffect, useRef, useState } from 'react'
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { Loader } from '@googlemaps/js-api-loader'
import Link from "next/link";


interface MapItem {
  id: string
  type: 'rangerTeam' | 'opportunity' | 'event'
  title: string
  location: string
  coordinates: { lat: number; lng: number }
  description?: string
  region?: string
}

type FilterType = 'all' | 'rangerTeam' | 'opportunity' | 'event'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function MapEmbed() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [items, setItems] = useState<MapItem[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [search, setSearch] = useState("");

const visibleItems = (filter === "all"
  ? items
  : items.filter((item) => item.type === filter)
).filter((item) =>
  [item.title, item.location, item.region, item.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  function getDetailUrl(item: MapItem) {
  if (item.type === "rangerTeam") return `/ranger-teams/${item.id}`;
  if (item.type === "opportunity") return `/opportunities/${item.id}`;
  if (item.type === "event") return `/events/${item.id}`;
  return "/";
}
  // Initialize map
  useEffect(() => {
  async function initMap() {
    if (!mapRef.current) return;

    setOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      v: "weekly",
    });

    const [{ Map, InfoWindow }, { AdvancedMarkerElement }] =
      await Promise.all([
        importLibrary("maps"),
        importLibrary("marker"),
      ]);

    const newMap = new Map(mapRef.current, {
      center: { lat: -22.5, lng: 144.0 },
      zoom: 5,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    setMap(newMap);
  }

  initMap();
}, []);

  // Fetch data from backend
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [oppsRes, eventsRes, teamsRes] = await Promise.all([
        fetch(`${API_URL}/opportunities`),
        fetch(`${API_URL}/events`),
        fetch(`${API_URL}/ranger-teams`)
        ])

        const [oppsData, eventsData, teamsData] = await Promise.all([
          oppsRes.json(),
          eventsRes.json(),
          teamsRes.json()
        ])

        const allItems: MapItem[] = []

        // Opportunities (green triangles)
        if (oppsData.success && oppsData.data) {
          oppsData.data.forEach((opp: any) => {
            if (opp.coordinates?.lat && opp.coordinates?.lng) {
              allItems.push({
                id: opp.id,
                type: 'opportunity',
                title: opp.title,
                location: opp.location,
                coordinates: opp.coordinates,
                description: opp.description,
                region: opp.region
              })
            }
          })
        }

        // Events (blue circles)
        if (eventsData.success && eventsData.data) {
          eventsData.data.forEach((evt: any) => {
            if (evt.coordinates?.lat && evt.coordinates?.lng) {
              allItems.push({
                id: evt.id,
                type: 'event',
                title: evt.title,
                location: evt.location,
                coordinates: evt.coordinates,
                description: evt.description,
                region: evt.region
              })
            }
          })
        }

        // Ranger Teams (brown squares)
        if (teamsData.success && teamsData.data) {
          teamsData.data.forEach((team: any) => {
            if (team.coordinates?.lat && team.coordinates?.lng) {
              allItems.push({
                id: team.id,
                type: 'rangerTeam',
                title: team.name,
                location: team.location,
                coordinates: team.coordinates,
                region: team.region
              })
            }
          })
        }

        setItems(allItems)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch map data:', error)
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  // Update markers when data or filter changes
  useEffect(() => {
    if (!map || items.length === 0) return

    console.log("Marker useEffect running");

    // Clear existing markers
    markers.forEach(m => m.setMap(null))

    const filteredItems = filter === 'all'
      ? items
      : items.filter(item => item.type === filter)

    const newMarkers: google.maps.Marker[] = []
    const infoWindow = new google.maps.InfoWindow()

    map.addListener("click", () => {
  console.log("Map clicked");
});

    filteredItems.forEach(item => {
      const icon = getMarkerIcon(item.type)

    const marker = new google.maps.Marker({
    position: item.coordinates,
    map,
    title: item.title,
    icon,
    clickable: true,
    optimized: false,
    });
      

    marker.addListener("click", () => {
   
    infoWindow.setContent(buildInfoContent(item));
    infoWindow.open(map, marker);
    });

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)

    // Auto-fit map to show all markers
    if (filteredItems.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      filteredItems.forEach(item => bounds.extend(item.coordinates))
      map.fitBounds(bounds)
    }
  }, [map, items, filter])

  const counts = {
    all: items.length,
    rangerTeam: items.filter(i => i.type === 'rangerTeam').length,
    opportunity: items.filter(i => i.type === 'opportunity').length,
    event: items.filter(i => i.type === 'event').length
  }

return (
  <div className="mapContainer">
    <p className="mapIntro">
      Explore ranger groups, job opportunities, and events across Queensland.
    </p>

    <div className="mapSearchRow">
      <input
        type="text"
        placeholder="Search across all..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mapSearchInput"
      />

      <span className="nearestText">📍 Showing nearest to you</span>
    </div>

    <div className="filterRow">
      <FilterButton label={`All (${counts.all})`} active={filter === "all"} onClick={() => setFilter("all")} />
      <FilterButton label={`🟫 Ranger Groups (${counts.rangerTeam})`} active={filter === "rangerTeam"} onClick={() => setFilter("rangerTeam")} />
      <FilterButton
        label={
            <>
            <span className="filter-symbol opportunity-symbol" />
            Job Opportunities ({counts.opportunity})
            </>
        }
        active={filter === "opportunity"}
        onClick={() => setFilter("opportunity")}
      />
      <FilterButton label={`🔵 Events (${counts.event})`} active={filter === "event"} onClick={() => setFilter("event")} />
    </div>

    {loading && <p className="loading">Loading map data...</p>}

    <div className="mapContentLayout">
      <aside className="mapSidebar">
        <h3>
          {filter === "all"
            ? `All Results (${visibleItems.length})`
            : filter === "rangerTeam"
            ? `🟫 ${visibleItems.length} Ranger Groups`
            : filter === "opportunity"
            ? `🔺 ${visibleItems.length} Job Opportunities`
            : `🔵 ${visibleItems.length} Events`}
        </h3>

        {visibleItems.map((item) => (
          <div key={`${item.type}-${item.id}`} className="mapListItem">
            <div className="mapListType">
              {item.type === "rangerTeam"
                ? "Ranger Group"
                : item.type === "opportunity"
                ? "Job Opportunity"
                : "Event"}
            </div>

            <h4>
              <Link href={getDetailUrl(item)}>{item.title}</Link>
            </h4>

            <p>{item.location || "Location not specified"}</p>
            {item.region && <p>{item.region}</p>}
          </div>
        ))}
      </aside>

      <div ref={mapRef} className="map" />
    </div>

    <div className="legend">
      <div className="legend-item">
        <span className="legend-symbol ranger-symbol" />
        <span>Ranger Groups</span>
      </div>

      <div className="legend-item">
        <span className="legend-symbol opportunity-symbol" />
        <span>Job Opportunities</span>
      </div>

      <div className="legend-item">
        <span className="legend-symbol event-symbol" />
        <span>Events</span>
      </div>
    </div>
  </div>
);
  
}

// Helper: Filter button component
function FilterButton({
  label,
  active,
  onClick,
}: {
  label: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
        <button
        type="button"
        onClick={onClick}
        className={`filterBtn ${active ? "active" : ""}`}
        >
        {label}
        </button>
  );
}

// Helper: Get marker icon based on type
function getMarkerIcon(type: string): google.maps.Symbol {
  if (type === 'rangerTeam') {
    return {
      path: 'M -10,-10 L 10,-10 L 10,10 L -10,10 Z', // Square
      fillColor: '#8B4513',
      fillOpacity: 1,
      strokeColor: '#5D2F0B',
      strokeWeight: 2,
      scale: 1
    }
  }
  if (type === 'opportunity') {
    return {
      path: 'M 0,-12 L 10,8 L -10,8 Z', // Triangle
      fillColor: '#22c55e',
      fillOpacity: 1,
      strokeColor: '#15803d',
      strokeWeight: 2,
      scale: 1
    }
  }
  // Event = blue circle
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#3b82f6',
    fillOpacity: 1,
    strokeColor: '#1e40af',
    strokeWeight: 2,
    scale: 10
  }
}

// Helper: Build info window HTML
function buildInfoContent(item: MapItem): string {
  const typeLabel = {
    rangerTeam: '🟫 Ranger Group',
    opportunity: '<span style="color:#22c55e;">▲</span> Job Opportunity',
    event: '🔵 Event'
  }[item.type];

  const detailUrl = {
    rangerTeam: `/ranger-teams/${item.id}`,
    opportunity: `/opportunities/${item.id}`,
    event: `/events/${item.id}`
  }[item.type];

return `
  <div style="max-width:250px; padding:0; margin:0;">
    
    <div style="font-size:11px; color:#666; margin:0 0 2px 0; padding:0;">
      ${typeLabel}
    </div>

    <h3 style="
      margin:0 0 6px 0;
      padding:0;
      font-size:16px;
      font-weight:600;
      line-height:1.3;
    ">
      ${item.title || "Untitled"}
    </h3>

    ${
      item.location
        ? `<p style="margin:4px 0; font-size:13px;">
            <strong>Location:</strong> ${item.location}
          </p>`
        : ""
    }

    ${
      item.region
        ? `<p style="margin:4px 0; font-size:13px;">
            <strong>Region:</strong> ${item.region}
          </p>`
        : ""
    }

    <a 
      href="${detailUrl}" 
      style="
        display:inline-block;
        margin-top:8px;
        padding:6px 12px;
        background:#0047ab;
        color:white;
        text-decoration:none;
        border-radius:4px;
      "
    >
      View Details
    </a>
  </div>
`;
}