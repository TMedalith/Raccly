import { useState, useMemo, useCallback } from 'react';
import type { PaperData, PaperFilters } from '../types/paper';
import papersData from '@/shared/services/papers.json';

const papers: PaperData[] = Object.values(papersData) as PaperData[];

export function usePapersFilter() {
  const [filters, setFilters] = useState<PaperFilters>({
    yearRange: [2013, 2025],
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
            paper.keywords?.forEach((keyword) => allKeywords.add(keyword));

            if (paper.structured_data?.methodology?.study_design) {
        allStudyDesigns.add(paper.structured_data.methodology.study_design);
      }

            if (paper.publication_year !== null) {
        if (paper.publication_year < minYear) minYear = paper.publication_year;
        if (paper.publication_year > maxYear) maxYear = paper.publication_year;
      }
    });

    return {
      keywords: Array.from(allKeywords).sort(),
      studyDesigns: Array.from(allStudyDesigns).sort(),
      yearRange: [minYear, maxYear] as [number, number],
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
