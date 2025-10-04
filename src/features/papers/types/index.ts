export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  relevance: number;
  url?: string;
  citations: number;
  journal?: string;
}

export interface SearchResponse {
  papers: Paper[];
  totalResults: number;
}
