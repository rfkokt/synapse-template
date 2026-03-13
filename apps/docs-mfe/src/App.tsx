import React from 'react';
import './index.css';
import { SharedOriginGuard } from '@synapse/shared-types';
import { ComponentBoundary } from '@synapse/ui-kit';
import { useLocation, Link } from 'react-router-dom';
import { DocsLayout } from './components/DocsLayout';

// ── Documentation Section imports ──
import { DocsLibsSection } from './pages/DocsLibsSection';
import { DocsSidebarRbacSection } from './pages/DocsSidebarRbacSection';
import { DocsMarkdownGuideSection } from './pages/DocsMarkdownGuideSection';

// ── Reusable Components Section imports ──
import { InfoBoxSection } from './pages/components/InfoBoxSection';
import { ComparisonTableSection } from './pages/components/ComparisonTableSection';
import { FeatureGridSection } from './pages/components/FeatureGridSection';
import { UtilitiesSection } from './pages/components/UtilitiesSection';
import { ComponentsOverviewSection } from './pages/components/ComponentsOverviewSection';
import CodeBlockSection from './pages/components/CodeBlockSection';
import CodeBlockTableSection from './pages/components/CodeBlockTableSection';
import { DocsStepSection } from './pages/components/DocsStepSection';
import { ExampleTabsSection } from './pages/components/ExampleTabsSection';
import { ReusableComponentGuideSection } from './pages/components/ReusableComponentGuideSection';
import { UndocumentedSection as SharedComponentsUndocumentedSection } from './pages/components/UndocumentedSection';
import { DocsApiInterceptorsSection } from './pages/DocsApiInterceptorsSection';
import { DocsApiMockingSection } from './pages/DocsApiMockingSection';
import { DocsDynamicRemotesSection } from './pages/DocsDynamicRemotesSection';
import { DocsEnvDarkModeSection } from './pages/DocsEnvDarkModeSection';
import { DocsEventsErrorSection } from './pages/DocsEventsErrorSection';
import { DocsGitPerfSection } from './pages/DocsGitPerfSection';
import { DocsI18nSection } from './pages/DocsI18nSection';
import { DocsMembuatMfeSection } from './pages/DocsMembuatMfeSection';
import { DocsMenambahPackageSection } from './pages/DocsMenambahPackageSection';
import { DocsMenjalankanSection } from './pages/DocsMenjalankanSection';
import { DocsOverviewSection } from './pages/DocsOverviewSection';
import { DocsRoutingSection } from './pages/DocsRoutingSection';
import { DocsSecuritySection } from './pages/DocsSecuritySection';
import { DocsSharedUiKitSection } from './pages/DocsSharedUiKitSection';
import { DocsStrukturSection } from './pages/DocsStrukturSection';
import { DocsTailwindThemeSection } from './pages/DocsTailwindThemeSection';
import { DocsTokenAuthSection } from './pages/DocsTokenAuthSection';
import { DocsWhyMfSection } from './pages/DocsWhyMfSection';

