import HeroSection from "@/components/modules/home/HeroSection";
import TrustBar from "@/components/modules/home/TrustBar";
import WhyChooseSection from "@/components/modules/home/WhyChooseSection";
import LearningPaths from "@/components/modules/home/LearningPaths";
import FeaturedCourse from "@/components/modules/home/FeaturedCourse";
import InstructorSpotlight from "@/components/modules/home/InstructorSpotlight";
import Testimonial from "@/components/custom/Testimonial";
import FaqSection from "@/components/modules/home/FaqSection";
import NewsletterCTA from "@/components/modules/home/NewsletterCTA";

const Home = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero: Introduction & Primary CTA */}
      <HeroSection />

      {/* Trust Bar: Build immediate brand credibility */}
      <TrustBar />

      {/* Why Choose Us: Highlight platform strengths */}
      <WhyChooseSection />

      {/* Learning Paths: Show learning categories or tracks */}
      <LearningPaths />

      {/* Featured Courses: Highlight key offerings */}
      <FeaturedCourse />

      {/* Instructor Section: Humanize and add expertise */}
      {/* <InstructorSpotlight /> */}

      {/* Testimonials: Real learner success stories */}
      <Testimonial />

      {/* FAQ: Clarify common questions */}
      <FaqSection />

      {/* Final CTA: Conversion point */}
      <NewsletterCTA />
    </div>
  );
};

export default Home;
