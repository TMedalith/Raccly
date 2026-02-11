export interface PaperAuthor {
  name: string;
  affiliation: string;
  location: {
    institution: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
}

export interface QuantitativeResult {
  variable_name: string;
  effect_description: string;
  effect_size?: number;
  units?: string;
  direction: 'Positive' | 'Negative' | 'Neutral';
}

export interface Methodology {
  study_design: string;
  sample_size: string;
  instruments_used: string[];
}

export interface StructuredData {
  research_question: string;
  main_conclusion: string;
  methodology: Methodology;
  quantitative_results: QuantitativeResult[];
}

export interface SemanticData {
  research_category: string;
  application_domain: string;
  technologies_applied: string[];
  key_concepts: string[];
  mentioned_entities: {
    missions: string[];
    rovers: string[];
    planets: string[];
    agencies: string[];
  };
}

export interface PaperData {
  paper_id: string;
  doi: string;
  title: string;
  authors: PaperAuthor[];
  publication_year: number;
  publication_date: string;
  journal: string;
  abstract: string;
  keywords: string[];
  structured_data: StructuredData;
  semantic_data: SemanticData;
  full_text_for_embedding: string;
}

export interface PaperFilters {
  yearRange: [number, number];
  keywords: string[];
  studyDesigns: string[];
  searchQuery: string;
}
