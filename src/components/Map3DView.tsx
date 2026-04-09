import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { listings } from '../data/listings';
import type { StudentProfile } from '../data/profile';
import { matchScore, matchReasons } from '../data/profile';
import type { College } from '../data/colleges';

// Real UIUC coordinates per listing
const listingCoords: Record<number, [number, number]> = {
  1: [-88.2285, 40.1040],
  2: [-88.2295, 40.1093],
  3: [-88.2236, 40.1090],
  4: [-88.2290, 40.1068],
  5: [-88.2244, 40.1058], // Sunrise Suites – Goodwin Ave
  6: [-88.2318, 40.1052], // Chalmers Court – W Chalmers
  7: [-88.2338, 40.1082], // Springfield Commons – W Springfield
  8: [-88.2255, 40.1018], // Orchard Downs – south
};

// Walking speed ~5 km/h → 1 min ≈ 83 m; 10 min ≈ 830 m
function walkRadiusMeters(mins: number) { return mins * 83; }

// Build a GeoJSON circle polygon (approximation)
function makeCircle(center: [number, number], radiusM: number, steps = 64): GeoJSON.Feature {
  const [lng, lat] = center;
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dx = (radiusM / 111320) * Math.cos(angle);
    const dy = (radiusM / (111320 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle);
    coords.push([lng + dy, lat + dx]);
  }
  return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [coords] } };
}

// Score → pin color hex
function pinColor(score: number, hasProfile: boolean): string {
  if (!hasProfile) return '#ffffff';
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  return '#d1d5db';
}

// Score → label
function scoreLabel(score: number): string {
  if (score >= 85) return 'Great';
  if (score >= 65) return 'Good';
  return 'Fair';
}

interface Props {
  selectedCollege: College | null;
  profile: StudentProfile | null;
  onViewListing: (id: number, collegeId?: string | null) => void;
  onReset: () => void;
}

