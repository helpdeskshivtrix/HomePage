function PortfolioPage() {
  try {
    const [filter, setFilter] = React.useState('all');

    const projects = [
      { id: 1, title: 'Cloud Migration for FinTech', category: 'cloud', tech: ['AWS', 'Docker', 'Kubernetes'], image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400' },
      { id: 2, title: 'Cybersecurity Audit', category: 'security', tech: ['Firewall', 'Penetration Testing'], image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400' },
      { id: 3, title: 'Automation Platform', category: 'automation', tech: ['RPA', 'AI', 'Machine Learning'], image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400' },
      { id: 4, title: 'Network Infrastructure', category: 'network', tech: ['Cisco', 'VPN', 'Firewall'], image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400' },
      { id: 5, title: 'Enterprise Software', category: 'software', tech: ['React', 'Node.js', 'PostgreSQL'], image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400' },
      { id: 6, title: 'Digital Transformation', category: 'transformation', tech: ['IoT', 'Analytics', 'Cloud'], image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400' }
    ];

    const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category === filter);

    return (
      <div className="min-h-screen bg-[var(--primary-color)]" data-name="portfolio-page" data-file="components/PortfolioPage.js">
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 slide-up">Our Portfolio</h1>
              <p className="text-xl text-[var(--secondary-color)] slide-up" style={{animationDelay: '0.2s'}}>Real Results from Real Clients</p>
            </div>

            <div className="flex justify-center mb-12">
              <div className="flex flex-wrap gap-4 justify-center">
                {['all', 'cloud', 'security', 'automation', 'network', 'software', 'transformation'].map(cat => (
                  <button key={cat} onClick={() => setFilter(cat)}
                    className={`px-6 py-2 rounded-lg transition-all ${filter === cat ? 'bg-[var(--accent-color)] text-white' : 'text-[var(--secondary-color)] hover:text-white border border-[var(--accent-color)]/30'}`}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <div key={project.id} className="bg-[var(--tertiary-color)]/50 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 slide-up"
                     style={{animationDelay: `${index * 0.1}s`}}>
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover"/>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map(tech => (
                        <span key={tech} className="px-2 py-1 bg-[var(--accent-color)] text-white text-sm rounded">{tech}</span>
                      ))}
                    </div>
                    <button className="text-[var(--secondary-color)] hover:text-white transition-colors">View Case Study →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('PortfolioPage component error:', error);
    return null;
  }
}
