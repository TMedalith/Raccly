'use client';

import { memo, useMemo } from 'react';
import { FileText, Users, Calendar, Globe2, TrendingUp } from 'lucide-react';
import type { PaperData } from '@/shared/utils/paperReference';

interface PapersStatisticsProps {
  papers: PaperData[];
  className?: string;
}

export const PapersStatistics = memo(function PapersStatistics({
  papers,
  className = ''
}: PapersStatisticsProps) {
  const stats = useMemo(() => {
    if (papers.length === 0) {
      return {
        totalPapers: 0,
        totalAuthors: 0,
        countries: 0,
        yearRange: '',
        topCountry: '',
        recentPapers: 0
      };
    }

    const authorsSet = new Set<string>();
    const countriesSet = new Set<string>();
    const years: number[] = [];
    const countryCount = new Map<string, number>();

    papers.forEach((paper) => {
            if (paper.authors) {
        paper.authors.forEach((author) => {
          authorsSet.add(author.name);
          if (author.location?.country) {
            countriesSet.add(author.location.country);
            countryCount.set(
              author.location.country,
              (countryCount.get(author.location.country) || 0) + 1
            );
          }
        });
      }

            if (paper.publication_year) {
        years.push(paper.publication_year);
      }
    });

        const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const yearRange = minYear === maxYear ? `${minYear}` : `${minYear}-${maxYear}`;

        let topCountry = '';
    let maxCount = 0;
    countryCount.forEach((count, country) => {
      if (count > maxCount) {
        maxCount = count;
        topCountry = country;
      }
    });

        const currentYear = new Date().getFullYear();
    const recentPapers = years.filter((year) => year >= currentYear - 3).length;

    return {
      totalPapers: papers.length,
      totalAuthors: authorsSet.size,
      countries: countriesSet.size,
      yearRange,
      topCountry,
      recentPapers
    };
  }, [papers]);

  if (papers.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3 border border-blue-200/50">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-medium text-blue-900">Papers</span>
        </div>
        <div className="text-2xl font-bold text-blue-700">{stats.totalPapers}</div>
      </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-3 border border-purple-200/50">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-medium text-purple-900">Authors</span>
        </div>
        <div className="text-2xl font-bold text-purple-700">{stats.totalAuthors}</div>
      </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-3 border border-green-200/50">
        <div className="flex items-center gap-2 mb-1">
          <Globe2 className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-green-900">Countries</span>
        </div>
        <div className="text-2xl font-bold text-green-700">{stats.countries}</div>
        {stats.topCountry && (
          <div className="text-xs text-green-600 mt-1 truncate" title={stats.topCountry}>
            Top: {stats.topCountry}
          </div>
        )}
      </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-3 border border-orange-200/50">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-medium text-orange-900">Years</span>
        </div>
        <div className="text-lg font-bold text-orange-700">{stats.yearRange}</div>
        {stats.recentPapers > 0 && (
          <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {stats.recentPapers} recent
          </div>
        )}
      </div>
    </div>
  );
});
