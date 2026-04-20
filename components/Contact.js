function Contact() {
  try {
    const [formData, setFormData] = React.useState({
      name: '',
      email: '',
      company: '',
      message: ''
    });

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Form submitted:', formData);
      // Handle form submission here
    };

    return (
      <section id="contact" className="py-20 bg-white" data-name="contact" data-file="components/Contact.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Contact Us
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
              Ready to elevate your IT infrastructure? Get in touch with our expert team today.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-8">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-4">
                    <div className="icon-phone text-xl text-white"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">Phone</h4>
                    <p className="text-[var(--text-secondary)]">+1 312.670.7000</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-4">
                    <div className="icon-mail text-xl text-white"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">Email</h4>
                    <p className="text-[var(--text-secondary)]">info@shivtechnology.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center ACK justify-center mr-4">
                    <div className="icon-clock text-xl text-white"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">Business Hours</h4>
                    <p className="text-[var(--text-secondary)]">Mon-Fri: 8AM-6PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--secondary-color)] rounded-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Tell us about your IT needs..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none resize-none"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="w-full btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Contact component error:', error);
    return null;
  }
}