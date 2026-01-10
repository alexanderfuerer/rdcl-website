import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component that catches JavaScript errors in child components
 * and displays a fallback UI instead of crashing the entire app.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      const isDE = typeof window !== 'undefined' && localStorage.getItem('rdcl-language') !== 'en';
      return (
        <div className="min-h-[400px] flex items-center justify-center bg-[#f9f8f6]">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl text-red-500">error</span>
            </div>
            <h2 className="font-serif text-2xl mb-3">{isDE ? 'Etwas ist schiefgelaufen' : 'Something went wrong'}</h2>
            <p className="text-[#6b6965] mb-6">
              {isDE ? 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.' : 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              onClick={this.handleRetry}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-secondary-blue transition-colors"
            >
              {isDE ? 'Erneut versuchen' : 'Try again'}
            </button>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-[#6b6965]">
                  Technische Details
                </summary>
                <pre className="mt-2 p-4 bg-black/5 rounded-lg text-xs overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
