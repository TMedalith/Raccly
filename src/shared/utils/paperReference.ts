import papersData from '@/shared/services/papers.json';

export interface PaperData {
  paper_id: string;
  doi: string;
  title: string;
  authors: Array<{
    name: string;
    affiliation: string;
    location: {
      institution: string;
      city: string;
      country: string;
      latitude: number | null;
      longitude: number | null;
    };
  }>;
  publication_year: number | null;
  publication_date: string | null;
  journal: string;
  abstract: string;
  keywords: string[];
  url?: string;   s3_path?: string;   structured_data?: {
    research_question?: string;
    main_conclusion?: string;
    methodology?: {
      study_design?: string;
      sample_size?: string;
      instruments_used?: string[];
    };
    quantitative_results?: Array<{
      variable_name: string;
      effect_description: string;
      effect_size: number | null;
      units: string;
      direction: string;
    }>;
  };
  semantic_data?: {
    research_category?: string;
    application_domain?: string;
    technologies_applied?: string[];
    key_concepts?: string[];
    mentioned_entities?: {
      missions?: string[];
      rovers?: string[];
      planets?: string[];
      agencies?: string[];
    };
  };
}

export function extractPaperIdFromS3Path(s3Path: string): string | null {
  const match = s3Path.match(/pdfs\/(.+?)\.pdf$/i);
  if (!match) return null;
  return match[1];
}

export function getAllPapers(): PaperData[] {
  const papers = papersData as unknown as Record<string, PaperData>;
  return Object.values(papers);
}

export function findPaperById(paperId: string): PaperData | null {
  const papers = papersData as unknown as Record<string, PaperData>;

    if (papers[paperId]) {
    return papers[paperId];
  }

    const keys = Object.keys(papers);
  const matchingKey = keys.find(key =>
    key.toLowerCase().includes(paperId.toLowerCase()) ||
    paperId.toLowerCase().includes(key.toLowerCase())
  );

  return matchingKey ? papers[matchingKey] : null;
}

export function resolvePaperReferences(references: string[]): PaperData[] {
  const results: PaperData[] = [];
  
  for (const ref of references) {
    const paperId = extractPaperIdFromS3Path(ref);
    if (!paperId) continue;
    
    const paper = findPaperById(paperId);
    if (!paper) continue;
    
        results.push({ ...paper, s3_path: ref });
  }
  
  return results;
}

export function formatAuthorsAPA(authors: PaperData['authors']): string {
  if (authors.length === 0) return '';
  if (authors.length === 1) return authors[0].name;
  if (authors.length === 2) return `${authors[0].name} & ${authors[1].name}`;

    const allButLast = authors.slice(0, -1).map(a => a.name).join(', ');
  const last = authors[authors.length - 1].name;
  return `${allButLast}, & ${last}`;
}

export function generateAPACitation(paper: PaperData): string {
  const authors = formatAuthorsAPA(paper.authors);
  const year = paper.publication_year;
  const title = paper.title;
  const journal = paper.journal;
  const doi = paper.doi;

  return `${authors} (${year}). ${title}. ${journal}. https://doi.org/${doi}`;
}

export function generateBibTeXCitation(paper: PaperData): string {
  const firstAuthorLastName = paper.authors[0]?.name.split(' ').pop()?.toLowerCase() || 'unknown';
  const key = `${firstAuthorLastName}${paper.publication_year}`;
  const authors = paper.authors.map(a => a.name).join(' and ');

  return `@article{${key},
  author = {${authors}},
  title = {${paper.title}},
  journal = {${paper.journal}},
  year = {${paper.publication_year}},
  doi = {${paper.doi}}
}`;
}

export function generateMLACitation(paper: PaperData): string {
  const authors = paper.authors.length === 1
    ? paper.authors[0].name
    : paper.authors.length === 2
    ? `${paper.authors[0].name} and ${paper.authors[1].name}`
    : `${paper.authors[0].name}, et al.`;

  return `${authors}. "${paper.title}." ${paper.journal}, ${paper.publication_year}, doi:${paper.doi}.`;
}

export function generateChicagoCitation(paper: PaperData): string {
  const authors = formatAuthorsAPA(paper.authors);

  return `${authors}. "${paper.title}." ${paper.journal} (${paper.publication_year}). https://doi.org/${paper.doi}.`;
}
