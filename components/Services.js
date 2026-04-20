function Services() {
  try {
    const services = [
      {
        icon: 'cloud',
        title: 'Cloud Solutions',
        description: 'Seamless migration and deployment across AWS, Azure, and Google Cloud platforms.',
        features: ['Cloud Migration', 'Hybrid Infrastructure', 'Disaster Recovery', 'Performance Optimization'],
        color: 'from-blue-500 to-cyan-500'
      },
      {
        icon: 'shield',
        title: 'Cybersecurity',
        description: 'Comprehensive protection with advanced threat detection and compliance management.',
        features: ['Security Audits', 'Threat Detection', 'Compliance Management', 'Employee Training'],
        color: 'from-red-500 to-pink-500'
      },
      {
        icon: 'cpu',
        title: 'Automation & AI',
        description: 'Business process automation and AI-powered analytics for digital transformation.',
        features: ['RPA Solutions', 'AI Analytics', 'IoT Integration', 'Smart Workflows'],
        color: 'from-purple-500 to-violet-500'
      },
      {
        icon: 'server',
        title: 'Managed IT',
        description: '24/7 IT infrastructure management and comprehensive technical support.',
        features: ['Network Management', '24/7 Support', 'Asset Management', 'System Monitoring'],
        color: 'from-green-500 to-emerald-500'
      },
      {
        icon: 'phone',
        title: 'Telecom & Networks',
        description: 'VOIP systems, unified communications, and network infrastructure solutions.',
        features: ['VOIP Systems', 'Network Design', 'VPN Solutions', 'Unified Communications'],
        color: 'from-orange-500 to-amber-500'
      },
      {
        icon: 'monitor',
        title: 'Enterprise Software',
        description: 'Custom CRM, ERP systems and enterprise mobile application development.',
        features: ['Custom CRM/ERP', 'Mobile Apps', 'E-commerce Solutions', 'Software Integration'],
        color: 'from-indigo-500 to-blue-500'
      }
    ];

    return (
      <section className="py-20 bg-[var(--bg-secondary)]" data-name="services" data-file="components/Services.js">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Comprehensive IT solutions designed for modern businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-[var(--bg-tertiary)] rounded-xl p-6 border border-[var(--border-color)] hover-glow transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                  <div className={`icon-${service.icon} text-xl text-white`}></div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-[var(--text-secondary)] mb-4">{service.description}</p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-[var(--text-secondary)]">
                      <div className="icon-check text-[var(--accent-green)] mr-2 text-xs"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button 
              onClick={() => window.location.href = 'services.html'}
              className="px-8 py-4 bg-[var(--accent-purple)] rounded-lg font-semibold hover:bg-purple-600 transition-colors">
              View All Services
            </button>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Services component error:', error);
    return null;
  }
}