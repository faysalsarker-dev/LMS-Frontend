import { Marquee } from "../magicui/marquee";
import TestimonialCard from "./TestimonialCard";

const Testimonial = () => {
    return (
           <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of successful learners who have transformed their careers
            </p>
          </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        




 








    <Marquee pauseOnHover className="[--duration:20s] w-full px-2">
          {Array.from({ length: 6 }, (_, index) => (
                <TestimonialCard key={index} />
            ))}
      </Marquee>


    <Marquee pauseOnHover reverse className="[--duration:20s] w-full px-2">
          {Array.from({ length: 6 }, (_, index) => (
                <TestimonialCard key={index} />
            ))}
      </Marquee>

      
 <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-background"></div>
          </div>
        </div>
      </section>
    );
};

export default Testimonial;



