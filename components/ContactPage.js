function ContactPage() {
  try {
    const [formData, setFormData] = React.useState({
      name: '',
      email: '',
      mobile: '',
      message: ''
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitStatus, setSubmitStatus] = React.useState('');

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus('');

      try {
        if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim() || !formData.message.trim()) {
          throw new Error('Please fill in all required fields');
        }

        await window.EmailService.sendContactEmail(formData);

        setSubmitStatus('success');
        setFormData({ name: '', email: '', mobile: '', message: '' });
      } catch (error) {
        console.error('Contact form error:', error);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    };

    // ⭐ UPDATED CONTACT REDIRECTS
    const contactMethods = [
      {
        icon: 'phone',
        title: 'WhatsApp Support',
        value: '+91 9593594429',
        color: 'from-green-500 to-emerald-500',
        link: 'https://wa.me/919593594429'
      },
      {
        icon: 'phone',
        title: 'Call Support',
        value: '+91 9593594429',
        color: 'from-blue-500 to-indigo-500',
        link: 'tel:9593594429'
      },
      {
        icon: 'mail',
        title: 'Email Support',
        value: 'helpdesk.shivtrix.co.in@gmail.com',
        color: 'from-purple-500 to-pink-500',
        link: 'mailto:helpdesk.shivtrix.co.in@gmail.com'
      },
      {
        icon: 'map-pin',
        title: 'Location',
        value: 'Mumbai, India',
        color: 'from-orange-500 to-red-500'
      }
    ];

    return (
      <div className="min-h-screen bg-[var(--primary-color)] relative" data-name="contact-page">
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] bg-clip-text text-transparent mb-6 slide-up">
                Get In Touch
              </h1>
              <p className="text-xl text-[var(--secondary-color)] max-w-3xl mx-auto slide-up" style={{ animationDelay: '0.2s' }}>
                Ready to transform your business with cutting-edge technology solutions?
                <br />Let's start the conversation.
              </p>
            </div>

            {/* ⭐ CONTACT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--tertiary-color)]/50 rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 slide-up block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <div className={`icon-${method.icon} text-2xl text-white`}></div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{method.title}</h3>
                  <p className="text-[var(--secondary-color)]">{method.value}</p>
                </a>
              ))}
            </div>

            {/* ⭐ CONTACT FORM */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-[var(--tertiary-color)]/50 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Send Us a Message</h2>

                {submitStatus === 'success' && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6 text-green-300 text-center">
                    <div className="icon-check-circle text-xl mb-2"></div>
                    Message sent successfully! We'll get back to you within 4–8 hours, or WhatsApp us.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-300 text-center">
                    <div className="icon-alert-circle text-xl mb-2"></div>
                    Failed to send message. Contact us directly using the Email or Call buttons above.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* ⭐ UPDATED NAME + EMAIL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name or Your Company Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--primary-color)]/50 border border-[var(--accent-color)]/30 rounded-lg text-black placeholder-[var(--secondary-color)] focus:border-[var(--accent-color)] outline-none transition-all"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--primary-color)]/50 border border-[var(--accent-color)]/30 rounded-lg text-black placeholder-[var(--secondary-color)] focus:border-[var(--accent-color)] outline-none transition-all"
                    />
                  </div>

                  {/* ⭐ REPLACED — Company Name → Mobile Number */}
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--primary-color)]/50 border border-[var(--accent-color)]/30 rounded-lg text-black placeholder-[var(--secondary-color)] focus:border-[var(--accent-color)] outline-none transition-all"
                  />

                  <textarea
                    name="message"
                    placeholder="Tell us about your IT needs..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    required
                    className="w-full px-4 py-3 bg-[var(--primary-color)]/50 border border-[var(--accent-color)]/30 rounded-lg text-black placeholder-[var(--secondary-color)] focus:border-[var(--accent-color)] outline-none resize-none transition-all"
                  ></textarea>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-[var(--accent-color)] to-[var(--tertiary-color)] text-white rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin icon-loader mr-2"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <div className="icon-send mr-2"></div>
                        Send Message
                      </>
                    )}
                  </button>

                </form>
              </div>
            </div>

          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('ContactPage component error:', error);
    return null;
  }
}
