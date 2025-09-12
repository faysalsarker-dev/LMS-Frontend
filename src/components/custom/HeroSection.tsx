import { Button } from "@/components/ui/button";
import msg from "@/assets/msg.jpg";
import arrow from "@/assets/arow.jpg";
import BG_LG from "@/assets/bg.png";
import BG_MOBILE from "@/assets/bg_mobile.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
     
     {/* Side gradient overlays */}
<div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-black/10 to-transparent -z-20" />
<div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-black/10 to-transparent -z-20" />

      {/* Background images */}
      <img
        src={BG_LG}
        alt="Background"
        className="absolute inset-0 hidden md:block w-full h-full object-cover opacity-10"
      />
      <img
        src={BG_MOBILE}
        alt="Background Mobile"
        className="absolute inset-0 md:hidden w-full h-full object-cover opacity-10"
      />

      {/* Gradient overlays */}
      {/* <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div> */}

      {/* Decorative corner images */}
      <img
        src={msg}
        alt="Message Decoration"
        className="absolute top-10 -right-10 rotate-6 w-28 md:w-44 lg:w-52 animate-float opacity-80"
      />
      <img
        src={arrow}
        alt="Arrow Decoration"
        className="absolute bottom-10 -left-10 rotate-2 w-24 md:w-36 lg:w-44 animate-float-slow opacity-80"
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-foreground">
            Master <span className="text-primary">English</span> & Speak With{" "}
            <span className="text-accent">Confidence</span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl">
            Join thousands of learners worldwide. Build fluency, expand your vocabulary, 
            and open doors to global opportunities with our expert-designed courses.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="group px-8 py-6 bg-gradient-primary hover:bg-primary/10 text-white shadow-lg hover:shadow-xl"
            >
              Get Started
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 border-2 border-primary text-primary bg-primary/10 hover:bg-primary/20"
            >
              Explore Courses
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
