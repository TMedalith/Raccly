'use client';

import { useState, useMemo } from 'react';
import { WorldMapVisualization } from '@/features/papers/components/WorldMapVisualization';
import { PapersStatistics } from '@/features/papers/components/PapersStatistics';
import { getAllPapers } from '@/shared/utils/paperReference';
import type { PaperData } from '@/shared/utils/paperReference';
import { MapPin, Search, X, Globe, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationStats {
  country: string;
  city: string;
  paperCount: number;
  papers: PaperData[];
  coordinates: { lat: number; lon: number };
}

export default function MapPage() {
  const allPapers = getAllPapers();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

    const locationStats = useMemo(() => {
    const locationMap = new Map<string, LocationStats>();

    allPapers.forEach((paper) => {
      if (!paper.authors) return;

      paper.authors.forEach((author) => {
        if (!author.location?.latitude || !author.location?.longitude) return;

        const { city, country, latitude, longitude } = author.location;
        const key = `${city}-${country}`;

        if (!locationMap.has(key)) {
          locationMap.set(key, {
            country,
            city,
            paperCount: 0,
            papers: [],
            coordinates: { lat: latitude as number, lon: longitude as number }
          });
        }

        const location = locationMap.get(key)!;
        if (!location.papers.find(p => p.paper_id === paper.paper_id)) {
          location.paperCount += 1;
          location.papers.push(paper);
        }
      });
    });

    return Array.from(locationMap.values()).sort((a, b) => b.paperCount - a.paperCount);
  }, [allPapers]);

    const countryStats = useMemo(() => {
    const stats = new Map<string, number>();
    locationStats.forEach((loc) => {
      stats.set(loc.country, (stats.get(loc.country) || 0) + loc.paperCount);
    });
    return Array.from(stats.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }, [locationStats]);

    const filteredLocations = useMemo(() => {
    if (!searchQuery) return locationStats;
    const query = searchQuery.toLowerCase();
    return locationStats.filter(
      (loc) =>
        loc.city.toLowerCase().includes(query) ||
        loc.country.toLowerCase().includes(query)
    );
  }, [locationStats, searchQuery]);

    const displayedPapers = useMemo(() => {
    if (selectedLocation) {
      return selectedLocation.papers;
    }
    if (selectedCountry) {
      return allPapers.filter((paper) =>
        paper.authors?.some((author) => author.location?.country === selectedCountry)
      );
    }
    return allPapers;
  }, [allPapers, selectedCountry, selectedLocation]);

  const handleCountryClick = (country: string) => {
    setSelectedCountry(selectedCountry === country ? null : country);
    setSelectedLocation(null);
  };

  const handleLocationClick = (location: { country: string; city: string }) => {
    const locationData = locationStats.find(
      (loc) => loc.city === location.city && loc.country === location.country
    );
    if (locationData) {
      setSelectedLocation(locationData);
      setSelectedCountry(null);
    }
  };

  const clearSelection = () => {
    setSelectedCountry(null);
    setSelectedLocation(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Globe className="w-7 h-7 text-[var(--primary)]" />
                Distribución Global de Investigación
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Explora {allPapers.length.toLocaleString()} papers de {locationStats.length} ubicaciones en {countryStats.length} países
              </p>
            </div>

                        <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar ciudad o país..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

                    {(selectedCountry || selectedLocation) && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-600">Filtro activo:</span>
              {selectedLocation && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--primary)] text-white text-xs rounded-full">
                  <MapPin className="w-3 h-3" />
                  {selectedLocation.city}, {selectedLocation.country}
                  <button onClick={clearSelection} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCountry && !selectedLocation && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--primary)] text-white text-xs rounded-full">
                  <Globe className="w-3 h-3" />
                  {selectedCountry}
                  <button onClick={clearSelection} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

            <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1800px] mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="h-full p-4">
                <WorldMapVisualization
                  papers={displayedPapers}
                  onCountryClick={handleCountryClick}
                  onLocationClick={handleLocationClick}
                  selectedCountry={selectedCountry}
                />
              </div>
            </div>

                        <div className="space-y-4 overflow-y-auto">
                            <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
                  Estadísticas Globales
                </h3>
                <PapersStatistics papers={displayedPapers} />
              </div>

                            <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[var(--primary)]" />
                  Top Países
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {countryStats.slice(0, 10).map(({ country, count }) => (
                    <button
                      key={country}
                      onClick={() => handleCountryClick(country)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedCountry === country
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-sm font-medium">{country}</span>
                      <span className="text-xs opacity-80">{count} papers</span>
                    </button>
                  ))}
                </div>
              </div>

                            <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--primary)]" />
                  Ubicaciones {searchQuery && `(${filteredLocations.length})`}
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {filteredLocations.slice(0, 50).map((location) => (
                      <motion.button
                        key={`${location.city}-${location.country}`}
                        onClick={() => handleLocationClick(location)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                          selectedLocation?.city === location.city &&
                          selectedLocation?.country === location.country
                            ? 'bg-[var(--primary)] text-white'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-left">
                          <div className="text-sm font-medium">{location.city}</div>
                          <div className="text-xs opacity-70">{location.country}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{location.paperCount}</div>
                          <div className="text-xs opacity-70">papers</div>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
