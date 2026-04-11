class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
          <div className="text-center p-8 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
            <div className="icon-alert-triangle text-4xl text-red-500 mb-4"></div>
            <h1 className="text-xl font-bold mb-2">System Error</h1>
            <p className="text-[var(--text-secondary)] mb-4">Application encountered an error</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[var(--accent-blue)] rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  try {
    return (
      <div className="min-h-screen bg-[var(--primary-color)]" data-name="app" data-file="app.js">
        <Header />
        <Hero />
        <ServiceCards />
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><App /></ErrorBoundary>);