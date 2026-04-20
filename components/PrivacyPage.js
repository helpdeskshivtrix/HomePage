function PrivacyPage() {
  try {
    return (
      <div className="min-h-screen bg-[var(--primary-color)]" data-name="privacy-page" data-file="components/PrivacyPage.js">
        <section className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
              <p className="text-lg text-[var(--secondary-color)]">Last updated: October 2025</p>
            </div>

            <div className="bg-[var(--tertiary-color)]/50 rounded-xl p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                <p className="text-[var(--secondary-color)] leading-relaxed mb-4">
                  We collect information you provide directly to us, such as when you contact us for services.
                </p>
                <ul className="text-[var(--secondary-color)] space-y-2">
                  <li className="flex items-start">
                    <div className="icon-user text-[var(--accent-color)] mr-2 text-xs mt-1"></div>
                    Contact information (name, email, phone)
                  </li>
                  <li className="flex items-start">
                    <div className="icon-briefcase text-[var(--accent-color)] mr-2 text-xs mt-1"></div>
                    Business information and requirements
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">How We Use Information</h2>
                <ul className="text-[var(--secondary-color)] space-y-2">
                  <li className="flex items-start">
                    <div className="icon-check text-[var(--accent-color)] mr-2 text-xs mt-1"></div>
                    Provide and maintain our services
                  </li>
                  <li className="flex items-start">
                    <div className="icon-check text-[var(--accent-color)] mr-2 text-xs mt-1"></div>
                    Communicate with you about services
                  </li>
                  <li className="flex items-start">
                    <div className="icon-check text-[var(--accent-color)] mr-2 text-xs mt-1"></div>
                    Improve our service offerings
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                <p className="text-[var(--secondary-color)] leading-relaxed">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                <p className="text-[var(--secondary-color)] leading-relaxed">
                  If you have questions about this Privacy Policy, please contact us at helpdesk.shivtrix.co.in@gmail.com
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('PrivacyPage component error:', error);
    return null;
  }
}
