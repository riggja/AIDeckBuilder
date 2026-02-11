'use client';

import { useState } from 'react';

export default function PromptPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');

    try {
      // TODO: Replace with actual API endpoint
      // const result = await fetch('/api/generate-deck', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt }),
      // });
      // const data = await result.json();
      // setResponse(data.response);

      // Placeholder response
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResponse(`Deck generated for: "${prompt}"`);
    } catch (error) {
      setResponse('Error generating deck. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
            AI Deck Builder
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Describe your deck idea and let AI help you build it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="prompt"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Deck Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a red/white aggro deck with 60 cards..."
              rows={6}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-400/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="flex h-12 items-center justify-center rounded-full bg-black px-6 text-base font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {isLoading ? 'Generating...' : 'Generate Deck'}
          </button>
        </form>

        {response && (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
              Result
            </h2>
            <p className="text-base text-zinc-700 dark:text-zinc-300">
              {response}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
