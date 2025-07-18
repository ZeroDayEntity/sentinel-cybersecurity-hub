import { create } from 'zustand';
import { WebsiteAnalyzerState } from '@/lib/types';

export const useWebsiteAnalyzerStore = create<WebsiteAnalyzerState>((set) => ({
  scanData: null,
  error: null,
  analysis: '',
  setScanData: (data) => set({ scanData: data }),
  setError: (error) => set({ error: error }),
  setAnalysis: (analysis) => set({ analysis: analysis }),
}));
