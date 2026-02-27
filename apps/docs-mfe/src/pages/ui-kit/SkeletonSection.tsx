import { Skeleton, Card, CardContent } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, ExampleTabs } from './shared';

export function SkeletonSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader title="Skeleton" description="Placeholder loading dengan animasi pulse." />
        <PreviewCard>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          </div>
        </PreviewCard>
        <PreviewCard title="Usage" className="mb-0">
          <ExampleTabs
            preview={
              <div className="w-full max-w-md space-y-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            }
            code={`import { Skeleton } from '@synapse/ui-kit';

<Skeleton className="h-12 w-12 rounded-full" />
<Skeleton className="h-4 w-3/4" />`}
            previewClassName="w-full items-start justify-center"
          />
        </PreviewCard>
      </CardContent>
    </Card>
  );
}
