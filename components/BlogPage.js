function BlogPage() {
  try {
    const posts = [
 {
        id: 1,
        title: 'SOP-001: Password Reset Procedure',
        excerpt: 'Step-by-step guide for securely resetting user passwords and verifying identity.',
        date: '2025-01-15',
        category: 'Account',
      },
      {
        id: 2,
        title: 'SOP-002: VPN Connectivity Issues',
        excerpt: 'Troubleshoot VPN connection problems including client setup, credentials, and network checks.',
        date: '2025-01-16',
        category: 'Network',
      },
      {
        id: 3,
        title: 'SOP-003: Software Installation Request',
        excerpt: 'How to verify licenses, guide users through installations, and confirm successful setup.',
        date: '2025-01-17',
        category: 'Software',
      },
      {
        id: 4,
        title: 'SOP-004: Email Not Working',
        excerpt: 'Procedure for diagnosing email issues, checking outages, and verifying account settings.',
        date: '2025-01-18',
        category: 'Communication',
      },
      {
        id: 5,
        title: 'SOP-005: Slow Computer',
        excerpt: 'Steps for diagnosing and resolving slow performance due to malware, storage, or hardware.',
        date: '2025-01-19',
        category: 'Hardware',
      },
      {
        id: 6,
        title: 'SOP-006: Printer Not Working',
        excerpt: 'Resolve printer issues related to connectivity, drivers, and hardware faults.',
        date: '2025-01-20',
        category: 'Hardware',
      },
      {
        id: 7,
        title: 'SOP-007: Wi-Fi Connection Issues',
        excerpt: 'Steps to fix Wi-Fi connectivity problems for users and escalate when required.',
        date: '2025-01-21',
        category: 'Network',
      },
      {
        id: 8,
        title: 'SOP-008: Account Locked or Disabled',
        excerpt: 'Instructions for verifying user identity, unlocking accounts, and confirming access.',
        date: '2025-01-22',
        category: 'Account',
      },
      {
        id: 9,
        title: 'SOP-009: File Server or Shared Drive Access Issue',
        excerpt: 'Procedure to verify permissions, network access, and resolve shared drive errors.',
        date: '2025-01-23',
        category: 'Network',
      },
      {
        id: 10,
        title: 'SOP-010: System Update or Patch Request',
        excerpt: 'Ensuring systems stay secure and stable with verified updates and patch deployment.',
        date: '2025-01-24',
        category: 'Maintenance',
      },
      {
        id: 11,
        title: 'SOP-011: Hardware Issue (Keyboard, Mouse, Monitor, etc.)',
        excerpt: 'Guidelines for checking physical connections, replacing faulty devices, and confirming fixes.',
        date: '2025-01-25',
        category: 'Hardware',
      },
      {
        id: 12,
        title: 'SOP-012: New User Setup',
        excerpt: 'Onboarding steps for creating accounts, assigning devices, and providing access credentials.',
        date: '2025-01-26',
        category: 'Onboarding',
      },
    ];

    return (
      <div className="min-h-screen bg-[var(--primary-color)]" data-name="blog-page" data-file="components/BlogPage.js">
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">Tech Insights</h1>
              <p className="text-xl text-[var(--secondary-color)]">Latest trends and insights from our experts</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  {posts.map(post => (
                    <article key={post.id} className="bg-[var(--tertiary-color)]/50 rounded-xl p-8 hover:scale-105 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <span className="px-3 py-1 bg-[var(--accent-color)] text-white text-sm rounded-full">{post.category}</span>
                        <span className="text-[var(--secondary-color)] ml-4">{post.date}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-4">{post.title}</h2>
                      <p className="text-[var(--secondary-color)] mb-6">{post.excerpt}</p>
                      <button className="text-[var(--accent-color)] hover:text-white transition-colors">Read More →</button>
                    </article>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-[var(--tertiary-color)]/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Categories</h3>
                  <ul className="space-y-3">
                    {['Cloud', 'Security', 'Hardware', 'Networks'].map(cat => (
                      <li key={cat}>
                        <a href="#" className="text-[var(--secondary-color)] hover:text-white transition-colors">{cat}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('BlogPage component error:', error);
    return null;
 	 }
}
