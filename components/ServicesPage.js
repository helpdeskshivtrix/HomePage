function ServicesPage() {
  try {
   

const services = [
  {
    icon: 'user-cog',
    title: 'On-Site & Remote IT Support',
    description: 'Expert assistance wherever you need it.',
    features: [
      'Server  Maintenance & Monitoring',
      'System Updates & Upgrades',
      'Help Desk & Ticketing Support',
	'Exclusive VIP Support'
    ]
  },
  {
    icon: 'lightbulb',
    title: 'IT Strategy & Consulting',
    description: 'Strategic planning to drive your business forward.',
    features: [
      'Technology Roadmap Development',
      'Digital Transformation Strategy',
      'IT Governance & Standards Compliance',
      'Future-Ready & Scalable Solutions'
    ]
  },
  {
    icon: 'shield',
    title: 'Cloud & Cybersecurity',
    description: 'Secure cloud solutions and protection for your business.',
    features: [
      'Cloud Migration',
      'Security Audits',
      'Threat Detection & Response',
      'ISO Compliance Standards'
    ]
  },
  {
    icon: 'cpu',
    title: 'Specialized Tech Solutions',
    description: 'Tailored technology for your unique needs.',
    features: [
      'Custom-Built Solutions',
      'Deep Industry Expertise',
      'Compliance-Ready Architecture',
      'Scalable & Flexible Systems'
    ]
  },
  {
    icon: 'network',
    title: 'Networking & VPN',
    description: 'Reliable and secure connectivity across your organization.',
    features: [
      'Network Architect',
      'VPN Solutions Cloud or in-prem',
      'Remote Access Solutions ',
      'LAN Performance Optimization'
    ]
  },
  {
    icon: 'building',
    title: 'Mini Servers & Edge Computing',
    description: 'Compact, energy-efficient, and cost-effective server setups for local data processing and edge computing.',
    features: [
      'Custom Mini Server Deployment',
      'Low-Latency Edge Processing',
      'On-Premise Virtualization',
      'Energy-Efficient Hardware Integration'
    ]
  
  }
];


    return (
      <div className="min-h-screen bg-[var(--primary-color)]" data-name="services-page" data-file="components/ServicesPage.js">
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 slide-up">Our Services</h1>
              <p className="text-xl text-[var(--secondary-color)] slide-up" style={{animationDelay: '0.2s'}}>
                Comprehensive IT solutions for your business transformation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-[var(--tertiary-color)]/50 backdrop-blur-md rounded-xl p-8 hover:scale-105 transition-all duration-300 slide-up"
                     style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="w-16 h-16 bg-gradient-to-r from-[var(--accent-color)] to-[var(--secondary-color)] rounded-lg flex items-center justify-center mb-6">
                    <div className={`icon-${service.icon} text-2xl text-white`}></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-[var(--secondary-color)] mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-[var(--secondary-color)]">
                        <div className="icon-check text-[var(--accent-color)] mr-2 text-xs"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('ServicesPage component error:', error);
    return null;
  }
}
