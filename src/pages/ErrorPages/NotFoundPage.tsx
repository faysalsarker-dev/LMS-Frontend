import React from "react";
import Lottie from "react-lottie";
import animationData from "@/assets/lotties/error.json";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="flex flex-col items-center text-center"
      >
        {/* Lottie Animation */}
        <div className="w-[90%] max-w-md mx-auto">
          <Lottie
            options={defaultOptions}
            height="100%"
            width="100%"
            speed={0.6} // slower playback speed
          />
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-4 mt-6 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => navigate("/")}
            className="rounded-full px-6 py-3 text-white shadow-lg hover:opacity-90"
          >
            <Home className="mr-2" size={18} /> Go Home
          </Button>

          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="rounded-full bg-secondary border border-white/20 text-white hover:bg-white/10 px-6 py-3"
          >
            <ArrowLeft className="mr-2" size={18} /> Go Back
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default NotFoundPage;
