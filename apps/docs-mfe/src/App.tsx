import React from 'react';
import './index.css';
import { useLocation, Link } from 'react-router-dom';
import { discoveredComponents } from './utils/component-discovery';
import { SharedOriginGuard } from '@synapse/shared-types';

// ── Documentation Section imports ──
import { DocsOverviewSection } from './pages/DocsOverviewSection';
import { DocsStrukturSection } from './pages/DocsStrukturSection';
import { DocsMenjalankanSection } from './pages/DocsMenjalankanSection';
import { DocsMembuatMfeSection } from './pages/DocsMembuatMfeSection';
import { DocsMenambahPackageSection } from './pages/DocsMenambahPackageSection';
import { DocsTokenAuthSection } from './pages/DocsTokenAuthSection';
import { DocsApiInterceptorsSection } from './pages/DocsApiInterceptorsSection';
import { DocsDynamicRemotesSection } from './pages/DocsDynamicRemotesSection';
import { DocsSharedUiKitSection } from './pages/DocsSharedUiKitSection';
import { DocsTailwindThemeSection } from './pages/DocsTailwindThemeSection';
import { DocsEventsErrorSection } from './pages/DocsEventsErrorSection';
import { DocsEnvDarkModeSection } from './pages/DocsEnvDarkModeSection';
import { DocsGitPerfSection } from './pages/DocsGitPerfSection';
import { DocsSecuritySection } from './pages/DocsSecuritySection';
import { DocsWhyMfSection } from './pages/DocsWhyMfSection';
import { DocsI18nSection } from './pages/DocsI18nSection';
import { DocsApiMockingSection } from './pages/DocsApiMockingSection';
import { DocsRoutingSection } from './pages/DocsRoutingSection';

// ── Reusable Components Section imports ──
import { InfoBoxSection } from './pages/components/InfoBoxSection';
import { ComparisonTableSection } from './pages/components/ComparisonTableSection';
import { FeatureGridSection } from './pages/components/FeatureGridSection';
import { UtilitiesSection } from './pages/components/UtilitiesSection';
import { ComponentsOverviewSection } from './pages/components/ComponentsOverviewSection';
import CodeBlockTableSection from './pages/components/CodeBlockTableSection';
import { DocsStepSection } from './pages/components/DocsStepSection';

// --- UI Kit Section imports ---
import { ButtonSection } from './pages/ui-kit/ButtonSection';
import { InputSection } from './pages/ui-kit/InputSection';
import { CardSection } from './pages/ui-kit/CardSection';
import { BadgeSection } from './pages/ui-kit/BadgeSection';
import { SkeletonSection } from './pages/ui-kit/SkeletonSection';
import { ModalSection } from './pages/ui-kit/ModalSection';
import { ToastSection } from './pages/ui-kit/ToastSection';
import { ErrorFallbackSection } from './pages/ui-kit/ErrorFallbackSection';
import { TutorialSection } from './pages/ui-kit/TutorialSection';
import { FormFieldSection } from './pages/ui-kit/FormFieldSection';
import { BreadcrumbSection } from './pages/ui-kit/BreadcrumbSection';
import { LabelSection } from './pages/ui-kit/LabelSection';
import { SelectSection } from './pages/ui-kit/SelectSection';
import { TableSection } from './pages/ui-kit/TableSection';
import { TabsSection } from './pages/ui-kit/TabsSection';
import { DropdownMenuSection } from './pages/ui-kit/DropdownMenuSection';
import { IconSection } from './pages/ui-kit/IconSection';
import { OverviewSection as UIKitOverviewSection } from './pages/ui-kit/OverviewSection';
import { UndocumentedSection } from './pages/ui-kit/UndocumentedSection';

type SectionData = {
  component: React.FC;
  title: string;
  category: string;
};

/* ─── Docs Section Map ─── */
export const DOCS_SECTION_MAP: Record<string, SectionData> = {
  'kenapa-module-federation': {
    component: DocsWhyMfSection,
    title: '0. Kenapa Module Federation?',
    category: '🚀 Getting Started',
  },
  'struktur-proyek': {
    component: DocsStrukturSection,
    title: '1. Struktur Proyek',
    category: '🚀 Getting Started',
  },
  'menjalankan-aplikasi': {
    component: DocsMenjalankanSection,
    title: '2. Menjalankan Aplikasi',
    category: '🚀 Getting Started',
  },
  'membuat-mfe-baru': {
    component: DocsMembuatMfeSection,
    title: '3. Membuat MFE Baru',
    category: '🚀 Getting Started',
  },
  'routing-best-practices': {
    component: DocsRoutingSection,
    title: '4. MFE Routing Best Practices',
    category: '🚀 Getting Started',
  },
  'menambah-package': {
    component: DocsMenambahPackageSection,
    title: '5. Menambah Package Baru',
    category: '🚀 Getting Started',
  },
  'token-auth': {
    component: DocsTokenAuthSection,
    title: '6. Token & Auth Management',
    category: '🏗️ Arsitektur',
  },
  'api-interceptors': {
    component: DocsApiInterceptorsSection,
    title: '7. API & Interceptors',
    category: '🏗️ Arsitektur',
  },
  'dynamic-remotes': {
    component: DocsDynamicRemotesSection,
    title: '8. Dynamic Remotes & Menu',
    category: '🏗️ Arsitektur',
  },
  'shared-ui-kit': {
    component: DocsSharedUiKitSection,
    title: '9. Shared UI Kit & Shadcn',
    category: '🎨 UI & Styling',
  },
  'tailwind-theme': {
    component: DocsTailwindThemeSection,
    title: '10. Tailwind v4 & Theming',
    category: '🎨 UI & Styling',
  },
  'events-error': {
    component: DocsEventsErrorSection,
    title: '11. Custom Events & Error',
    category: '📚 Panduan Lanjutan',
  },
  'env-dark-mode': {
    component: DocsEnvDarkModeSection,
    title: '12. Environment & Dark Mode',
    category: '📚 Panduan Lanjutan',
  },
  'git-perf': {
    component: DocsGitPerfSection,
    title: '13. Git Workflow & Perf',
    category: '📚 Panduan Lanjutan',
  },
  security: {
    component: DocsSecuritySection,
    title: '14. Security Best Practices',
    category: '📚 Panduan Lanjutan',
  },

  i18n: {
    component: DocsI18nSection,
    title: '15. Internationalization (i18n)',
    category: '📚 Panduan Lanjutan',
  },
  'api-mocking': {
    component: DocsApiMockingSection,
    title: '16. API Mocking (MSW)',
    category: '📚 Panduan Lanjutan',
  },
};

