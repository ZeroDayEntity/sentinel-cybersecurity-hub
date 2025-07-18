'use client'

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, HelpCircle, Loader, Sparkles, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { analyzeWebsiteHeaders, getAiAnalysis } from '@/app/actions';
import { useWebsiteAnalyzerStore } from '@/lib/hooks/use-website-analyzer-store';

export default function WebsiteAnalyzerPage() {
  const [url, setUrl] = useState('');
  const [isScanning, startScanTransition] = useTransition();
  const [isAnalyzing, startAnalysisTransition] = useTransition();
  const { scanData, analysis, error, setScanData, setAnalysis, setError } = useWebsiteAnalyzerStore();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setScanData(null);
    setAnalysis('');

    startScanTransition(async () => {
      const result = await analyzeWebsiteHeaders(url);
      if (result.error) {
        setError(result.error);
      } else {
        setScanData(result.data);
      }
    });
  };
  
  const handleAiAnalysis = () => {
    if (!scanData) return;
    
    startAnalysisTransition(async () => {
        try {
            const aiResult = await getAiAnalysis(scanData);
            if(aiResult.text) {
                setAnalysis(aiResult.text);
            } else {
                setError("AI analysis failed to produce a result.");
            }
        } catch (e) {
            setError("An error occurred while fetching the AI analysis.");
        }
    })
  }

  const headerExplanations: { [key: string]: string } = {
    'HTTPS Enabled': 'Ensures that communication between the user and the server is encrypted. A fundamental security feature.',
    'Strict-Transport-Security': 'Tells browsers to only connect to your site using HTTPS, protecting against protocol downgrade attacks.',
    'Content-Security-Policy': 'Helps prevent cross-site scripting (XSS) and other code injection attacks by specifying trusted content sources.',
    'X-Frame-Options': 'Protects your visitors against "clickjacking" attacks by controlling whether your site can be embedded in iframes.',
    'X-Content-Type-Options': 'Prevents the browser from MIME-sniffing a response away from the declared content-type, which can lead to security vulnerabilities.',
  };
  
  const renderIcon = (present: boolean) => {
    return present 
      ? <CheckCircle className="h-5 w-5 text-green-500" /> 
      : <XCircle className="h-5 w-5 text-red-500" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Website Health & Header Analysis</CardTitle>
          <CardDescription>Enter a URL to analyze its security headers and overall health.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleScan} className="flex items-center gap-2">
            <Input 
              type="url" 
              placeholder="https://example.com" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isScanning}
            />
            <Button type="submit" disabled={isScanning || !url}>
              {isScanning ? <Loader className="h-4 w-4 animate-spin" /> : 'Scan'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <AnimatePresence>
        {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                <Card className="mt-6 border-red-500/50 bg-red-500/10">
                    <CardHeader className="flex flex-row items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                        <div>
                            <CardTitle className="text-red-400">Scan Failed</CardTitle>
                            <CardDescription className="text-red-400/80">{error}</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            </motion.div>
        )}
        {scanData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Security Header Analysis for <span className="text-primary">{scanData.url}</span></CardTitle>
                <CardDescription>
                  Review the status of critical HTTP security headers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {Object.entries(scanData.headers).map(([key, value]) => (
                    <li key={key} className="flex items-center justify-between p-3 rounded-md bg-slate-900/50">
                       <div className="flex items-center gap-3">
                         {renderIcon(value.present)}
                         <span className="font-medium">{key}</span>
                         <Tooltip>
                           <TooltipTrigger>
                             <HelpCircle className="h-4 w-4 text-muted-foreground" />
                           </TooltipTrigger>
                           <TooltipContent>
                             <p className="max-w-xs">{headerExplanations[key]}</p>
                           </TooltipContent>
                         </Tooltip>
                       </div>
                       <span className={`text-sm font-mono ${value.present ? 'text-green-400' : 'text-red-400'}`}>
                         {value.present ? 'Present' : 'Missing'}
                       </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleAiAnalysis} disabled={isAnalyzing}>
                        {isAnalyzing && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        {!isAnalyzing && <Sparkles className="mr-2 h-4 w-4" />}
                        Analyze with AI
                    </Button>
                </div>
              </CardContent>
            </Card>

            <AnimatePresence>
            {isAnalyzing && !analysis && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader className="h-5 w-5 animate-spin text-primary"/>
                    <p>Sentinel AI is analyzing the results...</p>
                </motion.div>
            )}
            {analysis && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                AI-Powered Risk Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <blockquote className="border-l-2 border-primary pl-4 text-slate-300 italic">
                                {analysis.split('\n').map((line, index) => <p key={index}>{line.replace(/•\s*/, '• ')}</p>)}
                            </blockquote>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
