"use client";
import { motion } from "framer-motion";

export default function CallToAction() {

  return (
    <section className="py-20 bg-gray-900 text-white text-center relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute inset-0">
        {/* Subtle animated shapes */}
        <motion.div
          className="absolute w-72 h-72 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full blur-3xl opacity-20"
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "5%", right: "10%" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full blur-3xl opacity-15"
          animate={{
            y: [0, 50, 0],
            x: [0, -20, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "10%", left: "5%" }}
        />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Floating particles */}
        <motion.div
          className="absolute top-16 left-1/5 w-2 h-2 bg-white rounded-full opacity-20"
          animate={{
            y: [0, -100, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="absolute top-32 right-1/4 w-1 h-1 bg-white rounded-full opacity-20"
          animate={{
            y: [0, -80, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute bottom-24 left-1/3 w-3 h-3 bg-white rounded-full opacity-15"
          animate={{
            y: [0, -90, 0],
            opacity: [0.1, 0.25, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Ready to get started?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl mb-8 text-gray-300 font-light"
        >
          Transform your restaurant with NFC-powered ordering today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`mailto:vidakovicvedran@gmail.com`} 
            className="px-8 py-4 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}