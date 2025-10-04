'use client';

import { useState } from 'react';
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      // Example POST request to your FastAPI backend or API route
      const response = await fetch('http://127.0.0.1:9000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      setVideoUrl(data.video_url);
      setResult(data.video_url ? "Successfully Created Using Veo3" : JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-4xl font-bold text-center mb-6 tracking-tight">
          Veo 3 Integration
        </h1>

        <textarea
          className="w-full mt-5 h-32 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all duration-300"
          placeholder="Type your creative prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Send'}
        </button>

        <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-5 mb-7">
          <h3 className="text-lg font-semibold mb-3 text-blue-300">Result</h3>
          <div className="whitespace-pre-wrap text-gray-200 text-sm leading-relaxed">
            {result ? result : 'No result yet.'}
          </div>
        </div>

        {videoUrl && (
          <video controls width="600" src={videoUrl} />
        )}
      </div>
    </div>
  );
}
