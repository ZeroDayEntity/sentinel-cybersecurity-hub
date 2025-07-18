export interface HeaderStatus {
    present: boolean;
    details?: string;
}

export interface WebsiteScanData {
    url: string;
    headers: {
        [key: string]: HeaderStatus;
    };
}

export interface WebsiteAnalyzerState {
    scanData: WebsiteScanData | null;
    error: string | null;
    analysis: string;
    setScanData: (data: WebsiteScanData | null) => void;
    setError: (error: string | null) => void;
    setAnalysis: (analysis: string) => void;
}
