import type { Paper, SearchResponse } from '../types';

const MOCK_PAPERS: Paper[] = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    authors: ['Vaswani, A.', 'Shazeer, N.', 'Parmar, N.', 'Uszkoreit, J.', 'Jones, L.'],
    year: 2017,
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    relevance: 0.95,
    url: 'https://arxiv.org/abs/1706.03762',
    citations: 89542,
    journal: 'NeurIPS 2017',
  },
  {
    id: '2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: ['Devlin, J.', 'Chang, M.-W.', 'Lee, K.', 'Toutanova, K.'],
    year: 2018,
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.',
    relevance: 0.92,
    url: 'https://arxiv.org/abs/1810.04805',
    citations: 67234,
    journal: 'NAACL 2019',
  },
  {
    id: '3',
    title: 'Language Models are Few-Shot Learners',
    authors: ['Brown, T.', 'Mann, B.', 'Ryder, N.', 'Subbiah, M.'],
    year: 2020,
    abstract: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. We show that scaling up language models greatly improves task-agnostic, few-shot performance, sometimes even reaching competitiveness with prior state-of-the-art fine-tuning approaches.',
    relevance: 0.89,
    url: 'https://arxiv.org/abs/2005.14165',
    citations: 45678,
    journal: 'NeurIPS 2020',
  },
  {
    id: '4',
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['He, K.', 'Zhang, X.', 'Ren, S.', 'Sun, J.'],
    year: 2016,
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.',
    relevance: 0.87,
    url: 'https://arxiv.org/abs/1512.03385',
    citations: 123456,
    journal: 'CVPR 2016',
  },
  {
    id: '5',
    title: 'Generative Adversarial Networks',
    authors: ['Goodfellow, I.', 'Pouget-Abadie, J.', 'Mirza, M.', 'Xu, B.'],
    year: 2014,
    abstract: 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G.',
    relevance: 0.84,
    url: 'https://arxiv.org/abs/1406.2661',
    citations: 78901,
    journal: 'NeurIPS 2014',
  },
  {
    id: '6',
    title: 'ImageNet Classification with Deep Convolutional Neural Networks',
    authors: ['Krizhevsky, A.', 'Sutskever, I.', 'Hinton, G.E.'],
    year: 2012,
    abstract: 'We trained a large, deep convolutional neural network to classify the 1.2 million high-resolution images in the ImageNet LSVRC-2010 contest into the 1000 different classes. On the test data, we achieved top-1 and top-5 error rates of 37.5% and 17.0% which is considerably better than the previous state-of-the-art.',
    relevance: 0.81,
    url: 'https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html',
    citations: 98765,
    journal: 'NeurIPS 2012',
  },
];

export const papersService = {
  /**
   * Busca papers relacionados con una query
   * @param query - El término de búsqueda
   * @returns Promise con los papers relacionados
   */
  async searchPapers(query: string): Promise<SearchResponse> {
        await new Promise((resolve) => setTimeout(resolve, 800));

                    
    return {
      papers: MOCK_PAPERS,
      totalResults: MOCK_PAPERS.length,
    };
  },

  /**
   * Obtiene papers relacionados basados en un paper específico
   * @param paperId - El ID del paper
   * @returns Promise con los papers relacionados
   */
  async getRelatedPapers(paperId: string): Promise<Paper[]> {
        await new Promise((resolve) => setTimeout(resolve, 600));

                
    return MOCK_PAPERS.filter((p) => p.id !== paperId).slice(0, 4);
  },

  /**
   * Obtiene un paper por ID
   * @param paperId - El ID del paper
   * @returns Promise con el paper
   */
  async getPaperById(paperId: string): Promise<Paper | null> {
        await new Promise((resolve) => setTimeout(resolve, 400));

                
    return MOCK_PAPERS.find((p) => p.id === paperId) || null;
  },
};
