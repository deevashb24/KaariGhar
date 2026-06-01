import React, { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import api from '../../api';

const GLYPH_URL = 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf';

async function fetchPatchedStyle() {
    const url = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
    const res = await fetch(url);
    const style = await res.json();
    style.glyphs = GLYPH_URL;
    return style;
}

export default function MakerMap({ onMakersLoaded, highlightMakerId }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const popupRef = useRef(null);
    const addCustomLayersRef = useRef(() => { });

    const [, setMapLoaded] = useState(false);
    const [makers, setMakers] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch makers from API
    useEffect(() => {
        let cancelled = false;
        async function fetchMakers() {
            try {
                const res = await api.get('/makers/nearby');
                if (!cancelled) {
                    const featureCollection = {
                        type: "FeatureCollection",
                        features: res.data.map(m => ({
                            type: "Feature",
                            geometry: { type: "Point", coordinates: [m.longitude, m.latitude] },
                            properties: {
                                id: m.id,
                                name: m.name,
                                email: m.email,
                                profileDetails: m.profileDetails || 'Expert Artisan'
                            }
                        }))
                    };
                    setMakers(featureCollection);
                    setLoading(false);
                    // Notify parent about all makers
                    if (onMakersLoaded) onMakersLoaded(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch makers", err);
                if (!cancelled) setLoading(false);
            }
        }
        fetchMakers();
        return () => { cancelled = true; };
    }, []);

    const addCustomLayers = useCallback(() => {
        const map = mapRef.current;
        if (!map) return;
        if (map.getSource('makers')) return;

        const sourceData = makers || { type: "FeatureCollection", features: [] };

        map.addSource('makers', {
            type: 'geojson',
            data: sourceData,
            cluster: false
        });

        // Glow halo
        map.addLayer({
            id: 'maker-point-halo',
            type: 'circle',
            source: 'makers',
            paint: {
                'circle-color': '#D4AF37',
                'circle-radius': 18,
                'circle-opacity': 0.2,
                'circle-blur': 0.4
            }
        });

        // Core dot
        map.addLayer({
            id: 'maker-point',
            type: 'circle',
            source: 'makers',
            paint: {
                'circle-color': '#D4AF37',
                'circle-radius': 8,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff',
                'circle-opacity': 0.9
            }
        });

        // Fit map bounds to show all makers
        if (sourceData.features.length > 0) {
            const bounds = new maplibregl.LngLatBounds();
            sourceData.features.forEach(f => bounds.extend(f.geometry.coordinates));
            map.fitBounds(bounds, { padding: 60, maxZoom: 14 });
        }
    }, [makers]);

    useEffect(() => {
        addCustomLayersRef.current = addCustomLayers;
    }, [addCustomLayers]);

    // Update map source when data changes
    useEffect(() => {
        if (!mapRef.current || !makers) return;
        const map = mapRef.current;
        if (!map.isStyleLoaded()) return;
        const src = map.getSource('makers');
        if (src) {
            src.setData(makers);
        }
    }, [makers]);

    // Highlight a specific maker when parent tells us to
    useEffect(() => {
        if (!mapRef.current || !makers || !highlightMakerId) return;
        const feature = makers.features.find(f => f.properties.id === highlightMakerId);
        if (feature) {
            const coords = feature.geometry.coordinates;
            mapRef.current.flyTo({ center: coords, zoom: 14, essential: true });

            // Show popup
            if (popupRef.current) popupRef.current.remove();
            popupRef.current = new maplibregl.Popup({ closeButton: true, closeOnClick: true, offset: 12, className: 'maker-popup' })
                .setLngLat(coords)
                .setHTML(`
                    <div style="font-family: 'Inter', sans-serif;">
                        <strong style="color:#D4AF37;font-size:1rem;">${feature.properties.name}</strong>
                        <p style="margin:4px 0 0;font-size:0.85rem;color:#ccc;">${feature.properties.profileDetails}</p>
                        <span style="display:inline-block;margin-top:6px;font-size:0.75rem;color:#2ecc71;">✓ Trust Verified</span>
                    </div>
                `)
                .addTo(mapRef.current);
        }
    }, [highlightMakerId, makers]);

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current) return;
        if (mapRef.current) return;

        fetchPatchedStyle().then(mapStyle => {
            if (!mapContainer.current) return;

            const map = new maplibregl.Map({
                container: mapContainer.current,
                style: mapStyle,
                center: [80.35, 26.45], // Kanpur
                zoom: 6,
                pitch: 30,
                bearing: -10,
                antialias: true
            });

            mapRef.current = map;

            map.once('load', () => setMapLoaded(true));
            map.on('style.load', () => addCustomLayersRef.current());

            // ---- Hover → MapLibre Popup ----
            map.on('mouseenter', 'maker-point', (e) => {
                map.getCanvas().style.cursor = 'pointer';
                if (!e.features?.length) return;

                const feature = e.features[0];
                const coordinates = feature.geometry.coordinates.slice();

                if (popupRef.current) popupRef.current.remove();

                popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12, className: 'maker-popup' })
                    .setLngLat(coordinates)
                    .setHTML(`
                        <div style="font-family: 'Inter', sans-serif;">
                            <strong style="color:#D4AF37;font-size:1rem;">${feature.properties.name}</strong>
                            <p style="margin:4px 0 0;font-size:0.85rem;color:#ccc;">${feature.properties.profileDetails}</p>
                            <span style="display:inline-block;margin-top:6px;font-size:0.75rem;color:#2ecc71;">✓ Trust Verified</span>
                        </div>
                    `)
                    .addTo(map);
            });

            map.on('mouseleave', 'maker-point', () => {
                map.getCanvas().style.cursor = '';
                if (popupRef.current) {
                    popupRef.current.remove();
                    popupRef.current = null;
                }
            });

            // Click to fly
            map.on('click', 'maker-point', (e) => {
                if (!e.features?.length) return;
                const feature = e.features[0];
                const coordinates = feature.geometry.coordinates.slice();
                map.flyTo({ center: coordinates, zoom: 15, essential: true });
            });

            return () => {
                map.remove();
                mapRef.current = null;
                setMapLoaded(false);
            };
        });
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '450px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

            {loading && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(20,20,20,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                    Loading Map & Makers...
                </div>
            )}

            <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(30,30,30,0.85)',
                backdropFilter: 'blur(10px)',
                padding: '10px 14px',
                borderRadius: '8px',
                pointerEvents: 'none',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h4 style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.95rem' }}>Live Discover</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hover over a gold marker to view details</p>
            </div>
        </div>
    );
}
