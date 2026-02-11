import { useState, useMemo, useCallback } from 'react';
import type { PaperData, PaperFilters } from '../types/paper';
import papersData from '@/shared/services/papers.json';

// Type guard to validate papers have essential data
function isValidPaper(paper: unknown): paper is PaperData {
  const p = paper as Record<string, unknown>;
  return Boolean(
    p.title &&
    p.authors &&
    Array.isArray(p.authors) &&
    p.authors.length > 0 &&
    p.publication_year &&
    typeof p.publication_year === 'number' &&
    p.publication_year > 0 &&
    p.journal
  );
}

// Filter out papers with missing essential data
const papers: PaperData[] = Object.values(papersData).filter(isValidPaper);

// Calculate the actual year range from papers data
const getActualYearRange = (): [number, number] => {
  let minYear = Infinity;
  let maxYear = -Infinity;

  papers.forEach((paper) => {
    if (paper.publication_year !== null && paper.publication_year > 0) {
      if (paper.publication_year < minYear) minYear = paper.publication_year;
      if (paper.publication_year > maxYear) maxYear = paper.publication_year;
    }
  });

  return [minYear === Infinity ? 2010 : minYear, maxYear === -Infinity ? 2025 : maxYear];
};

const actualYearRange = getActualYearRange();

export function usePapersFilter() {
  const [filters, setFilters] = useState<PaperFilters>({
    yearRange: actualYearRange,
    keywords: [],
    studyDesigns: [],
    searchQuery: '',
  });

    const filterOptions = useMemo(() => {
    const allKeywords = new Set<string>();
    const allStudyDesigns = new Set<string>();
    let minYear = Infinity;
    let maxYear = -Infinity;

    papers.forEach((paper) => {
      // Collect unique keywords
      paper.keywords?.forEach((keyword) => allKeywords.add(keyword));

      // Collect unique study designs
      if (paper.structured_data?.methodology?.study_design) {
        allStudyDesigns.add(paper.structured_data.methodology.study_design);
      }

      // Calculate year range (filter out invalid years)
      if (paper.publication_year !== null && paper.publication_year > 0) {
        if (paper.publication_year < minYear) minYear = paper.publication_year;
        if (paper.publication_year > maxYear) maxYear = paper.publication_year;
      }
    });

    return {
      keywords: Array.from(allKeywords).sort(),
      studyDesigns: Array.from(allStudyDesigns).sort(),
      yearRange: [
        minYear === Infinity ? 2010 : minYear, 
        maxYear === -Infinity ? 2025 : maxYear
      ] as [number, number],
    };
  }, []);

    const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
            if (paper.publication_year !== null) {
        if (
          paper.publication_year < filters.yearRange[0] ||
          paper.publication_year > filters.yearRange[1]
        ) {
          return false;
        }
      }

            if (filters.keywords.length > 0) {
        const hasMatchingKeyword = filters.keywords.some((keyword) =>
          paper.keywords?.includes(keyword)
        );
        if (!hasMatchingKeyword) return false;
      }

            if (filters.studyDesigns.length > 0) {
        const studyDesign = paper.structured_data?.methodology?.study_design;
        if (!studyDesign || !filters.studyDesigns.includes(studyDesign)) {
          return false;
        }
      }

            if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = [
          paper.title,
          paper.abstract,
          paper.structured_data?.research_question || '',
          paper.structured_data?.main_conclusion || '',
          ...(paper.keywords || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(query)) return false;
      }

      return true;
    });
  }, [filters]);

    const keywordCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    filterOptions.keywords.forEach((keyword) => {
            const tempFilters = { ...filters, keywords: [keyword] };

            const count = papers.filter((paper) => {
                if (paper.publication_year !== null) {
          if (
            paper.publication_year < tempFilters.yearRange[0] ||
            paper.publication_year > tempFilters.yearRange[1]
          ) {
            return false;
          }
        }

        if (tempFilters.studyDesigns.length > 0) {
          const studyDesign = paper.structured_data?.methodology?.study_design;
          if (!studyDesign || !tempFilters.studyDesigns.includes(studyDesign)) {
            return false;
          }
        }

        if (tempFilters.searchQuery.trim()) {
          const query = tempFilters.searchQuery.toLowerCase();
          const searchableText = [
            paper.title,
            paper.abstract,
            paper.structured_data?.research_question || '',
            paper.structured_data?.main_conclusion || '',
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          if (!searchableText.includes(query)) return false;
        }

                return paper.keywords?.includes(keyword);
      }).length;

      counts[keyword] = count;
    });

    return counts;
  }, [filters, filterOptions.keywords]);

    const studyDesignCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    filterOptions.studyDesigns.forEach((design) => {
      const count = papers.filter((paper) => {
        if (paper.publication_year !== null) {
          if (
            paper.publication_year < filters.yearRange[0] ||
            paper.publication_year > filters.yearRange[1]
          ) {
            return false;
          }
        }

        if (filters.keywords.length > 0) {
          const hasMatchingKeyword = filters.keywords.some((keyword) =>
            paper.keywords?.includes(keyword)
          );
          if (!hasMatchingKeyword) return false;
        }

        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          const searchableText = [
            paper.title,
            paper.abstract,
            paper.structured_data?.research_question || '',
            paper.structured_data?.main_conclusion || '',
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          if (!searchableText.includes(query)) return false;
        }

        return paper.structured_data?.methodology?.study_design === design;
      }).length;

      counts[design] = count;
    });

    return counts;
  }, [filters, filterOptions.studyDesigns]);

  const updateFilters = useCallback((updates: Partial<PaperFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      yearRange: filterOptions.yearRange,
      keywords: [],
      studyDesigns: [],
      searchQuery: '',
    });
  }, [filterOptions.yearRange]);

  return {
    filters,
    filterOptions,
    filteredPapers,
    keywordCounts,
    studyDesignCounts,
    updateFilters,
    resetFilters,
    totalPapers: papers.length,
  };
}
