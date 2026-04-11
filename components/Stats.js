function Stats() {
  try {
    const stats = [
      { number: '500+', label: 'Projects Completed', icon: 'briefcase' },
      { number: '99%', label: 'Client Satisfaction', icon: 'smile' },
      { number: '24/7', label: 'Support Available', icon: 'clock' },
      { number: '15+', label: 'Years Experience', icon: 'award' }
    ];

    return (
      <section className="py-20 bg-[var(--bg-primary)]" data-name="stats" data-file="components/Stats.js">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] rounded-full flex items-center justify-center mx-auto mb-4 glow-effect">
                  <div className={`icon-${stat.icon} text-xl text-white`}></div>
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-[var(--text-secondary)] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Stats component error:', error);
    return null;
  }
}