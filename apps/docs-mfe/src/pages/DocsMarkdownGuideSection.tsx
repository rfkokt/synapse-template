import { Card, CardContent } from '@synapse/ui-kit';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import sampleDocContent from '../content/sample-doc.md?raw';

/**
 * Example documentation page using Markdown format.
 * This demonstrates how to write new docs in .md files instead of TSX.
 */
export function DocsMarkdownGuideSection() {
  return (
    <Card>
      <CardContent className="pt-6">
        <MarkdownRenderer content={sampleDocContent} />
      </CardContent>
    </Card>
  );
}
