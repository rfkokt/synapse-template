import { Component, type ReactNode, type ErrorInfo } from 'react';
import { ErrorFallback } from '@synapse/ui-kit';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[MFE Error Boundary]', error, errorInfo);
    // TODO: Report to Sentry
  }

  handleReset = () => {
    // Untuk error terkait module federation atau lazy loading (chunk failed, reference error saat HMR),
    // React lazy caching akan menyimpan state error. Satu-satunya cara recover adalah full reload.
    const errorMsg = this.state.error?.message?.toLowerCase() || '';
    if (
      errorMsg.includes('failed to fetch dynamically imported module') ||
      errorMsg.includes('is not defined') ||
      errorMsg.includes('load failed')
    ) {
      window.location.reload();
      return;
    }

    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <ErrorFallback
          error={this.state.error ?? undefined}
          resetErrorBoundary={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}
