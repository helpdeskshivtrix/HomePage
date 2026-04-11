function Header() {
  try {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const navigateToPage = (page) => {
      window.location.href = page;
      setIsMenuOpen(false);
    };

    return (
      <header
        className="bg-black/90 backdrop-blur-md border-b border-[var(--neon-blue)]/30 sticky top-0 z-50"
        data-name="header" data-file="components/Header.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Simple Clean Logo + Shivtrix Text */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigateToPage('helpdesk.html')}
            >
              <img
                src="/shivtrix-logo.png"
                alt="Shivtrix Logo"
                className="h-14 w-auto mr-3 rounded-lg"
              />

              <h1 className="text-2xl font-bold bg-gradient-to-r 
                             from-[var(--neon-blue)] to-[var(--accent-color)]
                             bg-clip-text text-transparent">
                Shivtrix
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <div className="flex items-baseline space-x-6">
                <a
                  onClick={() => navigateToPage('index.html')}
                  className="text-white hover:text-[var(--neon-blue)] transition-colors cursor-pointer font-medium"
                >
                  Home
                </a>
                <a
                  onClick={() => navigateToPage('services.html')}
                  className="text-white hover:text-[var(--neon-blue)] transition-colors cursor-pointer font-medium"
                >
                  Services
                </a>
                <a
                  onClick={() => navigateToPage('about.html')}
                  className="text-white hover:text-[var(--neon-blue)] transition-colors cursor-pointer font-medium"
                >
                  About
                </a>
                <a
                  onClick={() => navigateToPage('helpdesk.html')}
                  className="text-white  hover:text-[var(--neon-blue)] transition-colors cursor-pointer font-medium"
                >
                  Helpdesk
                </a>

                <button
                  onClick={() => navigateToPage('contact.html')}
                  className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--tertiary-color)] transition-all"
                >
                  Free Consultation
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300"
              >
                <div className={`icon-${isMenuOpen ? "x" : "menu"} text-xl`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-[var(--neon-blue)]/30">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a onClick={() => navigateToPage("index.html")} className="block px-3 py-2 text-white">
                Home
              </a>
              <a onClick={() => navigateToPage("services.html")} className="block px-3 py-2 text-white">
                Services
              </a>
              <a onClick={() => navigateToPage("about.html")} className="block px-3 py-2 text-white">
                About
              </a>
              <a onClick={() => navigateToPage("contact.html")} className="block px-3 py-2 text-white">
                Contact
              </a>
            </div>
          </div>
        )}
      </header>
    );
  } catch (error) {
    console.error("Header component error:", error);
    return null;
  }
}
