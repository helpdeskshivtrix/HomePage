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
            <h1 className="text-2xl font-bold text-white mb-4">Helpdesk System Error</h1>
            <button onClick={() => window.location.reload()} 
                    className="px-6 py-3 bg-[var(--accent-color)] text-white rounded-lg">
              Restart Helpdesk
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function HelpdeskApp() {
  try {
    return (
      <div className="min-h-screen bg-[var(--primary-color)]" data-name="helpdesk-app" data-file="helpdesk-app.js">
        <Header />
        <HelpdeskPage />
        <Footer />
        <Chatbot />
      </div>
    );
  } catch (error) {
    console.error('HelpdeskApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><HelpdeskApp /></ErrorBoundary>);
