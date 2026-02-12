'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PromptPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [hasExistingDeck, setHasExistingDeck] = useState(false);

  useEffect(() => {
    // Check if there's an existing deck in localStorage
    const savedDeck = localStorage.getItem('slidedeck');
    if (savedDeck) {
      try {
        const parsed = JSON.parse(savedDeck);
        const hasSlides = parsed.slides && parsed.slides.length > 0;
        setHasExistingDeck(hasSlides);
      } catch {
        setHasExistingDeck(false);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_HEROKU_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!apiUrl || !apiKey) {
        throw new Error('API URL or API Key not configured. Please check your .env.local file.');
      }

      const result = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          model: 'gpt-4o-2024-08-06',
        }),
      });

      console.log('Response status:', result.status);

      // Try to get error details from the response
      const responseText = await result.text();
      console.log('Response body:', responseText);

      if (!result.ok) {
        let errorDetails = responseText;
        try {
          const errorJson = JSON.parse(responseText);
          errorDetails = errorJson.error || errorJson.message || responseText;
        } catch (e) {
          // Response wasn't JSON, use the text
        }
        throw new Error(`API Error (${result.status}): ${errorDetails}`);
      }

      const data = JSON.parse(responseText);
      console.log('Success data:', data);

      // Parse slides from the response
      let slides = [];
      let deckTitle = 'Slide Deck';

      // Handle API format: { success: true, data: { deckTitle, slides } }
      if (data.success && data.data) {
        deckTitle = data.data.deckTitle || 'Slide Deck';
        if (data.data.slides && Array.isArray(data.data.slides)) {
          slides = data.data.slides.map((slide, index) => {
            // Convert content array to formatted text
            let contentText = '';
            if (Array.isArray(slide.content)) {
              contentText = slide.content.map(item => {
                if (item.type === 'bullet') {
                  return `• ${item.text}`;
                } else if (item.type === 'paragraph') {
                  return item.text;
                } else {
                  return item.text || '';
                }
              }).join('\n');
            } else if (typeof slide.content === 'string') {
              contentText = slide.content;
            }

            return {
              id: slide.id || `${index + 1}`,
              title: slide.title || `Slide ${index + 1}`,
              content: contentText,
              rawContent: slide.content // Keep original structured content
            };
          });
        }
      }

      // Ensure slides have the correct structure
      slides = slides.map((slide, index) => ({
        id: slide.id || `${index + 1}`,
        title: slide.title || `Slide ${index + 1}`,
        content: slide.content || slide.text || slide.body || '',
        rawContent: slide.rawContent || slide.content
      }));

      if (slides.length > 0) {
        // Save to localStorage and navigate to results
        const deckData = {
          deckTitle,
          slides
        };
        localStorage.setItem('slidedeck', JSON.stringify(deckData));
        router.push('/results');
      } else {
        setResponse('No slides were generated. Please try a different prompt.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResponse(`Error: ${errorMessage}`);
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

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="flex-1 flex h-12 items-center justify-center rounded-full bg-black px-6 text-base font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {isLoading ? 'Generating...' : 'Generate Deck'}
            </button>

            {hasExistingDeck && (
              <button
                type="button"
                onClick={() => router.push('/results')}
                disabled={isLoading}
                className="flex h-12 items-center justify-center rounded-full border-2 border-black px-6 text-base font-medium text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                View Last Deck
              </button>
            )}
          </div>
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
