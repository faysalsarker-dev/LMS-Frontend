import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function SimpleCTA() {
  return (
    <section className="relative py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise-texture.png')] opacity-10 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          Ready to Start Learning?
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Join thousands of learners gaining real-world skills — start your journey today.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Link to="/register">
            <Button
              size="lg"
              className="px-8 py-6 text-lg font-semibold rounded-full bg-white text-blue-700 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Start Learning Now
            </Button>
          </Link>

          <Link to="/courses">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg font-semibold rounded-full border-2 border-white/60 text-white hover:bg-white/10 bg-white/20 transition-all duration-300"
            >
              Browse Courses
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Subtle bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
    </section>
  );
}
