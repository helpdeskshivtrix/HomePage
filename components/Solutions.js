function Solutions() {
  try {
    const solutions = [
      {
        icon: 'headphones',
        title: 'Managed Support',
        description: '24/7 comprehensive IT support and maintenance for your business infrastructure.',
        link: '#IT-Support'
      },
      {
        icon: 'lightbulb',
        title: 'IT Strategy + Consulting',
        description: 'Strategic technology planning and consulting to drive your business forward.',
        link: '#Strategy'
      },
      {
        icon: 'shield',
        title: 'Cloud & Cybersecurity',
        description: 'Secure cloud solutions and comprehensive cybersecurity protection.',
        link: '#Cybersecurity'
      },
      {
        icon: 'leaf',
        title: 'Industry Technology',
        description: 'Specialized technology solutions tailored for specific industry needs.',
        link: '#Industry'
      }
    ];

    return (
      <section id="services" className="py-20 bg-[var(--secondary-color)]" data-name="solutions" data-file="components/Solutions.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Our Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="service-card text-center group cursor-pointer">
                <div className="w-16 h-16 bg-[var(--secondary-color)] rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:bg-[var(--primary-color)] transition-colors">
                  <div className={`icon-${solution.icon} text-2xl text-[var(--primary-color)] group-hover:text-white transition-colors`}></div>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                  {solution.title}
                </h3>
                <p className="text-[var(--text-secondary)] mb-4 text-sm">
                  {solution.description}
                </p>
                <div className="flex justify-center">
                  <div className="icon-arrow-right text-[var(--primary-color)] group-hover:translate-x-1 transition-transform"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Professional typing" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="text-left">
                  <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                    We specialize in supporting all sizes of businesses across the US. We empower our clients to 
                    elevate their IT systems, meet the needs of their current team or customers, and help build 
                    a foundation for long-term success.
                  </p>
                  <button className="btn-primary">
                    Call Us To Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Solutions component error:', error);
    return null;
  }
}