export default function Map3DView({ selectedCollege, profile, onViewListing, onReset }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const buildingMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [is3D, setIs3D] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [guideIdx, setGuideIdx] = useState(0); // current "guided tour" index

  // Sorted listings by match score when profile is active
  const rankedListings = profile
    ? [...listings].sort((a, b) => matchScore(b, profile) - matchScore(a, profile))
    : listings;

  const scores: Record<number, number> = {};
  if (profile) listings.forEach(l => { scores[l.id] = matchScore(l, profile); });

  // ── Init map ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [-88.2272, 40.1075],
      zoom: 15.5,
      pitch: 55,
      bearing: -20,
      // antialias: true, // not in all MapLibre type versions
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'top-right');

    map.on('load', () => {
      setMapLoaded(true);

      // 3D buildings
      const layers = map.getStyle().layers ?? [];
      let labelLayerId: string | undefined;
      for (const layer of layers) {
        if (layer.type === 'symbol' && (layer.layout as Record<string, unknown>)['text-field']) {
          labelLayerId = layer.id; break;
        }
      }
      if (!map.getLayer('3d-buildings')) {
        map.addLayer({
          id: '3d-buildings', source: 'openmaptiles', 'source-layer': 'building',
          filter: ['==', 'extrude', 'true'], type: 'fill-extrusion', minzoom: 14,
          paint: {
            'fill-extrusion-color': ['interpolate', ['linear'], ['get', 'render_height'], 0, '#ddd8cc', 20, '#ccc6bb', 60, '#b8b0a0'],
            'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.5, ['get', 'render_height']],
            'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.5, ['get', 'render_min_height']],
            'fill-extrusion-opacity': 0.88,
          },
        }, labelLayerId);
      }

      // Walking radius source (empty initially, updated when college selected)
      map.addSource('walk-radius', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'walk-radius-fill', type: 'fill', source: 'walk-radius', paint: { 'fill-color': '#4f46e5', 'fill-opacity': 0.07 } });
      map.addLayer({ id: 'walk-radius-line', type: 'line', source: 'walk-radius', paint: { 'line-color': '#4f46e5', 'line-width': 2, 'line-dasharray': [4, 3], 'line-opacity': 0.5 } });
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // ── Walking radius + building marker ─────────────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const college = profile?.college ?? selectedCollege;

    // Update radius circle
    const src = map.getSource('walk-radius') as maplibregl.GeoJSONSource | undefined;
    if (src) {
      if (college) {
        src.setData(makeCircle(college.coords, walkRadiusMeters(10)));
      } else {
        src.setData({ type: 'FeatureCollection', features: [] });
      }
    }

    // Building pin
    buildingMarkerRef.current?.remove();
    if (college) {
      const el = document.createElement('div');
      el.style.cssText = `
        display:flex;flex-direction:column;align-items:center;pointer-events:none;
      `;
      el.innerHTML = `
        <div style="
          background:#4f46e5;color:white;font-size:11px;font-weight:800;
          padding:5px 10px;border-radius:20px;white-space:nowrap;
          box-shadow:0 4px 16px rgba(79,70,229,0.4);
          display:flex;align-items:center;gap:5px;
        ">
          <span style="font-size:14px">${college.emoji}</span>
          ${college.short} · 10 min walk
        </div>
        <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid #4f46e5;margin-top:-1px;"></div>
        <div style="width:10px;height:10px;background:#4f46e5;border-radius:50%;border:2px solid white;box-shadow:0 0 0 3px rgba(79,70,229,0.3);margin-top:2px;"></div>
      `;
      buildingMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(college.coords)
        .addTo(map);
    }
  }, [mapLoaded, profile, selectedCollege]);

  // ── Price pin markers ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    listings.forEach(listing => {
      const coords = listingCoords[listing.id];
      if (!coords) return;

      const isSelected = selectedId === listing.id;
      const score = profile ? scores[listing.id] : 0;
      const hasProfile = !!profile;
      const color = pinColor(score, hasProfile);
      const textColor = hasProfile && score >= 60 ? '#fff' : '#1c1c1e';
      const isBestMatch = hasProfile && rankedListings[0]?.id === listing.id;

      const badge = listing.badge === 'Verified'
        ? `<span style="background:rgba(111,207,151,0.95);color:#1c1c1e;font-size:9px;font-weight:700;padding:1px 6px;border-radius:20px;margin-bottom:3px;display:block;text-align:center;">${listing.badge}</span>` : '';

      const matchBadge = hasProfile
        ? `<span style="font-size:9px;font-weight:800;margin-left:3px;opacity:0.85">${score}%</span>`
        : '';

      const shadow = isSelected
        ? `0 6px 24px ${color}88, 0 2px 8px rgba(0,0,0,0.3)`
        : `0 2px 10px rgba(0,0,0,0.18)`;

      const scale = isSelected ? 'scale(1.2)' : 'scale(1)';
      const border = isSelected ? `2px solid ${color === '#ffffff' ? '#1c1c1e' : color}` : `2px solid ${color === '#ffffff' ? 'rgba(255,255,255,0.9)' : color + 'bb'}`;

      const el = document.createElement('div');
      el.style.cssText = `display:flex;flex-direction:column;align-items:center;cursor:pointer;transform:${scale};transition:transform 0.2s ease;z-index:${isSelected ? 20 : 10};`;

      el.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;">
          ${isBestMatch && !isSelected ? `<span style="font-size:9px;background:#22c55e;color:white;font-weight:800;padding:1px 6px;border-radius:20px;margin-bottom:3px;display:block;">★ Best match</span>` : badge}
          <div style="
            background:${color};color:${textColor};
            font-size:12px;font-weight:800;
            padding:5px 11px;border-radius:20px;
            box-shadow:${shadow};
            border:${border};
            white-space:nowrap;display:flex;align-items:center;gap:2px;
          ">
            $${listing.price}/mo${matchBadge}
          </div>
          <div style="width:2px;height:14px;background:${isSelected ? '#1c1c1e' : color === '#ffffff' ? '#d1d5db' : color};margin-top:-1px;border-radius:0 0 1px 1px;"></div>
          <div style="width:9px;height:9px;border-radius:50%;background:${isSelected ? '#1c1c1e' : color === '#ffffff' ? '#d1d5db' : color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);margin-top:-1px;"></div>
        </div>
      `;

      el.addEventListener('click', e => {
        e.stopPropagation();
        setSelectedId(prev => prev === listing.id ? null : listing.id);
        map.flyTo({ center: coords, zoom: 16.5, pitch: 62, bearing: map.getBearing(), duration: 700, essential: true });
      });

      markersRef.current.push(
        new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat(coords).addTo(map)
      );
    });
  }, [mapLoaded, selectedId, profile]);

  // ── Auto-fly to best match when profile is set ────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !profile) return;
    const best = rankedListings[0];
    const coords = best ? listingCoords[best.id] : null;
    if (!coords) return;
    const college = profile.college;

    setTimeout(() => {
      mapRef.current?.flyTo({
        center: coords,
        zoom: 15.5,
        pitch: 58,
        bearing: -15,
        duration: 1400,
        essential: true,
      });
      // After fly-to, show the college building too
      if (college) {
        setTimeout(() => {
          mapRef.current?.easeTo({ center: college.coords, zoom: 15.2, pitch: 55, duration: 800 });
          setTimeout(() => {
            mapRef.current?.flyTo({ center: coords, zoom: 16, pitch: 62, duration: 900, essential: true });
          }, 1100);
        }, 1800);
      }
    }, 300);
  }, [profile, mapLoaded]);

  // ── Toggle 3D ─────────────────────────────────────────────────────────────────
  const toggle3D = () => {
    if (!mapRef.current) return;
    if (is3D) mapRef.current.easeTo({ pitch: 0, bearing: 0, duration: 700 });
    else mapRef.current.easeTo({ pitch: 55, bearing: -20, duration: 700 });
    setIs3D(v => !v);
  };

  const flyTo = useCallback((id: number) => {
    const coords = listingCoords[id];
    if (!coords || !mapRef.current) return;
    mapRef.current.flyTo({ center: coords, zoom: 17, pitch: 65, bearing: 30, duration: 900, essential: true });
  }, []);

  // Navigate guided tour
  const goToGuide = useCallback((idx: number) => {
    const listing = rankedListings[idx];
    if (!listing) return;
    setGuideIdx(idx);
    setSelectedId(listing.id);
    flyTo(listing.id);
  }, [rankedListings, flyTo]);

  const selectedListing = listings.find(l => l.id === selectedId) ?? null;
  const selectedScore = selectedListing && profile ? scores[selectedListing.id] : 0;
  const selectedReasons = selectedListing && profile ? matchReasons(selectedListing, profile) : [];

  return (
    <div className="relative flex-1 overflow-hidden flex flex-col">
      {/* Map container */}
      <div ref={containerRef} className="flex-1" />


      {/* 3D / 2D toggle */}
      <div className="absolute top-3 right-14 z-10">
        <button onClick={toggle3D}
          className="h-9 px-3 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-black/8 text-[12px] font-bold text-[#1c1c1e] flex items-center gap-1.5">
          {is3D ? '🏙️ 3D' : '🗺️ 2D'}
        </button>
      </div>

      {/* Walk radius legend */}
      {(profile?.college || selectedCollege) && (
        <div className="absolute bottom-[220px] left-3 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md border border-black/8 flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-indigo-500 bg-indigo-50" />
            <span className="text-[10px] font-semibold text-[#1c1c1e]">10 min walk</span>
          </div>
        </div>
      )}

      {/* ── Bottom panel ── */}
      <div className="bg-white border-t border-black/6 flex-shrink-0">
        <div className="pt-3" />

        {/* No listing selected → guided tour or card strip */}
        {!selectedListing && (
          <div className="pb-[80px]">
            {profile ? (
              <>
                {/* "Best matches for you" header */}
                <div className="px-4 mb-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-[#1c1c1e]">
                      {rankedListings.filter(l => scores[l.id] >= 65).length} great matches for you
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[11px] text-[#6c6a66]">Ranked by your profile · tap to fly to</p>
                      <button
                        onClick={() => { setSelectedId(null); onReset(); }}
                        className="text-[10px] font-semibold text-red-500 underline underline-offset-2">
                        Reset
                      </button>
                    </div>
                  </div>
                  {/* Guided tour buttons */}
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => goToGuide(Math.max(0, guideIdx - 1))}
                      disabled={guideIdx === 0}
                      className="w-8 h-8 rounded-full bg-[#f0efe9] flex items-center justify-center disabled:opacity-30">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <span className="text-[11px] font-semibold text-[#6c6a66]">{guideIdx + 1}/{rankedListings.length}</span>
                    <button onClick={() => goToGuide(Math.min(rankedListings.length - 1, guideIdx + 1))}
                      disabled={guideIdx >= rankedListings.length - 1}
                      className="w-8 h-8 rounded-full bg-[#f0efe9] flex items-center justify-center disabled:opacity-30">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                </div>
                {/* Ranked card strip */}
                <div className="flex gap-2.5 overflow-x-auto scrollbar-hide px-4">
                  {rankedListings.map((l, i) => {
                    const s = scores[l.id];
                    const color = s >= 80 ? 'bg-green-100 text-green-700' : s >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500';
                    return (
                      <button key={l.id}
                        onClick={() => { setSelectedId(l.id); flyTo(l.id); setGuideIdx(i); }}
                        className={`flex-shrink-0 flex items-center gap-2.5 rounded-2xl px-3 py-2.5 border-2 transition-all ${
                          guideIdx === i && selectedId === l.id ? 'border-[#1c1c1e] bg-white shadow-md' : 'border-transparent bg-[#f7f6f2]'
                        }`}>
                        <div className="relative">
                          <img src={l.img} className="w-12 h-12 rounded-xl object-cover" />
                          {i === 0 && <span className="absolute -top-1 -right-1 text-[10px]">★</span>}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[13px] font-bold text-[#1c1c1e]">${l.price}/mo</p>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${color}`}>{s}%</span>
                          </div>
                          <p className="text-[11px] text-[#6c6a66] max-w-[100px] truncate">{l.name}</p>
                          {profile.college && (
                            <p className="text-[10px] text-indigo-600 font-semibold">{l.walkFrom[profile.college.id]}m walk</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="px-4 pb-1">
                <p className="text-[12px] text-[#6c6a66] mb-2.5">{listings.length} listings</p>
                <div className="flex gap-2.5 overflow-x-auto scrollbar-hide">
                  {listings.map(l => (
                    <button key={l.id} onClick={() => { setSelectedId(l.id); flyTo(l.id); }}
                      className="flex-shrink-0 flex items-center gap-2.5 bg-[#f7f6f2] rounded-2xl px-3 py-2.5 border border-black/5">
                      <img src={l.img} className="w-10 h-10 rounded-xl object-cover" />
                      <div className="text-left">
                        <p className="text-[13px] font-bold text-[#1c1c1e]">${l.price}/mo</p>
                        <p className="text-[11px] text-[#6c6a66] max-w-[110px] truncate">{l.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Listing selected → detail with match reasons */}
        {selectedListing && (
          <div className="px-4 pb-[80px]">
            <div className="flex gap-3 items-start">
              <img src={selectedListing.img} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[20px] font-bold text-[#1c1c1e] leading-tight">
                      ${selectedListing.price}<span className="text-[13px] font-normal text-[#6c6a66]">/mo</span>
                    </p>
                    <p className="text-[14px] font-semibold text-[#1c1c1e] mt-0.5">{selectedListing.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {profile && (
                      <span className={`text-[12px] font-black px-2.5 py-1 rounded-full ${
                        selectedScore >= 80 ? 'bg-green-100 text-green-700' :
                        selectedScore >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {scoreLabel(selectedScore)} {selectedScore}%
                      </span>
                    )}
                    <button onClick={() => setSelectedId(null)}
                      className="w-7 h-7 rounded-full bg-[#f0efe9] flex items-center justify-center text-[#6c6a66] text-lg leading-none">×</button>
                  </div>
                </div>

                {/* Match reasons */}
                {profile && selectedReasons.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {selectedReasons.map((r, i) => (
                      <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        r.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                      }`}>
                        {r.ok ? '✓' : '✗'} {r.text}
                      </span>
                    ))}
                  </div>
                )}

                {!profile && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${selectedListing.badgeColor}`}>{selectedListing.badge}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f0efe9] text-[#1c1c1e]">{selectedListing.beds}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={() => onViewListing(selectedListing.id, profile?.college?.id ?? selectedCollege?.id)}
                className="flex-1 h-11 bg-[#1c1c1e] rounded-xl text-white text-[14px] font-semibold">
                View details
              </button>
              <button onClick={() => flyTo(selectedListing.id)}
                className="h-11 px-4 rounded-xl border border-black/12 text-[14px] font-semibold text-[#1c1c1e]">
                🏙️ Fly to
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
