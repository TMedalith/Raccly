import { useState, useCallback } from 'react';
import { papersService } from '../services/papers.service';
import type { Paper } from '../types';

export function usePapers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPapers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setPapers([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await papersService.searchPapers(query);
      setPapers(response.papers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar papers');
      setPapers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRelatedPapers = useCallback(async (paperId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const relatedPapers = await papersService.getRelatedPapers(paperId);
      setPapers(relatedPapers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener papers relacionados');
      setPapers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearPapers = useCallback(() => {
    setPapers([]);
    setError(null);
  }, []);

  return {
    papers,
    isLoading,
    error,
    searchPapers,
    getRelatedPapers,
    clearPapers,
  };
}
