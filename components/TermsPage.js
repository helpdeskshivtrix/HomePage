function TermsPage() {
  try {
    return (
      <div className="min-h-screen bg-[var(--primary-color)]" data-name="terms-page" data-file="components/TermsPage.js">
        <section className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Terms of Service</h1>
              <p className="text-lg text-[var(--secondary-color)]">Last updated: October 2025</p>
            </div>

            <div className="bg-[var(--tertiary-color)]/50 rounded-xl p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-[var(--secondary-color)] leading-relaxed">
                  By accessing and using Shivtrix services, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
                <p className="text-[var(--secondary-color)] leading-relaxed">
                  Shivtrix provides managed IT services, cloud solutions, cybersecurity, and digital transformation consulting to businesses.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
                <ul className="text-[var(--secondary-color)] space-y-2">
                  <li className="flex items-start">
                    <div className="icon-check text-[var(--accent-color)] mr-2 text-xs mt-1"></div>
                    Provide accurate and complete information
                  </li>
                  <li className="flex items-start">
                    <div className="icon-check text-[var(--accent-color)] mr-2 text-xs mt-1"></div>
                    Maintain confidentiality of access credentials
                  </li>
                  <li className="flex items-start">
                    <div className="icon-check text-[var(--accent-color)] mr-2 text-xs mt-1"></div>
                    Comply with all applicable laws and regulations
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>
                <p className="text-[var(--secondary-color)] leading-relaxed">
                  Shivtrix shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">5. Contact Information</h2>
                <p className="text-[var(--secondary-color)] leading-relaxed">
                  For questions about these Terms, please contact us at helpdesk.shivtrix.co.in@gmail.com
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('TermsPage component error:', error);
    return null;
  }
}
