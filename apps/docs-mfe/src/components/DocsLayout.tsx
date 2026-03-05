import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { TableOfContents } from './TableOfContents';

interface DocNavItem {
  slug: string;
  title: string;
}

interface DocsLayoutProps {
  children: React.ReactNode;
  currentSlug: string;
  sectionMap: Record<string, { title: string; category: string }>;
  /** Base path for prev/next URLs, e.g. "/docs" or "/docs/components" */
  basePath?: string;
}

/**
 * Docusaurus-style layout for documentation pages.
 * Provides right-side TOC and prev/next navigation.
 */
export function DocsLayout({
  children,
  currentSlug,
  sectionMap,
  basePath = '/docs',
}: DocsLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Build ordered nav list
  const navItems: DocNavItem[] = Object.entries(sectionMap).map(([slug, data]) => ({
    slug,
    title: data.title,
  }));

  const currentIndex = navItems.findIndex((item) => item.slug === currentSlug);
  const prev = currentIndex > 0 ? navItems[currentIndex - 1] : navItems[navItems.length - 1];
  const next = currentIndex < navItems.length - 1 ? navItems[currentIndex + 1] : navItems[0];

  return (
    <div className="docs-layout">
      {/* Main content area */}
      <div className="docs-content-wrapper">
        {/* Compact Top Navigation */}
        <nav className="docs-top-nav" aria-label="Top Pagination">
          <div className="docs-top-nav-prev">
            {prev && (
              <Link
                to={`${basePath}/${prev.slug}`}
                className="docs-top-nav-link"
                title={prev.title}
              >
                <span className="docs-top-nav-arrow aria-hidden">←</span>
                <span className="truncate max-w-[150px] sm:max-w-[200px]">
                  {prev.title.replace(/^\d+\.\s*/, '')}
                </span>
              </Link>
            )}
          </div>
          <div className="docs-top-nav-next text-right">
            {next && (
              <Link
                to={`${basePath}/${next.slug}`}
                className="docs-top-nav-link flex-row-reverse"
                title={next.title}
              >
                <span className="docs-top-nav-arrow aria-hidden">→</span>
                <span className="truncate max-w-[150px] sm:max-w-[200px]">
                  {next.title.replace(/^\d+\.\s*/, '')}
                </span>
              </Link>
            )}
          </div>
        </nav>

        {/* Doc content */}
        <article ref={contentRef} className="docs-article">
          {children}
        </article>

        {/* Prev / Next navigation */}
        <nav className="docs-prev-next" aria-label="Pagination">
          <div>
            {prev && (
              <Link to={`${basePath}/${prev.slug}`} className="docs-nav-link docs-nav-prev">
                <span className="docs-nav-label">Sebelumnya</span>
                <span className="docs-nav-title">{prev.title}</span>
              </Link>
            )}
          </div>
          <div>
            {next && (
              <Link to={`${basePath}/${next.slug}`} className="docs-nav-link docs-nav-next">
                <span className="docs-nav-label">Berikutnya</span>
                <span className="docs-nav-title">{next.title}</span>
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Right-side TOC (desktop only) */}
      <aside className="docs-toc-sidebar">
        <TableOfContents contentRef={contentRef} resetKey={currentSlug} />
      </aside>
    </div>
  );
}
