function SolutionsPage() {
  try {
    const solutions = [
      {
        title: 'IT Infrastructure',
        description: 'Complete infrastructure management and optimization',
        features: ['Network Design', 'Server Management', 'Hardware Setup', 'Performance Monitoring'],
        icon: 'server',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        title: 'Cloud Migration',
        description: 'Seamless transition to cloud platforms',
        features: ['AWS/Azure Setup', 'Data Migration', 'Hybrid Solutions', 'Cost Optimization'],
        icon: 'cloud',
        color: 'from-purple-500 to-pink-500'
      },
      {
        title: 'Security Solutions',
        description: 'Comprehensive cybersecurity protection',
        features: ['Threat Detection', 'Firewall Setup', 'Security Audits', 'Compliance'],
        icon: 'shield',
        color: 'from-red-500 to-orange-500'
      },
      {
        title: 'Business Automation',
        description: 'Streamline operations with intelligent automation',
        features: ['Process Automation', 'AI Integration', 'Workflow Design', 'Analytics'],
        icon: 'cpu',
        color: 'from-green-500 to-emerald-500'
      }
    ];

    return (
      <div className="min-h-screen bg-[var(--primary-color)]" data-name="solutions-page" data-file="components/SolutionsPage.js">
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">Our Solutions</h1>
              <p className="text-xl text-[var(--secondary-color)] max-w-3xl mx-auto">
                Comprehensive technology solutions designed to transform your business operations
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {solutions.map((solution, index) => (
                <div key={index} className="bg-[var(--tertiary-color)]/50 rounded-xl p-8 hover:scale-105 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${solution.color} rounded-lg flex items-center justify-center mb-6`}>
                    <div className={`icon-${solution.icon} text-2xl text-white`}></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{solution.title}</h3>
                  <p className="text-[var(--secondary-color)] mb-6">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-[var(--secondary-color)]">
                        <div className="icon-check text-[var(--accent-color)] mr-2 text-xs"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <button 
                onClick={() => window.location.href = 'contact.html'}
                className="px-8 py-4 bg-gradient-to-r from-[var(--accent-color)] to-[var(--tertiary-color)] text-white rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Get Custom Solution
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('SolutionsPage component error:', error);
    return null;
  }
}
