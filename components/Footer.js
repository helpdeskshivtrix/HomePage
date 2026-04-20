function Footer() {
  try {
    // Helper function for navigation if this component is used within a framework that requires programmatic navigation (e.g., React Router)
    // If using vanilla HTML links (href="..."), this function might not be strictly necessary, 
    // but the original request implies a function context.
    const navigateToPage = (url) => {
        // This is a placeholder for actual navigation logic
        console.log(`Navigating to ${url}`);
        // If in a browser environment, standard links handle navigation, but if you need to use the onClick handler:
        window.location.href = url; 
    };
    
    return (
      <footer className="bg-black border-t border-[var(--neon-blue)]/30 py-12" data-name="footer" data-file="components/Footer.js">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            {/* Brand Section */}
            <div className="md:col-span-2">
              {/* Implemented the logo from the user's header component snippet */}
             
<div
              className="flex items-center cursor-pointer"
              onClick={() => navigateToPage('helpdesk.html')}
              >
                <img
                  src="/shivtrix-logo.png"
                  alt="Shivtrix Logo"
                  className="h-16 w-auto" // Set height to h-16 as specified in the header snippet
                />
                {/* Removed the original generic icon div and h3 text as the logo likely covers this */}
              </div>

              <p className="text-gray-400 mb-6 max-w-md">
                Developing Tomorrow’s Digital Backbone Today to Enable the Next Generation of Technology.
              </p>

              {/* Social Icons */}
              <div className="flex space-x-4">

                {/* Twitter / X */}
                <a
                  href="https://x.com/ShivtrixTech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[var(--neon-blue)] transition-colors cursor-pointer"
                >
                  <div className="icon-twitter text-sm text-white"></div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/shivtrix-tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[var(--neon-blue)] transition-colors cursor-pointer"
                >
                  <div className="icon-linkedin text-sm text-white"></div>
                </a>

              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="managed-support.html" className="hover:text-[var(--neon-blue)] transition-colors">Managed IT Services</a></li>
                <li><a href="it-consulting.html" className="hover:text-[var(--neon-blue)] transition-colors">IT Strategy & Consulting</a></li>
                <li><a href="cloud-security.html" className="hover:text-[var(--neon-blue)] transition-colors">Cloud & Cybersecurity Solutions</a></li>
                <li><a href="specialized-tech.html" className="hover:text-[var(--neon-blue)] transition-colors">Specialized Tech Solutions</a></li>
              </ul>
            </div>

            {/* Note: The Services section was duplicated in the original prompt. Assuming you want 3 columns total: Brand, Services, Company. If you need 4, add content to this 3rd column. I am removing the duplicate. */}

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="about.html" className="hover:text-[var(--neon-blue)] transition-colors">About Us</a></li>
                <li><a href="contact.html" className="hover:text-[var(--neon-blue)] transition-colors">Contact Us</a></li>
                <li><a href="privacy.html" className="hover:text-[var(--neon-blue)] transition-colors">Privacy Policy</a></li>
                <li><a href="terms.html" className="hover:text-[var(--neon-blue)] transition-colors">Terms of Service</a></li>
                <li><a href="blog.html" className="hover:text-[var(--neon-blue)] transition-colors">Faq</a></li>
<li><a href="helpdesk.html" className="hover:text-[var(--neon-blue)] transition-colors">Helpdesk</a></li>
           
              </ul>
            </div>

          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 pt-8 mt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 Shivtrix. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error("Error rendering Footer component:", error);
    return null;
  }
}

export default Footer;
