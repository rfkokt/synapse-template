import { Component, type ComponentType, type ErrorInfo, type ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

export interface ComponentBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ComponentBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ComponentBoundary extends Component<ComponentBoundaryProps, ComponentBoundaryState> {
  state: ComponentBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ComponentBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, fallbackTitle, fallbackDescription } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <ErrorFallback
          error={error}
          resetErrorBoundary={this.handleReset}
          title={fallbackTitle}
          description={fallbackDescription}
        />
      );
    }

    return children;
  }
}

export function withComponentBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: Omit<ComponentBoundaryProps, 'children'>
) {
  const SafeComponent = (props: P) => (
    <ComponentBoundary {...options}>
      <WrappedComponent {...props} />
    </ComponentBoundary>
  );

  const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  SafeComponent.displayName = `withComponentBoundary(${wrappedName})`;

  return SafeComponent;
}
