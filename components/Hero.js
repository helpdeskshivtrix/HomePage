function Hero() {
  try {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" 
               data-name="hero" data-file="components/Hero.js">
        
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)] via-[var(--secondary-color)] to-[var(--primary-color)]"></div>
        
        {/* Animated Background Elements */}
        <div style={{"paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"16px","color":"#4169e1","backgroundColor":"rgba(0, 0, 0, 0)","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"absolute","top":"0px","left":"0px","right":"0px","bottom":"0px"}} className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--neon-blue)] rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-[var(--accent-color)] rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-[var(--neon-cyan)] rounded-full animate-ping"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center fade-in">
	<h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-wider">
            <span className="bg-gradient-to-r from-[var(--neon-blue)] via-[var(--accent-color)] to-[var(--neon-cyan)] bg-clip-text text-transparent">
              Shivtrix
            </span>
          </h1>
          
          <h2 className="text-xl md:text-3xl font-semibold mb-8 text-gray-300">Developing Tomorrow’s Digital Backbone Today to Enable the Next Generation of Technology</h2>
       <br /> <br /><br /> 
         <p
  style={{
    paddingTop: "0px",
    paddingRight: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px",
    margin: "0 auto 48px", // top: 0, sides: auto, bottom: 48px
    fontSize: "16px",
    color: "rgb(156, 163, 175)",
    backgroundColor: "rgba(0, 0, 0, 0)",
    textAlign: "center",
    fontWeight: "400",
    objectFit: "fill",
    display: "block",
    position: "static",
    top: "auto",
    left: "auto",
    right: "auto",
    bottom: "auto"
  }}
  className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto"
>
  Unlock the Potential of Your Business with our comprehensive IT Support and Innovative Tech Solutions. Explore how we can help you streamline operations and enhance productivity
</p>


          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = 'services.html'}
              className="px-8 py-4 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--accent-color)] rounded-lg font-semibold neon-glow transition-all">
              Explore Services
            </button>
            
            <button 
              onClick={() => window.location.href = 'contact.html'}
              className="px-8 py-4 border-2 border-[var(--accent-color)] rounded-lg font-semibold hover:bg-[var(--accent-color)]/10 transition-all">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
}
