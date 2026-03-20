import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin, ShieldAlert, Stethoscope, Navigation } from 'lucide-react';

// Custom MapMarker Utility
const createCustomIcon = (iconContent, backgroundColor, animationClass = '') => {
  return L.divIcon({
    html: renderToStaticMarkup(
      <div className={`flex items-center justify-center w-10 h-10 ${backgroundColor} rounded-full shadow-lg border-[3px] border-white ${animationClass}`}>
        {iconContent}
      </div>
    ),
    className: 'custom-leaflet-icon !bg-transparent !border-none',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const userIcon = createCustomIcon(<Navigation className="w-5 h-5 text-white" />, 'bg-blue-600', 'animate-pulse');
const vetIcon = createCustomIcon(<Stethoscope className="w-5 h-5 text-white" />, 'bg-emerald-500');
const sosIcon = createCustomIcon(<ShieldAlert className="w-5 h-5 text-white" />, 'bg-red-600', 'animate-bounce');

const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

const LiveMap = ({ incidents }) => {
  // Try to use a central default location if we haven't acquired user's
  const defaultCenter = [12.9716, 77.5946]; // Bangalore
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [hasLocation, setHasLocation] = useState(false);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setHasLocation(true);
          setZoom(14);
        },
        (err) => {
          console.error("Error getting location", err);
        }
      );
    }
  }, []);

  // Generate some dummy nearby vets based on userLocation
  const dummyVets = useMemo(() => {
    return [
      { id: 1, name: "Happy Paws Clinic", lat: userLocation[0] + 0.008, lng: userLocation[1] + 0.005 },
      { id: 2, name: "City Vet Care", lat: userLocation[0] - 0.008, lng: userLocation[1] + 0.012 },
      { id: 3, name: "Animal Rescue Hospital", lat: userLocation[0] + 0.015, lng: userLocation[1] - 0.006 },
      { id: 4, name: "Dr. Smith's Pet Clinic", lat: userLocation[0] - 0.012, lng: userLocation[1] - 0.008 },
    ];
  }, [userLocation]);

  return (
    <div className="w-full h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/50 dark:border-slate-800/80 relative group ring-1 ring-slate-900/5">
      {/* Premium Glassmorphism Overlay UI */}
      <div className="absolute top-6 left-6 z-[400] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-5 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/40 dark:border-slate-700/50 flex flex-col gap-3 transition-all duration-300 pointer-events-none">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
           <MapPin className="w-5 h-5 text-blue-500 drop-shadow-sm"/>
           Live Emergency Radar
        </h3>
        <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
           <div className="flex items-center gap-2"><div className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600 border border-white shadow-sm"></span></div> Your Location</div>
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-sm flex-shrink-0"></span> Verified Vets</div>
           <div className="flex items-center gap-2"><div className="relative flex h-3 w-3"><span className="animate-bounce absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border border-white shadow-sm"></span></div> Active SOS Alerts</div>
        </div>
      </div>

      <MapContainer 
        center={userLocation} 
        zoom={zoom} 
        className="w-full h-full z-10"
        zoomControl={false}
      >
        <MapUpdater center={userLocation} zoom={zoom} />
        {/* Using a premium-looking map style from CartoDB Voyager */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* User Location */}
        {hasLocation && (
          <Circle 
            center={userLocation} 
            radius={2000} 
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1.5, dashArray: '4' }} 
          />
        )}
        <Marker position={userLocation} icon={userIcon}>
          <Popup className="rounded-2xl shadow-lg border-0 m-0 custom-popup min-w-[140px]">
             <div className="p-3 text-center">
                 <div className="font-bold text-slate-800 text-sm mb-1">Your Location</div>
                 <div className="text-xs text-slate-500">Live GPS tracking active</div>
             </div>
          </Popup>
        </Marker>

        {/* Nearby Vets */}
        {dummyVets.map(vet => (
          <Marker key={`vet-${vet.id}`} position={[vet.lat, vet.lng]} icon={vetIcon}>
            <Popup className="rounded-2xl shadow-lg border-0 m-0 custom-popup">
               <div className="p-2 min-w-[150px]">
                 <div className="font-bold text-emerald-800 text-sm">{vet.name}</div>
                 <div className="flex items-center gap-1 text-xs text-emerald-600/80 mb-3 font-medium mt-0.5"><Stethoscope className="w-3 h-3"/> Verified Clinic</div>
                 <button className="text-xs bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl font-bold w-full hover:bg-emerald-100 hover:shadow-sm transition-all shadow-sm border border-emerald-100">
                   Get Directions
                 </button>
               </div>
            </Popup>
          </Marker>
        ))}

        {/* Real SOS Incidents */}
        {incidents && incidents.length > 0 && incidents.map(incident => {
          if (!incident.lat || !incident.lng) return null;
          return (
            <Marker key={`sos-${incident.id}`} position={[incident.lat, incident.lng]} icon={sosIcon}>
              <Popup className="rounded-2xl shadow-xl border-0 m-0 custom-popup">
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-1.5 font-bold text-red-700 text-sm mb-1.5"><ShieldAlert className="w-4 h-4"/> Active SOS</div>
                  <div className="text-sm font-medium text-slate-800 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">{incident.issue}</div>
                  <button className="text-xs bg-red-500 text-white px-3 py-2 rounded-xl font-bold w-full hover:bg-red-600 transition-colors shadow-md shadow-red-500/20 active:scale-95">
                    Offer Help
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper { padding: 0; border-radius: 1rem; overflow: hidden; box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
        .leaflet-popup-content { margin: 0; line-height: 1.4; }
        .leaflet-popup-tip { box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1); }
        .leaflet-container a.leaflet-popup-close-button { top: 8px; right: 8px; color: #94a3b8; }
        .leaflet-container a.leaflet-popup-close-button:hover { color: #0f172a; bg: transparent; }
      `}} />
    </div>
  );
};

export default LiveMap;
