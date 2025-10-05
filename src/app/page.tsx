'use client';

import { useState } from 'react';
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [checkStatus, setCheckStatus] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [downloadingVideo, setDownloadingVideo] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt.');
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:9000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      setResult(data.operation_id|| JSON.stringify(data, null, 2));
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlecheck = async () => {
    if (!result) {
      alert('Please generate first to get an operation ID.');
      return;
    }
    setLoading(true);
    setCheckStatus(true);

    try {
      const id = result.split('/').pop();
      const response = await fetch(`http://127.0.0.1:9000/check/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      setStatus(data.status || null);
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) {
      alert('Please generate first to get an operation ID.');
      return;
    }
    setLoading(true);
    setDownloadingVideo(true);

    try {
      const id = result.split('/').pop();
      const response = await fetch(`http://127.0.0.1:9000/download/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      setVideoUrl(data.video_url || null);
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}`);
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

        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>

          <button
            onClick={handlecheck}
            disabled={loading || !result}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
          >
            Check Status
          </button>

          <button
            onClick={handleDownload}
            disabled={loading || !result}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Downloading...' : 'Download'}
          </button>
        </div>

        <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-5 mb-7">
          <h3 className="text-lg font-semibold mb-3 text-blue-300">Result</h3>
          <div className="whitespace-pre-wrap text-gray-200 text-sm leading-relaxed">
            {result ? 'Operation ID:' + result : 'No result yet.'}
          </div>
          {checkStatus && (
            <div className="whitespace-pre-wrap text-gray-200 text-sm leading-relaxed">
              {status ? 'Operation Status: Done' : 'Operation Status: In Progress'}
            </div>
          )}
          {downloadingVideo && (
            <>
              <video
                className="w-full h-auto mt-4 rounded-lg border border-white/20"
                controls
                src={videoUrl || undefined}
              >
                Downloaded Video
              </video>
            </>
          )}
        </div>          
      </div>
    </div>
  );
}
