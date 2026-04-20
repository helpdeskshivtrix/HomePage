function ServiceCards() {
  try {
    const services = [
      {
        icon: 'headphones',
        title: 'Managed IT Support',
        shortDesc: 'IT support and Service',
        features: [
          'On-Site & Remote IT Support',
          'Infra Maintenance & Monitoring',
          'System Updates & Upgrades',
          'Performance Optimization',
          'Help Desk & Ticketing Support'
        ],
        link: 'managed-support.html'
      },
      {
        icon: 'lightbulb',
        title: 'IT Strategy & Consulting',
        shortDesc: 'Strategic technology planning',
        features: [
          'Technology Roadmap Development',
          'Digital Transformation Strategy',
          'Enterprise System Architecture',
          'IT Governance & Standards Compliance',
          'Future Ready & Scalable Solution'
        ],
        link: 'it-consulting.html'
      },
      {
        icon: 'shield',
        title: 'Cloud & Cybersecurity',
        shortDesc: 'Cloud & On-Premises IT Solutions + Security',
        features: [
          'Cloud Infra Dev & Optimization',
          'Comprehensive Security Audits',
          'Threat Detection & Response',
          'Regulatory Compliance Management',
          'End-to-End Data Protection'
        ],
        link: 'cloud-security.html'
      },
      {
        icon: 'cpu',
        title: 'Specialized Tech Solutions',
        shortDesc: 'Technology designed to match your business needs',
        features: [
          'Custom Built Solutions',
          'Deep Industry Expertise',
          'Exclusive VIP Support',
          'Scalable & Flexible Systems',
          'Seamless Integration Services'
        ],
        link: 'specialized-tech.html'
      }
    ];

    return (
      <section data-name="service-cards" data-file="components/ServiceCards.js" style={{"paddingTop":"80px","paddingRight":"0px","paddingBottom":"80px","paddingLeft":"0px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"16px","color":"rgb(0, 0, 0)","backgroundColor":"#ffffff","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="py-20 bg-[var(--light-bg)] tech-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 style={{"paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","marginTop":"0px","marginRight":"0px","marginBottom":"16px","marginLeft":"0px","fontSize":"32px","color":"rgb(15, 23, 41)","backgroundColor":"rgba(0, 0, 0, 0)","textAlign":"center","fontWeight":"700","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="text-4xl font-bold text-[var(--primary-color)] mb-4 neon-glow">Empowering Business Through Limitless Technology</h2>
            <p className="text-xl text-[var(--secondary-color)] max-w-3xl mx-auto">Our services are designed to enhance your operations and ensure seamless connectivity. Experience reliable support and innovative solutions tailored to your needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card-flip h-80 cursor-pointer" 
                   onClick={() => window.location.href = service.link}>
                <div className="card-inner">
                  {/* Front Side */}
                  <div className="card-front glass-morphism">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 bg-gradient-to-r from-[var(--accent-color)] to-[var(--neon-blue)] rounded-full flex items-center justify-center mb-6 neon-glow">
                        <div className={`icon-${service.icon} text-2xl text-white`}></div>
                      </div>
                      <h3 className="text-xl font-bold text-[var(--primary-color)] mb-4 text-center">
                        {service.title}
                      </h3>
                      <p className="text-[var(--secondary-color)] text-center">
                        {service.shortDesc}
                      </p>
                      <div className="mt-4 text-sm text-[var(--accent-color)] font-semibold">
                        Hover to see details →
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="card-back">
                    <div className="flex flex-col justify-center h-full text-white">
                      <h3 className="text-lg font-bold mb-4">{service.title}</h3>
                      <ul className="space-y-2 text-sm">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <div className="icon-check text-[var(--neon-cyan)] mr-2 text-xs"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 text-sm font-semibold text-[var(--neon-cyan)]">
                        Click to learn more
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('ServiceCards component error:', error);
    return null;
  }
}
