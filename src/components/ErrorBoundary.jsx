import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl text-center space-y-4 my-4 shadow-2xl">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              {this.props.fallbackTitle || "Une anomalie d'affichage est survenue"}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {this.state.error?.message || "Le module a rencontré un problème inattendu."}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réessayer ce module</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
