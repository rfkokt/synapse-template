/* eslint-disable no-undef */
import { useEffect, useState, useRef } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Sticky right-side Table of Contents.
 * Auto-discovers h2/h3 elements inside the content container
 * and highlights the currently visible section.
 */
export function TableOfContents({
  contentRef,
  resetKey,
}: {
  contentRef: React.RefObject<HTMLElement | null>;
  resetKey?: string;
}) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Discover headings on mount and when content changes
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const timer = setTimeout(() => {
      const headings = container.querySelectorAll('h2, h3');
      const tocItems: TocItem[] = [];

      headings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = `heading-${index}-${
            heading.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '') || index
          }`;
        }
        tocItems.push({
          id: heading.id,
          text: heading.textContent || '',
          level: heading.tagName === 'H2' ? 2 : 3,
        });
      });

      setItems(tocItems);
    }, 200);

    return () => clearTimeout(timer);
  }, [contentRef, resetKey]);

  // IntersectionObserver to track active section
  useEffect(() => {
    if (items.length === 0) return;

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible entry
        const visibleEntry = entries.find((e) => e.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    observerRef.current = observer;

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="toc-nav" aria-label="Table of Contents">
      <p className="toc-title">Pada halaman ini</p>
      <ul className="toc-list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`toc-link ${item.level === 3 ? 'toc-link-nested' : ''} ${activeId === item.id ? 'toc-link-active' : ''}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