// --- UI Kit Section imports ---
import { BadgeSection } from './pages/ui-kit/BadgeSection';
import { BreadcrumbSection } from './pages/ui-kit/BreadcrumbSection';
import { ButtonSection } from './pages/ui-kit/ButtonSection';
import { CardSection } from './pages/ui-kit/CardSection';
import { ComponentBoundarySection } from './pages/ui-kit/ComponentBoundarySection';
import { DropdownMenuSection } from './pages/ui-kit/DropdownMenuSection';
import { ErrorFallbackSection } from './pages/ui-kit/ErrorFallbackSection';
import { FormFieldSection } from './pages/ui-kit/FormFieldSection';
import { IconSection } from './pages/ui-kit/IconSection';
import { InputSection } from './pages/ui-kit/InputSection';
import { LabelSection } from './pages/ui-kit/LabelSection';
import { ModalSection } from './pages/ui-kit/ModalSection';
import { OverviewSection as UIKitOverviewSection } from './pages/ui-kit/OverviewSection';
import { SearchableSelectSection } from './pages/ui-kit/SearchableSelectSection';
import { SelectSection } from './pages/ui-kit/SelectSection';
import { SkeletonSection } from './pages/ui-kit/SkeletonSection';
import { TableSection } from './pages/ui-kit/TableSection';
import { TabsSection } from './pages/ui-kit/TabsSection';
import { ToastSection } from './pages/ui-kit/ToastSection';
import { TutorialSection } from './pages/ui-kit/TutorialSection';
import { UndocumentedSection as UIKitUndocumentedSection } from './pages/ui-kit/UndocumentedSection';
import { discoveredComponents } from './utils/component-discovery';
import { discoveredSharedComponents } from './utils/shared-component-discovery';

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
    category: 'Getting Started',
  },
  'struktur-proyek': {
    component: DocsStrukturSection,
    title: '1. Struktur Proyek',
    category: 'Getting Started',
  },
  'menjalankan-aplikasi': {
    component: DocsMenjalankanSection,
    title: '2. Menjalankan Aplikasi',
    category: 'Getting Started',
  },
  'membuat-mfe-baru': {
    component: DocsMembuatMfeSection,
    title: '3. Membuat MFE Baru',
    category: 'Getting Started',
  },
  'routing-best-practices': {
    component: DocsRoutingSection,
    title: '4. MFE Routing Best Practices',
    category: 'Getting Started',
  },
  'menambah-package': {
    component: DocsMenambahPackageSection,
    title: '5. Menambah Package Baru',
    category: 'Getting Started',
  },
  'token-auth': {
    component: DocsTokenAuthSection,
    title: '6. Token & Auth Management',
    category: 'Arsitektur',
  },
  'api-interceptors': {
    component: DocsApiInterceptorsSection,
    title: '7. API & Interceptors',
    category: 'Arsitektur',
  },
  'dynamic-remotes': {
    component: DocsDynamicRemotesSection,
    title: '8. Dynamic Remotes & Menu',
    category: 'Arsitektur',
  },
  'shared-ui-kit': {
    component: DocsSharedUiKitSection,
    title: '9. Shared UI Kit & Shadcn',
    category: 'UI & Styling',
  },
  'tailwind-theme': {
    component: DocsTailwindThemeSection,
    title: '10. Tailwind v4 & Theming',
    category: 'UI & Styling',
  },
  'events-error': {
    component: DocsEventsErrorSection,
    title: '11. Custom Events & Error',
    category: 'Panduan Lanjutan',
  },
  'env-dark-mode': {
    component: DocsEnvDarkModeSection,
    title: '12. Environment & Dark Mode',
    category: 'Panduan Lanjutan',
  },
  'git-perf': {
    component: DocsGitPerfSection,
    title: '13. Git Workflow & Perf',
    category: 'Panduan Lanjutan',
  },
  security: {
    component: DocsSecuritySection,
    title: '14. Security Best Practices',
    category: 'Panduan Lanjutan',
  },

  i18n: {
    component: DocsI18nSection,
    title: '15. Internationalization (i18n)',
    category: 'Panduan Lanjutan',
  },
  'api-mocking': {
    component: DocsApiMockingSection,
    title: '16. API Mocking (MSW)',
    category: 'Panduan Lanjutan',
  },
  'libs-workspace': {
    component: DocsLibsSection,
    title: '17. @libs Workspace & Reusability',
    category: 'Arsitektur',
  },
  'sidebar-rbac': {
    component: DocsSidebarRbacSection,
    title: '18. Sidebar RBAC & Roles',
    category: 'Arsitektur',
  },
  'markdown-guide': {
    component: DocsMarkdownGuideSection,
    title: '19. Menulis Docs dengan Markdown',
    category: 'Panduan Lanjutan',
  },
};

/* ─── UI Kit Section Map (documented components) ─── */
export const UIKIT_SECTION_MAP: Record<string, SectionData> = {
  button: { component: ButtonSection, title: 'Button', category: 'Form Controls' },
  input: { component: InputSection, title: 'Input', category: 'Form Controls' },
  formfield: { component: FormFieldSection, title: 'FormField', category: 'Form Controls' },
  label: { component: LabelSection, title: 'Label', category: 'Form Controls' },
  select: { component: SelectSection, title: 'Select', category: 'Form Controls' },
  'searchable-select': {
    component: SearchableSelectSection,
    title: 'SearchableSelect',
    category: 'Form Controls',
  },
  card: { component: CardSection, title: 'Card', category: 'Layout' },
  badge: { component: BadgeSection, title: 'Badge', category: 'Layout' },
  skeleton: { component: SkeletonSection, title: 'Skeleton', category: 'Layout' },
  breadcrumb: { component: BreadcrumbSection, title: 'Breadcrumb', category: 'Layout' },
  table: { component: TableSection, title: 'Table', category: 'Layout' },
  tabs: { component: TabsSection, title: 'Tabs', category: 'Layout' },
  modal: { component: ModalSection, title: 'Modal', category: 'Overlays' },
  toast: { component: ToastSection, title: 'Toast', category: 'Overlays' },
  dropdownmenu: { component: DropdownMenuSection, title: 'DropdownMenu', category: 'Overlays' },
  errorfallback: {
    component: ErrorFallbackSection,
    title: 'ErrorFallback',
    category: 'Utilities',
  },
  componentboundary: {
    component: ComponentBoundarySection,
    title: 'ComponentBoundary',
    category: 'Utilities',
  },
  tutorial: { component: TutorialSection, title: 'Tutorial', category: 'Utilities' },
  icon: { component: IconSection, title: 'Icon', category: 'Utilities' },
};

