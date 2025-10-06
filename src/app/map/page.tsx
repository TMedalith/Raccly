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
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#0a0e27] via-[#0f1435] to-[#0a0e27] pt-24">
            <div className="bg-white/5 backdrop-blur-xl border-b border-white/20 shadow-xl">
        <div className="max-w-[1800px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3 font-[family-name:var(--font-orbitron)]">
                <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                Global Research Distribution
              </h1>
              <p className="text-base text-blue-200 mt-2 font-[family-name:var(--font-space-grotesk)]">
                Explore <span className="font-semibold text-cyan-400">{allPapers.length.toLocaleString()}</span> papers from <span className="font-semibold text-cyan-400">{locationStats.length}</span> locations in <span className="font-semibold text-cyan-400">{countryStats.length}</span> countries
              </p>
            </div>

                        <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200" />
              <input
                type="text"
                placeholder="Search city or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 text-sm bg-white/5 text-white placeholder:text-blue-200/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

                    {(selectedCountry || selectedLocation) && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-blue-200">Active filter:</span>
              {selectedLocation && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-full font-medium">
                  <MapPin className="w-4 h-4" />
                  {selectedLocation.city}, {selectedLocation.country}
                  <button onClick={clearSelection} className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCountry && !selectedLocation && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-full font-medium">
                  <Globe className="w-4 h-4" />
                  {selectedCountry}
                  <button onClick={clearSelection} className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors">
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
                        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <div className="h-full p-6">
                <WorldMapVisualization
                  papers={displayedPapers}
                  onCountryClick={handleCountryClick}
                  onLocationClick={handleLocationClick}
                  selectedCountry={selectedCountry}
                />
              </div>
            </div>

                        <div className="space-y-4 overflow-y-auto custom-scrollbar">
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Global Statistics
                </h3>
                <PapersStatistics papers={displayedPapers} />
              </div>

                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  Top Countries
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {countryStats.slice(0, 10).map(({ country, count }) => (
                    <button
                      key={country}
                      onClick={() => handleCountryClick(country)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        selectedCountry === country
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <span className="text-sm font-medium">{country}</span>
                      <span className="text-xs opacity-80">{count} papers</span>
                    </button>
                  ))}
                </div>
              </div>

                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  Locations {searchQuery && <span className="text-cyan-400">({filteredLocations.length})</span>}
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                  <AnimatePresence>
                    {filteredLocations.slice(0, 50).map((location) => (
                      <motion.button
                        key={`${location.city}-${location.country}`}
                        onClick={() => handleLocationClick(location)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          selectedLocation?.city === location.city &&
                          selectedLocation?.country === location.country
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                            : 'bg-white/10 hover:bg-white/20 text-white'
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
