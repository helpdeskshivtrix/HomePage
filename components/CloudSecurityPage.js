function CloudSecurityPage() {
  try {
    const solutions = [
      { icon: 'cloud', title: 'Cloud Migration', desc: 'Seamless Migration to cloud platforms' },
      { icon: 'shield', title: 'Security Audits', desc: 'Comprehensive vulnerability assessments' },
      { icon: 'eye', title: 'Threat Detection', desc: 'Real-time monitoring and alerts' },
      { icon: 'layers', title: 'Compliance', desc: 'Meet Industry Compliance & Security standards' }
    ];

    return (
      <div className="min-h-screen bg-[var(--primary-color)] relative" data-name="cloud-security-page" data-file="components/CloudSecurityPage.js">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 slide-up">
                <span className="bg-gradient-to-r from-emerald-400 to-[var(--neon-cyan)] bg-clip-text text-transparent neon-glow">
                  Cloud & Cybersecurity
                </span>
              </h1>
              <p className="text-xl text-[var(--secondary-color)] max-w-3xl mx-auto slide-up">
                Secure cloud solutions and comprehensive cybersecurity protection
              </p>
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {solutions.map((solution, index) => (
                <div key={index} className="bg-[var(--tertiary-color)]/50 backdrop-blur-md border border-[var(--accent-color)]/30 rounded-xl p-8 hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-[var(--neon-cyan)] rounded-lg flex items-center justify-center mb-6 neon-glow">
                    <div className={`icon-${solution.icon} text-2xl text-white`}></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{solution.title}</h3>
                  <p className="text-[var(--secondary-color)]">{solution.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-[var(--tertiary-color)]/70 backdrop-blur-md border border-[var(--accent-color)]/50 rounded-2xl p-12">
              <h2 className="text-3xl font-bold text-white mb-6">Protect Your Cloud Ecosystem</h2>
              <button 
                onClick={() => window.location.href = 'contact.html'}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-[var(--neon-cyan)] text-white rounded-lg font-semibold hover:scale-105 transition-all neon-glow"
              >
                Secure Now
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('CloudSecurityPage component error:', error);
    return null;
  }
}
