import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center mx-auto">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white tracking-tight">
                Something went wrong
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              {this.state.error && (
                <p className="text-zinc-600 text-xs mt-4 bg-zinc-900 rounded-xl p-3 border border-zinc-800 font-mono">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <button
              onClick={this.handleRetry}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full text-sm transition shadow-lg shadow-red-600/20 inline-flex items-center gap-2"
            >
              <RefreshCw size={14} /> Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
