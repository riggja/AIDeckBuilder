'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Slide {
  id?: string;
  title: string;
  content: string;
  rawContent?: any;
}

interface DeckData {
  deckTitle?: string;
  slides: Slide[];
}

export default function ResultsPage() {
  const router = useRouter();
  const [deckTitle, setDeckTitle] = useState('Slide Deck');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load slides from localStorage
    const savedData = localStorage.getItem('slidedeck');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);

        // Handle new format: { deckTitle, slides }
        if (parsed.deckTitle && parsed.slides) {
          setDeckTitle(parsed.deckTitle);
          setSlides(parsed.slides);
        }
        // Handle legacy format: array of slides
        else if (Array.isArray(parsed)) {
          setSlides(parsed);
        }
      } catch (error) {
        console.error('Error parsing slides:', error);
      }
    }
  }, []);

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setIsEditing(false);
    }
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setIsEditing(false);
    }
  };

  const saveDeck = (updatedSlides: Slide[]) => {
    const deckData: DeckData = {
      deckTitle,
      slides: updatedSlides
    };
    localStorage.setItem('slidedeck', JSON.stringify(deckData));
  };

  const handleDeckTitleChange = (value: string) => {
    setDeckTitle(value);
    const deckData: DeckData = {
      deckTitle: value,
      slides
    };
    localStorage.setItem('slidedeck', JSON.stringify(deckData));
  };

  const handleTitleChange = (value: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex].title = value;
    setSlides(updatedSlides);
    saveDeck(updatedSlides);
  };

  const handleContentChange = (value: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex].content = value;
    setSlides(updatedSlides);
    saveDeck(updatedSlides);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  if (slides.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            No slides found
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Please generate a deck first.
          </p>
          <Link
            href="/prompt"
            className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Back to Prompt
          </Link>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-6"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/prompt"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Back to Prompt
          </Link>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Slide {currentSlideIndex + 1} of {slides.length}
          </div>
        </div>

        {/* Deck Title */}
        <div className="mb-6">
          {isEditing ? (
            <input
              type="text"
              value={deckTitle}
              onChange={(e) => handleDeckTitleChange(e.target.value)}
              className="w-full text-2xl font-bold text-black dark:text-zinc-50 bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-zinc-500 dark:focus:border-zinc-400 focus:outline-none pb-2"
            />
          ) : (
            <h1
              className="text-2xl font-bold text-black dark:text-zinc-50 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300"
              onClick={() => setIsEditing(true)}
            >
              {deckTitle}
            </h1>
          )}
        </div>

        {/* Slide Container */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {/* Slide Content */}
          <div className="aspect-video flex flex-col p-12 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
            {/* Title */}
            {isEditing ? (
              <input
                type="text"
                value={currentSlide.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-4xl font-bold text-black dark:text-zinc-50 mb-8 bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-zinc-500 dark:focus:border-zinc-400 focus:outline-none pb-2"
                autoFocus
              />
            ) : (
              <h1
                className="text-4xl font-bold text-black dark:text-zinc-50 mb-8 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300"
                onClick={() => setIsEditing(true)}
              >
                {currentSlide.title}
              </h1>
            )}

            {/* Content */}
            {isEditing ? (
              <textarea
                value={currentSlide.content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="flex-1 text-lg text-zinc-700 dark:text-zinc-300 bg-transparent border-2 border-zinc-300 dark:border-zinc-700 rounded-lg p-4 focus:border-zinc-500 dark:focus:border-zinc-400 focus:outline-none resize-none font-mono"
                rows={10}
                placeholder="Enter slide content here..."
              />
            ) : (
              <div
                className="flex-1 text-lg text-zinc-700 dark:text-zinc-300 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 overflow-y-auto"
                onClick={() => setIsEditing(true)}
              >
                {currentSlide.content.split('\n').map((line, index) => (
                  <div key={index} className="mb-2">
                    {line.trim().startsWith('•') ? (
                      <div className="flex gap-3">
                        <span className="text-zinc-500 dark:text-zinc-500 flex-shrink-0">•</span>
                        <span>{line.trim().substring(1).trim()}</span>
                      </div>
                    ) : line.trim() ? (
                      <p className="mb-2">{line}</p>
                    ) : (
                      <div className="h-2" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between">
              {/* Previous Button */}
              <button
                onClick={handlePrevious}
                disabled={currentSlideIndex === 0}
                className="flex h-10 items-center justify-center rounded-lg bg-zinc-100 px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                ← Previous
              </button>

              {/* Edit Toggle */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex h-10 items-center justify-center rounded-lg border border-zinc-300 px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {isEditing ? 'Done Editing' : 'Edit Slide'}
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={currentSlideIndex === slides.length - 1}
                className="flex h-10 items-center justify-center rounded-lg bg-black px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Next →
              </button>
            </div>

            {/* Keyboard Hint */}
            <div className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
              Use arrow keys (← →) to navigate
            </div>
          </div>
        </div>

        {/* Slide Thumbnails */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlideIndex(index);
                setIsEditing(false);
              }}
              className={`flex-shrink-0 rounded-lg border-2 p-3 transition-all ${
                index === currentSlideIndex
                  ? 'border-black bg-zinc-100 dark:border-white dark:bg-zinc-800'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
              }`}
            >
              <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                {index + 1}
              </div>
              <div className="mt-1 w-24 truncate text-xs text-zinc-600 dark:text-zinc-400">
                {slide.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
