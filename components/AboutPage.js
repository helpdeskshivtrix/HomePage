function AboutPage() {
  try {
    const stats = [
      { number: '10K+', label: 'Incidents Resolved', icon: 'briefcase' },
      { number: '100%', label: 'Confidence & Loyalty', icon: 'smile' },
      { number: '24/7', label: 'Helpdesk & VIP Suppot', icon: 'clock' },
      { number: '10+', label: 'Years Experience', icon: 'award' }
    ];

    const values = [
      {
        icon: 'users',
        title: 'Personalized Service',
        description: 'We understand your business and provide tailored solutions that fit your needs.',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        icon: 'zap',
        title: 'Innovation First',
        description: 'Cutting-edge technology solutions that keep your business ahead of the competition.',
        color: 'from-purple-500 to-pink-500'
      },
      {
        icon: 'shield',
        title: 'Security Focused',
        description: 'Comprehensive security measures to protect your data and business operations.',
        color: 'from-green-500 to-emerald-500'
      }
    ];

    return (
      <div className="min-h-screen bg-[var(--primary-color)]" data-name="about-page" data-file="components/AboutPage.js">
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 slide-up">
                <span className="bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">
                  About Shivtrix
                </span>
              </h1>
              <p className="text-xl text-[var(--secondary-color)] max-w-3xl mx-auto slide-up" style={{animationDelay: '0.2s'}}>
                Pioneering the future of managed IT solutions with innovative technology and personalized service.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="w-16 h-16 bg-gradient-to-r from-[var(--accent-color)] to-[var(--secondary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className={`icon-${stat.icon} text-2xl text-white`}></div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-[var(--secondary-color)]">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-[var(--tertiary-color)]/50 rounded-xl p-8 text-center hover:scale-105 transition-all duration-300 slide-up"
                     style={{animationDelay: `${index * 0.2}s`}}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-lg flex items-center justify-center mx-auto mb-6`}>
                    <div className={`icon-${value.icon} text-2xl text-white`}></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                  <p className="text-[var(--secondary-color)]">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('AboutPage component error:', error);
    return null;
  }
}
