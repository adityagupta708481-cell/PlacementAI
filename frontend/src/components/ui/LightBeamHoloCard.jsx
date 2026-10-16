import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function LightBeamHoloCard({ children, className = '', maxWidth = 'max-w-md' }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className={`w-full ${maxWidth} relative z-10 ${className}`}
      style={{ perspective: 1500 }}
    >
      <motion.div
        className="relative"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ z: 8 }}
      >
        <div className="relative group">
          {/* Card ambient glow effect */}
          <motion.div
            className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
            animate={{
              boxShadow: [
                "0 0 15px 2px rgba(255,255,255,0.04)",
                "0 0 25px 6px rgba(47,233,43,0.18)",
                "0 0 15px 2px rgba(255,255,255,0.04)"
              ],
              opacity: [0.2, 0.45, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror"
            }}
          />

          {/* Traveling light beam effect */}
          <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none z-20">
            {/* Top light beam */}
            <motion.div
              className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
              initial={{ filter: "blur(2px)" }}
              animate={{
                left: ["-50%", "100%"],
                opacity: [0.3, 0.8, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
              }}
              transition={{
                left: {
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1
                },
                opacity: {
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "mirror"
                },
                filter: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              }}
            />

            {/* Right light beam */}
            <motion.div
              className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
              initial={{ filter: "blur(2px)" }}
              animate={{
                top: ["-50%", "100%"],
                opacity: [0.3, 0.8, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
              }}
              transition={{
                top: {
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: 0.6
                },
                opacity: {
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 0.6
                },
                filter: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 0.6
                }
              }}
            />

            {/* Bottom light beam */}
            <motion.div
              className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
              initial={{ filter: "blur(2px)" }}
              animate={{
                right: ["-50%", "100%"],
                opacity: [0.3, 0.8, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
              }}
              transition={{
                right: {
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: 1.2
                },
                opacity: {
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 1.2
                },
                filter: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 1.2
                }
              }}
            />

            {/* Left light beam */}
            <motion.div
              className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
              initial={{ filter: "blur(2px)" }}
              animate={{
                bottom: ["-50%", "100%"],
                opacity: [0.3, 0.8, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
              }}
              transition={{
                bottom: {
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: 1.8
                },
                opacity: {
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 1.8
                },
                filter: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 1.8
                }
              }}
            />

            {/* Corner glow spots */}
            <motion.div
              className="absolute top-0 left-0 h-[6px] w-[6px] rounded-full bg-white/50 blur-[1px]"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
            />
            <motion.div
              className="absolute top-0 right-0 h-[8px] w-[8px] rounded-full bg-white/70 blur-[2px]"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-[8px] w-[8px] rounded-full bg-white/70 blur-[2px]"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror", delay: 1 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-[6px] w-[6px] rounded-full bg-white/50 blur-[1px]"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.3, repeat: Infinity, repeatType: "mirror", delay: 1.5 }}
            />
          </div>

          {/* Border glow */}
          <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />

          {/* Glass Card body */}
          <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl p-7 sm:p-9 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
            {/* Subtle inner grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.035] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                backgroundSize: '28px 28px'
              }}
            />

            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
