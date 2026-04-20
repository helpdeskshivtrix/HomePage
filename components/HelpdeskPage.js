function HelpdeskPage() {
  try {
    const [selectedIssue, setSelectedIssue] = React.useState('');
    const [formData, setFormData] = React.useState({ 
      name: '', 
      email: '', 
      mobile: '', 
      message: '' 
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitStatus, setSubmitStatus] = React.useState('');

    const commonIssues = [
      { id: 'network', title: 'Network Issues', icon: 'wifi', urgent: false },
      { id: 'email', title: 'Email Problems', icon: 'mail', urgent: false },
      { id: 'software', title: 'Software Issues', icon: 'monitor', urgent: false },
      { id: 'security', title: 'Security Concerns', icon: 'shield', urgent: true },
      { id: 'hardware', title: 'Hardware Problems', icon: 'cpu', urgent: false },
      { id: 'backup', title: 'Backup & Recovery', icon: 'database', urgent: true }
    ];

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmitTicket = async () => {
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim() || !formData.mobile.trim()) {
        alert('Please fill in all required fields');
        return;
      }

      // ✅ Mobile number validation
      const mobileRegex = /^[0-9]{10}$/;

      if (!mobileRegex.test(formData.mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await fetch('https://logs.shivtrix.co.in/send-mail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            message: `Issue Type: ${selectedIssue}\nMobile: ${formData.mobile}\n\n${formData.message}`
          })
        });

        const result = await response.json();
        if (response.ok && result.success) {
          setSubmitStatus('success');
          setFormData({ name: '', email: '', mobile: '', message: '' });
        } else {
          setSubmitStatus('error');
        }
      } catch (error) {
        console.error('Submit error:', error);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen bg-[var(--primary-color)]" data-name="helpdesk-page" data-file="components/HelpdeskPage.js">
        <section className="pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Shivtrix Helpdesk</h1>
              <p className="text-xl text-[var(--secondary-color)]">Get immediate IT support for your urgent issues</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-[var(--tertiary-color)]/50 rounded-xl p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Select Your Issue</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {commonIssues.map((issue) => (
                      <button
                        key={issue.id}
                        onClick={() => setSelectedIssue(issue.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedIssue === issue.id
                            ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/20'
                            : 'border-[var(--accent-color)]/30 hover:border-[var(--accent-color)]'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                            issue.urgent ? 'bg-red-500' : 'bg-[var(--accent-color)]'
                          }`}>
                            <div className={`icon-${issue.icon} text-lg text-white`}></div>
                          </div>
                          <div className="text-left">
                            <div className="text-white font-semibold">{issue.title}</div>
                            {issue.urgent && <div className="text-red-400 text-sm">Urgent</div>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedIssue && (
                  <div className="bg-[var(--tertiary-color)]/50 rounded-xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4">Submit Support Ticket</h3>

                    {submitStatus === 'success' && (
                      <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6 text-green-300 text-center">
                        Ticket submitted successfully! We'll contact you soon.
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-300 text-center">
                        Failed to submit ticket. Please try Whatsapp +91 8424008055
                      </div>
                    )}

                    <div className="space-y-4 mb-4">
                      <input
                        type="text" 
                        name="name" 
                        placeholder="Your Name or Your Company Name" 
                        value={formData.name}
                        onChange={handleInputChange} 
                        required
                        className="w-full px-4 py-3 bg-[var(--primary-color)]/50 border border-[var(--accent-color)]/30 rounded-lg text-black placeholder-[var(--secondary-color)] focus:border-[var(--accent-color)] outline-none"
                      />

                      <input
                        type="email" 
                        name="email" 
                        placeholder="Your Email" 
                        value={formData.email}
                        onChange={handleInputChange} 
                        required
                        className="w-full px-4 py-3 bg-[var(--primary-color)]/50 border border-[var(--accent-color)]/30 rounded-lg text-black placeholder-[var(--secondary-color)] focus:border-[var(--accent-color)] outline-none"
                      />

                      <input
                        type="text"
                        name="mobile"
                        placeholder="Mobile Number (10 digits)"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[var(--primary-color)]/50 border border-[var(--accent-color)]/30 rounded-lg text-black placeholder-[var(--secondary-color)] focus:border-[var(--accent-color)] outline-none"
                      />

                      <textarea
                        name="message" 
                        placeholder="Describe your issue in detail..." 
                        value={formData.message}
                        onChange={handleInputChange} 
                        rows="4" 
                        required
                        className="w-full px-4 py-3 bg-[var(--primary-color)]/50 border border-[var(--accent-color)]/30 rounded-lg text-black placeholder-[var(--secondary-color)] focus:border-[var(--accent-color)] outline-none resize-none"
                      ></textarea>
                    </div>

                    <div className="flex gap-4">
                      <button
                        className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                        onClick={() => window.location.href = "tel:+918424008055"}
                      >
                        Call Us: +91 8424008055
                      </button>

                      <button
                        onClick={handleSubmitTicket} 
                        disabled={isSubmitting}
                        className="flex-1 py-3 bg-[var(--accent-color)] text-white rounded-lg font-semibold hover:bg-[var(--tertiary-color)] transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-[var(--tertiary-color)]/50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Emergency Contact</h3>
                  <div className="space-y-4">

                    {/* WhatsApp Button */}
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() =>
                        window.open(`https://wa.me/919593594429?text=${encodeURIComponent(
                          `Hello, I need urgent help regarding: ${selectedIssue}.`
                        )}`)
                      }
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        <div className="icon-phone text-lg text-white"></div>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Whatsapp Support</div>
                        <div className="text-[var(--secondary-color)]">+91 9593594429</div>
                      </div>
                    </div>

                    {/* Email */}
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => window.location.href = "mailto:support@shivtrix.co.in"}
                    >
                      <div className="w-10 h-10 bg-[var(--accent-color)] rounded-lg flex items-center justify-center mr-3">
                        <div className="icon-mail text-lg text-white"></div>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Email Support</div>
                        <div className="text-[var(--secondary-color)] text-sm">support@shivtrix.co.in</div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Response Times */}
                <div className="bg-[var(--tertiary-color)]/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Response Times</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[var(--secondary-color)]">Critical Issues</span>
                      <span className="text-red-400 font-semibold">20 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--secondary-color)]">High Priority</span>
                      <span className="text-yellow-400 font-semibold">1 hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--secondary-color)]">Standard</span>
                      <span className="text-green-400 font-semibold">4 hours</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('HelpdeskPage component error:', error);
    return null;
  }
}
