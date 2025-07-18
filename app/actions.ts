'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';
import { WebsiteScanData } from '@/lib/types';

const ai = new GoogleGenerativeAI(process.env.API_KEY || '');


export async function analyzeWebsiteHeaders(url: string): Promise<{ data?: WebsiteScanData, error?: string }> {
  try {
    const response = await fetch(url, { method: 'GET', redirect: 'follow' });
    const headers = response.headers;

    const finalUrl = response.url;
    const isHttps = finalUrl.startsWith('https');

    const scanData: WebsiteScanData = {
      url: finalUrl,
      headers: {
        'HTTPS Enabled': { present: isHttps },
        'Strict-Transport-Security': { present: headers.has('strict-transport-security') },
        'Content-Security-Policy': { present: headers.has('content-security-policy') },
        'X-Frame-Options': { present: headers.has('x-frame-options') },
        'X-Content-Type-Options': { present: headers.has('x-content-type-options') },
      }
    };

    return { data: scanData };
  } catch (error) {
    console.error('Error fetching URL:', error);
    if (error instanceof TypeError && error.message.includes('fetch failed')) {
      return { error: `Could not reach the URL. It might be offline or blocking requests. Note: URLs like 'localhost' cannot be scanned.` };
    }
    return { error: 'An unknown error occurred during the scan.' };
  }
}

export async function getAiAnalysis(scanData: WebsiteScanData) {
    const model = 'gemini-1.5-pro-latest';
    const prompt = `
You are a senior cybersecurity analyst named "Sentinel AI". 
Your task is to analyze the provided HTTP security header scan data for a website.
Based *only* on the data below, provide a summary of the key security risks in three clear, actionable bullet points for a manager.
The tone should be professional, concise, and helpful.
Do not mention headers that are present and correctly configured. Focus only on the risks from the missing headers.
If all headers are present, state that the basic header configuration looks good and suggest further comprehensive security audits.

Scan Data:
${JSON.stringify(scanData, null, 2)}
`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return { text: response.text };
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return { error: 'Failed to get analysis from AI.' };
    }
}