/* ─── Reusable Components Section Map ─── */
export const COMPONENTS_SECTION_MAP: Record<string, SectionData> = {
  reusableguide: {
    component: ReusableComponentGuideSection,
    title: 'Panduan Reusable Components',
    category: 'Panduan',
  },
  codeblock: { component: CodeBlockSection, title: 'CodeBlock', category: 'Komponen' },
  infobox: { component: InfoBoxSection, title: 'InfoBox', category: 'Komponen' },
  comparisontable: {
    component: ComparisonTableSection,
    title: 'ComparisonTable',
    category: 'Komponen',
  },
  featuregrid: { component: FeatureGridSection, title: 'FeatureGrid', category: 'Komponen' },
  utilities: { component: UtilitiesSection, title: 'Utilities', category: 'Komponen' },
  sectiontitle: { component: UtilitiesSection, title: 'SectionTitle', category: 'Komponen' },
  keyvaluecard: { component: UtilitiesSection, title: 'KeyValueCard', category: 'Komponen' },
  steplist: { component: UtilitiesSection, title: 'StepList', category: 'Komponen' },
  codeblocktable: {
    component: CodeBlockTableSection,
    title: 'CodeBlockTable',
    category: 'Komponen',
  },
  docsstep: { component: DocsStepSection, title: 'DocsStep', category: 'Komponen' },
  exampletabs: { component: ExampleTabsSection, title: 'ExampleTabs', category: 'Komponen' },
};

/** Helper to extract a simple map (slug → component) from a SectionData map */
function toComponentMap(map: Record<string, SectionData>): Record<string, React.FC> {
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.component]));
}

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
      const Section = COMPONENTS_SECTION_MAP[componentName].component;
      return (
        <div className="p-8 mx-auto w-full pb-20">
          <DocsLayout
            currentSlug={componentName}
            sectionMap={COMPONENTS_SECTION_MAP}
            basePath="/docs/components"
          >
            <ComponentBoundary
              fallbackTitle="Section Komponen Gagal Dimuat"
              fallbackDescription="Bagian ini error, tetapi halaman docs lain tetap aman."
            >
              <Section />
            </ComponentBoundary>
          </DocsLayout>
        </div>
      );
    }

    // Undocumented reusable component (auto-discovered)
    if (componentName && componentName !== '') {
      const displayName =
        discoveredSharedComponents.find((c) => c.slug === componentName)?.name || componentName;
      return (
        <div className="p-8 mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <SharedComponentsUndocumentedSection name={displayName} />
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
        <ComponentsOverviewSection
          sectionMap={toComponentMap(COMPONENTS_SECTION_MAP)}
          discoveredComponents={discoveredSharedComponents}
        />
      </div>
    );
  }

  // ── UI Kit Routes: /docs/ui-kit/* ──
  if (sectionSlug === 'ui-kit') {
    const componentName = subSlug || '';

    // Documented component
    if (componentName && componentName in UIKIT_SECTION_MAP) {
      const Section = UIKIT_SECTION_MAP[componentName].component;
      return (
        <div className="p-8 mx-auto w-full pb-20">
          <DocsLayout
            currentSlug={componentName}
            sectionMap={UIKIT_SECTION_MAP}
            basePath="/docs/ui-kit"
          >
            <ComponentBoundary
              fallbackTitle="Section UI Kit Gagal Dimuat"
              fallbackDescription="Komponen ini error, tetapi docs dan MFE lain tetap berjalan."
            >
              <Section />
            </ComponentBoundary>
          </DocsLayout>
        </div>
      );
    }

    // Undocumented component (auto-discovered)
    if (componentName && componentName !== '') {
      const displayName =
        discoveredComponents.find((c) => c.slug === componentName)?.name || componentName;
      return (
        <div className="p-8 mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <UIKitUndocumentedSection name={displayName} />
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
        <UIKitOverviewSection sectionMap={toComponentMap(UIKIT_SECTION_MAP)} />
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

  // 2. Section Page — wrapped in DocsLayout
  if (sectionSlug in DOCS_SECTION_MAP) {
    const data = DOCS_SECTION_MAP[sectionSlug];
    const SectionComponent = data.component;

    return (
      <div className="p-8 mx-auto w-full pb-20">
        <DocsLayout currentSlug={sectionSlug} sectionMap={DOCS_SECTION_MAP}>
          <ComponentBoundary
            fallbackTitle="Section Dokumentasi Gagal Dimuat"
            fallbackDescription="Halaman ini error, tetapi navigation docs tetap aman."
          >
            <SectionComponent />
          </ComponentBoundary>
        </DocsLayout>
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