/* ─── UI Kit Section Map (documented components) ─── */
export const UIKIT_SECTION_MAP: Record<string, React.FC> = {
  button: ButtonSection,
  input: InputSection,
  card: CardSection,
  badge: BadgeSection,
  skeleton: SkeletonSection,
  modal: ModalSection,
  toast: ToastSection,
  errorfallback: ErrorFallbackSection,
  formfield: FormFieldSection,
  tutorial: TutorialSection,
  breadcrumb: BreadcrumbSection,
  label: LabelSection,
  select: SelectSection,
  table: TableSection,
  tabs: TabsSection,
  dropdownmenu: DropdownMenuSection,
  icon: IconSection,
};

/* ─── Reusable Components Section Map ─── */
export const COMPONENTS_SECTION_MAP: Record<string, React.FC> = {
  infobox: InfoBoxSection,
  comparisontable: ComparisonTableSection,
  featuregrid: FeatureGridSection,
  utilities: UtilitiesSection,
  codeblocktable: CodeBlockTableSection,
  docsstep: DocsStepSection,
};

/* ═══════════════════════════════════════════════
   Main Page — Router for Docs + UI Kit
   ═══════════════════════════════════════════════ */
export function App() {
  const location = useLocation();
  // Extract segment after /docs (e.g., /docs/struktur-proyek -> "struktur-proyek")
  const segments = location.pathname.split('/');
  const docsIndex = segments.indexOf('docs');
  const sectionSlug = docsIndex !== -1 ? segments[docsIndex + 1] : '';
  const subSlug = docsIndex !== -1 ? segments[docsIndex + 2] : '';

  // ── Reusable Components Routes: /docs/components/* ──
  if (sectionSlug === 'components') {
    const componentName = subSlug || '';

    if (componentName && componentName in COMPONENTS_SECTION_MAP) {
      const Section = COMPONENTS_SECTION_MAP[componentName];
      return (
        <div className="p-8 mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <Section />
          <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex justify-start">
            <Link
              to="/docs/components"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Kembali ke Reusable Components
            </Link>
          </div>
        </div>
      );
    }

    // Components overview
    return (
      <div className="p-8 mx-auto w-full">
        <ComponentsOverviewSection sectionMap={COMPONENTS_SECTION_MAP} />
      </div>
    );
  }

  // ── UI Kit Routes: /docs/ui-kit/* ──
  if (sectionSlug === 'ui-kit') {
    const componentName = subSlug || '';

    // Documented component
    if (componentName && componentName in UIKIT_SECTION_MAP) {
      const Section = UIKIT_SECTION_MAP[componentName];
      return (
        <div className="p-8 mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <Section />
          <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex justify-start">
            <Link
              to="/docs/ui-kit"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Kembali ke UI Kit
            </Link>
          </div>
        </div>
      );
    }

    // Undocumented component (auto-discovered)
    if (componentName && componentName !== '') {
      const displayName =
        discoveredComponents.find((c) => c.slug === componentName)?.name || componentName;
      return (
        <div className="p-8 mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <UndocumentedSection name={displayName} />
          <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex justify-start">
            <Link
              to="/docs/ui-kit"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Kembali ke UI Kit
            </Link>
          </div>
        </div>
      );
    }

    // UI Kit overview
    return (
      <div className="p-8 mx-auto w-full">
        <UIKitOverviewSection sectionMap={UIKIT_SECTION_MAP} />
      </div>
    );
  }

  // ── Docs Routes ──

  // 1. Overview Page
  if (!sectionSlug) {
    return (
      <div className="p-8 mx-auto w-full">
        <DocsOverviewSection sectionMap={DOCS_SECTION_MAP} />
      </div>
    );
  }

  // 2. Section Page
  if (sectionSlug in DOCS_SECTION_MAP) {
    const data = DOCS_SECTION_MAP[sectionSlug];
    const SectionComponent = data.component;

    return (
      <div className="p-8 mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <SectionComponent />

        {/* Simple back navigation footer */}
        <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex justify-start">
          <Link to="/docs" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            ← Kembali ke Daftar Isi
          </Link>
        </div>
      </div>
    );
  }

  // 3. Not Found Fallback
  return (
    <SharedOriginGuard>
      <div className="p-8 mx-auto w-full max-w-4xl text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-neutral-500 mb-6">Bagian dokumentasi yang Anda cari tidak ada.</p>
        <Link to="/docs" className="text-primary-600 hover:underline">
          Kembali ke Panduan Utama
        </Link>
      </div>
    </SharedOriginGuard>
  );
}

export default App;
