'use client';

import { memo, useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { MapPin, Globe } from 'lucide-react';
import type { PaperData } from '@/shared/utils/paperReference';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface PaperLocation {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  count: number;
  papers: string[];
}

interface WorldMapVisualizationProps {
  papers: PaperData[];
  onCountryClick?: (country: string) => void;
  onLocationClick?: (location: PaperLocation) => void;
  selectedCountry?: string | null;
  className?: string;
}

export const WorldMapVisualization = memo(function WorldMapVisualization({
  papers,
  onCountryClick,
  onLocationClick,
  selectedCountry,
  className = ''
}: WorldMapVisualizationProps) {
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const locations = useMemo(() => {
    const locationMap = new Map<string, PaperLocation>();

    papers.forEach((paper) => {
      if (!paper.authors) return;

      paper.authors.forEach((author) => {
        if (!author.location || !author.location.latitude || !author.location.longitude) return;

        const { city, country, latitude, longitude } = author.location;
        const key = `${city}-${country}`;

        if (!locationMap.has(key)) {
          locationMap.set(key, {
            country,
            city,
            latitude: latitude as number,
            longitude: longitude as number,
            count: 0,
            papers: []
          });
        }

        const location = locationMap.get(key)!;
        if (!location.papers.includes(paper.paper_id)) {
          location.count += 1;
          location.papers.push(paper.paper_id);
        }
      });
    });

    return Array.from(locationMap.values());
  }, [papers]);

  const countryStats = useMemo(() => {
    const stats = new Map<string, number>();
    locations.forEach((loc) => {
      stats.set(loc.country, (stats.get(loc.country) || 0) + loc.count);
    });
    return stats;
  }, [locations]);

  const handleMarkerClick = (location: PaperLocation) => {
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  const handleCountryClick = (geo: { properties: { name: string } }) => {
    const countryName = geo.properties.name;
    if (onCountryClick) {
      onCountryClick(countryName);
    }
  };

  const getMarkerSize = (count: number) => {
    const maxCount = Math.max(...locations.map(l => l.count));
    const minSize = 4;
    const maxSize = 16;
    return minSize + (count / maxCount) * (maxSize - minSize);
  };

  if (papers.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-full text-center p-8 ${className}`}>
        <Globe className="w-16 h-16 text-[var(--muted-foreground)] mb-4 opacity-30" />
        <p className="text-sm text-[var(--muted-foreground)]">
          El mapa de distribución aparecerá cuando hagas una pregunta
        </p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
            {tooltipContent && (
        <div
          className="absolute z-10 bg-[var(--navy)] text-white text-xs px-3 py-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px'
          }}
        >
          {tooltipContent}
        </div>
      )}

            <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 100,
          center: [0, 20]
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const paperCount = countryStats.get(countryName) || 0;
              const isSelected = selectedCountry === countryName;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                    isSelected
                      ? 'var(--primary)'
                      : paperCount > 0
                      ? `rgba(99, 102, 241, ${Math.min(0.2 + (paperCount / 100) * 0.6, 0.8)})`
                      : '#E5E7EB'
                  }
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: {
                      fill: isSelected ? 'var(--primary)' : 'var(--navy)',
                      outline: 'none',
                      cursor: paperCount > 0 ? 'pointer' : 'default'
                    },
                    pressed: { outline: 'none' }
                  }}
                  onClick={() => paperCount > 0 && handleCountryClick(geo)}
                  onMouseEnter={(e) => {
                    if (paperCount > 0) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipPosition({
                        x: rect.left + rect.width / 2,
                        y: rect.top
                      });
                      setTooltipContent(`${countryName}: ${paperCount} papers`);
                    }
                  }}
                  onMouseLeave={() => setTooltipContent('')}
                />
              );
            })
          }
        </Geographies>

                {locations.map((location, index) => {
          const size = getMarkerSize(location.count);

          return (
            <Marker
              key={`${location.city}-${index}`}
              coordinates={[location.longitude, location.latitude]}
              onClick={() => handleMarkerClick(location)}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({
                  x: rect.left + rect.width / 2,
                  y: rect.top
                });
                setTooltipContent(`${location.city}, ${location.country}: ${location.count} papers`);
              }}
              onMouseLeave={() => setTooltipContent('')}
            >
              <circle
                r={size}
                fill="var(--primary)"
                stroke="#FFFFFF"
                strokeWidth={1.5}
                opacity={0.9}
                className="transition-all hover:r-[6] cursor-pointer"
              />
            </Marker>
          );
        })}
      </ComposableMap>

                    <div className="legend-colors flex items-center gap-2">
          <div className="legend-item flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-200 rounded"></div>
            <span>Few papers</span>
          </div>
          <div className="legend-item flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>Many papers</span>
          </div>
        </div>
    </div>
  );
});
