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
        <div className="min-h-screen flex items-center justify-center bg-[var(--primary-color)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">System Error</h1>
            <p className="text-[var(--secondary-color)] mb-4">About module initialization failed...</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--tertiary-color)] transition-colors"
            >
              Reinitialize
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AboutApp() {
  try {
    return (
      <div className="min-h-screen bg-[var(--primary-color)]" data-name="about-app" data-file="about-app.js">
        <Header />
        <AboutPage />
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('AboutApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <AboutApp />
  </ErrorBoundary>
);