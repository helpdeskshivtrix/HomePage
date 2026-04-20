function Testimonials() {
  try {
    const testimonials = [
      {
        text: "ShivTrix is just AMAZING. Really knows computers and got us out of a jam. We are remodeling office and they are our go-to tech to upgrade most of everything. Thanks again!",
        author: "SARAH K."
      },
      {
        text: "We have worked with ShivTrix for over 7 years and consider them part of our team. They are responsive to our needs and eager to help resolve our IT related issues. We very much appreciate their partnership and expertise.",
        author: "MICHAEL D."
      },
      {
        text: "The people at ShivTrix are honest, pleasant and smart. They have always responded quickly, given us great service and stay within our budget. We've used them for several years on projects big and small. Highly recommend!",
        author: "JENNIFER S."
      }
    ];

    return (
      <section className="py-20 bg-[var(--secondary-color)]" data-name="testimonials" data-file="components/Testimonials.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Hear from our clients.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="mb-6">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="icon-star text-lg"></div>
                    ))}
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="font-semibold text-[var(--primary-color)]">
                    {testimonial.author}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-[var(--primary-color)] rounded-2xl p-12 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Join our satisfied clients and experience the difference that personalized IT solutions can make for your business.
              </p>
              <button className="btn-primary bg-white text-[var(--primary-color)] hover:bg-gray-100">
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Testimonials component error:', error);
    return null;
  }
}