export type SynthesisDepth = 'spark' | 'core' | 'masterclass';

export interface MentalModel {
  name: string;
  description: string;
  diagramType: 'matrix' | 'compounding' | 'loop' | 'flywheel' | 'inversion';
  visualData?: any;
}

export interface Chapter {
  number: number;
  title: string;
  breakdown: string;
  keyInsight: string;
  anecdote?: string;
}

export interface DialecticCounter {
  opposingThinker: string;
  counterpoint: string;
}

export interface CaseStudy {
  entity: string;
  scenario: string;
  outcome: string;
}

export interface PlaybookStep {
  step: number;
  action: string;
  executionDetail: string;
}

export interface BookSummary {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  year: number;
  category: string;
  readTime: {
    spark: string;
    core: string;
    masterclass: string;
  };
  rating: number;
  cover: {
    bgGradient: string;
    accentColor: string;
    motif: string;
    tagline: string;
    plateUrl?: string;
  };
  spark: {
    executiveThesis: string;
    bottomLine: string;
    threeGoldenRules: string[];
    coreMentalModel: MentalModel;
  };
  core: {
    chapters: Chapter[];
  };
  masterclass: {
    dialecticCritique: {
      authorBlindspots: string;
      counterArguments: DialecticCounter[];
      validityNotes?: string;
    };
    authorBiases: string[];
    caseStudies: CaseStudy[];
    actionPlaybook: PlaybookStep[];
    socraticReflection: string[];
  };
  keyQuotes: Array<{
    quote: string;
    context: string;
  }>;
  isCustomSynthesized?: boolean;
}
