"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/contexts/ThemeContext";

// Define global L to avoid TS errors
declare global {
  interface Window {
    L: any;
  }
}

interface CollegeMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  tier?: string;
  fees?: string | number;
}

export default function Map({ 
  colleges, 
  center = [12.9716, 77.5946],
  selectedCollegeId
}: { 
  colleges: CollegeMarker[]; 
  center?: [number, number];
  selectedCollegeId?: string | null;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRefs = useRef<Record<string, any>>({});
  const { theme } = useTheme();
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Keep script cached
    };
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !window.L || !mapRef.current) return;

    const L = window.L;

    // Fix for default marker icons
    const DefaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    // Initialize map
    if (!mapInstanceRef.current) {
      console.log("🗺️ Initializing Leaflet map at:", center);
      mapInstanceRef.current = L.map(mapRef.current).setView(center, 11);
      
      // Using Standard OSM with a CSS filter for reliable dark mode
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapInstanceRef.current);
      
      // Apply dark mode filter to the tile pane
      const mapPane = mapInstanceRef.current.getPane('tilePane');
      if (mapPane) {
        if (theme === 'dark') {
          mapPane.style.filter = 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)';
        } else {
          mapPane.style.filter = 'none';
        }
      }
    } else {
      mapInstanceRef.current.setView(center, mapInstanceRef.current.getZoom());
    }

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });
    markerRefs.current = {};

    // Add user marker if it's not the default center
    if (center[0] !== 12.9716 || center[1] !== 77.5946) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            <div class="relative w-3 h-3 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      L.marker(center, { icon: userIcon, zIndexOffset: 1000 })
        .bindPopup('<div class="text-xs font-bold">You are here</div>')
        .addTo(mapInstanceRef.current);
    }

    // Add new markers
    colleges.forEach((college) => {
      if (mapInstanceRef.current) {
        const feesFormatted = typeof college.fees === 'number' ? `₹${(college.fees/1000).toFixed(0)}k/yr` : college.fees;
        const popupContent = `
          <div class="space-y-1">
            <h3 class="font-bold text-sm tracking-tight text-white mb-2 leading-tight">${college.name}</h3>
            ${college.tier ? `<div class="text-xs flex items-center gap-2"><span class="text-muted-foreground">Tier:</span><span class="text-primary font-bold">${college.tier}</span></div>` : ''}
            ${feesFormatted ? `<div class="text-xs flex items-center gap-2"><span class="text-muted-foreground">Fees:</span><span class="text-white font-medium">${feesFormatted}</span></div>` : ''}
          </div>
        `;
        const marker = L.marker([college.lat, college.lng])
          .bindPopup(popupContent)
          .addTo(mapInstanceRef.current);
          
        markerRefs.current[college.id] = marker;
      }
    });

  }, [leafletLoaded, center, colleges, theme]);

  // Handle focusing on selected college
  useEffect(() => {
    if (selectedCollegeId && markerRefs.current[selectedCollegeId] && mapInstanceRef.current) {
      const marker = markerRefs.current[selectedCollegeId];
      // Fly to the marker with a smooth animation and zoom in slightly
      mapInstanceRef.current.flyTo(marker.getLatLng(), 14, {
        duration: 1.5,
        easeLinearity: 0.25
      });
      // Open the popup after flying
      setTimeout(() => {
        marker.openPopup();
      }, 1500); // Wait for the fly animation to complete
    }
  }, [selectedCollegeId]);

  // Clean up map instance on full unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!leafletLoaded || !window.L || !mapRef.current) return;
    // ... rest of effect stays same
  }, [leafletLoaded, center, colleges]);

  // Update map tile filter when theme changes dynamically
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const mapPane = mapInstanceRef.current.getPane('tilePane');
    if (mapPane) {
      if (theme === 'dark') {
        mapPane.style.filter = 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)';
      } else {
        mapPane.style.filter = 'none';
      }
    }
  }, [theme]);

  // Handle resizing when toggling fullscreen
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 300);
    }
  }, [isFullscreen]);

  return (
    <div className={cn(
      "relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300",
      isFullscreen ? "fixed inset-0 z-[100] rounded-none" : "w-full h-[600px]"
    )}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      
      {/* Fullscreen Toggle Button */}
      <button 
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-4 right-4 z-[1000] bg-black/80 backdrop-blur-md border border-white/20 p-2 rounded-xl text-white hover:bg-primary transition-all shadow-xl group"
        title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen Map"}
      >
        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper {
          background-color: ${theme === 'dark' ? '#09090b' : '#ffffff'} !important;
          color: ${theme === 'dark' ? '#fafafa' : '#09090b'} !important;
          border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} !important;
          border-radius: 12px !important;
        }
        .leaflet-popup-tip {
          background-color: ${theme === 'dark' ? '#09090b' : '#ffffff'} !important;
          border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} !important;
        }
        .leaflet-popup-content {
          margin: 12px 16px !important;
          font-family: var(--font-inter), sans-serif !important;
        }
      `}} />
      {!leafletLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm text-white/50 text-sm font-bold uppercase tracking-widest">
          Loading Map...
        </div>
      )}
      <div ref={mapRef} className="w-full h-full absolute inset-0 z-0" />
    </div>
  );
}
