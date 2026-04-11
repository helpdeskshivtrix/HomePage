function About() {
  try {
    return (
      <section id="about" className="py-20 bg-white" data-name="about" data-file="components/About.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Our
            </h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-[var(--primary-color)]">
              Approach
            </h3>
          </div>

          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed mb-8">
              Working with ShivTrix is never transactional—in fact, we thrive on understanding 
              your company's unique challenges and developing one-of-a-kind solutions to meet your needs.
            </p>
            <button className="btn-secondary">
              Get to Know Us
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[var(--secondary-color)] rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mb-6 mx-auto">
                <div className="icon-users text-2xl text-white"></div>
              </div>
              <h4 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                Personalized Service
              </h4>
              <p className="text-[var(--text-secondary)]">
                We take time to understand your business and provide tailored solutions that fit your specific needs.
              </p>
            </div>

            <div className="bg-[var(--secondary-color)] rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-[var(--accent-color)] rounded-lg flex items-center justify-center mb-6 mx-auto">
                <div className="icon-zap text-2xl text-white"></div>
              </div>
              <h4 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                Rapid Response
              </h4>
              <p className="text-[var(--text-secondary)]">
                Quick response times and proactive support to keep your business running smoothly.
              </p>
            </div>

            <div className="bg-[var(--secondary-color)] rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <div className="icon-award text-2xl text-white"></div>
              </div>
              <h4 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                Proven Expertise
              </h4>
              <p className="text-[var(--text-secondary)]">
                Years of experience delivering reliable technology solutions across various industries.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('About component error:', error);
    return null;
  }
}