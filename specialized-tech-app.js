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
            <h1 className="text-2xl font-bold text-white mb-4">Consulting System Error</h1>
            <p className="text-[var(--secondary-color)] mb-4">Consulting module offline...</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--tertiary-color)] transition-colors"
            >
              Restart Consulting
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function SpecializedTechApp() {
  try {
    return (
      <div className="min-h-screen bg-[var(--primary-color)]" data-name="specialized-tech-app" data-file="specialized-tech-app.js">
        <Header />
        <SpecializedTechPage/>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('ITConsultingApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <SpecializedTechApp />
  </ErrorBoundary>
);