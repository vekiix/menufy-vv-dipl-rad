"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute inset-0">
        {/* Subtle floating shapes */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full blur-3xl opacity-30"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "10%", left: "10%" }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-25"
          animate={{
            y: [0, 40, 0],
            x: [0, -25, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "15%", right: "10%" }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full blur-3xl opacity-20"
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "50%", left: "5%" }}
        />

    

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="text-5xl lg:text-6xl font-bold mb-8 leading-tight text-gray-900"
            >
              meet <span className="text-6xl lg:text-7xl italic font-bold text-orange-600">Menufy</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="text-xl lg:text-2xl text-gray-600 leading-relaxed mb-8 font-light"
            >
              Transform your restaurant with <span className="text-orange-500 font-medium">contactless NFC ordering</span>, real-time kitchen updates, and automated payment processing. Say goodbye to long queues and hello to <span className="text-orange-500 font-medium">3x faster service</span> that keeps customers coming back.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 items-start"
            >
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/demo"
                className="px-8 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
               Demo
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/login"
                className="px-8 py-4 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Get Started
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column - Phone NFC Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="relative flex justify-center items-center"
          >
            {/* Main container */}
            <div className="relative w-80 h-96 flex items-center justify-center">
              
              {/* NFC Tag (Table) */}
            <motion.div
                className="absolute top-14 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg flex items-center justify-center border-2 border-gray-300"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                {/* NFC Symbol */}
                <motion.div
                  className="text-2xl text-gray-600"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  NFC
                </motion.div>
                
                {/* NFC Tag Waves - Phase 1: 0-25% */}
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-orange-400"
                  animate={{ 
                    scale: [1, 1.3, 1, 1],
                    opacity: [0, 0.8, 0, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    times: [0, 0.125, 0.25, 0.26],
                    ease: "easeOut" 
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-orange-300"
                  animate={{ 
                    scale: [1, 1.5, 1, 1],
                    opacity: [0, 0.6, 0, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    times: [0.03, 0.135, 0.25, 0.26],
                    ease: "easeOut" 
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-orange-200"
                  animate={{ 
                    scale: [1, 1.7, 1, 1],
                    opacity: [0, 0.4, 0, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    times: [0.06, 0.16, 0.25, 0.26],
                    ease: "easeOut" 
                  }}
                />
              </motion.div>

              {/* Phone */}
              <motion.div
                className="relative w-40 h-64 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl shadow-2xl flex flex-col items-center justify-between p-3"
                initial={{ y: -50, opacity: 0 }}
                animate={{ 
                  y: [-10, -10, -10, 10, 10, -10],
                  opacity: 1
                }}
                transition={{ 
                  delay: 0.3,
                  duration: 1,
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    times: [0, 0.2, 0.25, 0.45, 0.5, 1],
                    ease: "easeInOut"
                  }
                }}
              >
                {/* Phone Screen */}
                <motion.div
                  className="w-full h-full bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-inner flex flex-col items-center justify-center relative overflow-hidden"
                >
                  {/* Phone NFC scan waves - Phase 2: 20-45% (overlaps with NFC tag for 0.2s) */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 1 }}
                    animate={{ 
                      opacity: [0, 1, 1, 1, 0, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      times: [0, 0.2, 0.225, 0.425, 0.45, 1],
                      ease: "easeInOut"
                    }}
                  >
                    {/* NFC Center Indicator */}
                    <motion.div
                      className="absolute flex items-center justify-center"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [1, 1.1, 1.2, 1, 1],
                        opacity: [0, 0.8, 0.9, 0.9, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        times: [0, 0.15, 0.25, 0.5, 0.55],
                        ease: "easeIn"
                      }}
                    >
                      {/* Green checkmark - successful connection */}
                      <motion.div
                        className="absolute w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg flex items-center justify-center"
                        animate={{ 
                          opacity: [0.6, 0.8, 1, 1, 1, 1, 0.8],
                          scale: [0.8, 1.1, 1.2, 1, 1]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          times: [0, 0.15, 0.25, 0.5, 0.55],
                          ease: "easeOut"
                        }}
                      >
                        <svg 
                          className="w-2.5 h-2.5 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          strokeWidth="3"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                      </motion.div>
                    </motion.div>
                    
                    {/* Inner wave */}
                
                  </motion.div>

                  {/* Menu Interface - Phase 3: 40-100% - Extended to fill remaining time */}
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    animate={{ 
                      opacity: [0, 0, 1, 1, 1, 0, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      times: [0, 0.4, 0.45, 0.9, 0.95, 1, 1],
                      ease: "easeInOut"
                    }}
                  >
                    {/* Menufy text */}
                    <motion.div
                      className="text-sm font-bold text-gray-800 mb-3"
                      animate={{ 
                        scale: [0, 0, 1, 1, 1, 0, 0],
                        opacity: [0, 0, 1, 1, 1, 0, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        times: [0, 0.4, 0.5, 0.9, 0.95, 1, 1],
                        ease: "easeOut"
                      }}
                    >
                      Menufy
                    </motion.div>
                    
                    {/* Menu Lines */}
                    <motion.div
                      className="flex flex-col space-y-2 w-full px-3"
                      animate={{ 
                        y: [20, 20, 0, 0, 0, 20, 20],
                        opacity: [0, 0, 1, 1, 1, 0, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        times: [0, 0.4, 0.55, 0.9, 0.95, 1, 1],
                        ease: "easeOut"
                      }}
                    >
                      {/* Menu line 1 */}
                      <motion.div
                        className="w-full h-2 bg-orange-200 rounded-full"
                        animate={{ 
                          scaleX: [0, 0, 1, 1, 1, 0, 0]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          times: [0, 0.4, 0.6, 0.9, 0.95, 1, 1],
                          ease: "easeOut"
                        }}
                      />
                      {/* Menu line 2 */}
                      <motion.div
                        className="w-4/5 h-2 bg-pink-200 rounded-full"
                        animate={{ 
                          scaleX: [0, 0, 1, 1, 1, 0, 0]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          delay: 0.1,
                          times: [0, 0.4, 0.62, 0.9, 0.95, 1, 1],
                          ease: "easeOut"
                        }}
                      />
                      {/* Menu line 3 */}
                      <motion.div
                        className="w-full h-2 bg-blue-200 rounded-full"
                        animate={{ 
                          scaleX: [0, 0, 1, 1, 1, 0, 0]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          delay: 0.2,
                          times: [0, 0.4, 0.64, 0.9, 0.95, 1, 1],
                          ease: "easeOut"
                        }}
                      />
                      {/* Menu line 4 */}
                      <motion.div
                        className="w-3/4 h-2 bg-purple-200 rounded-full"
                        animate={{ 
                          scaleX: [0, 0, 1, 1, 1, 0, 0]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          delay: 0.3,
                          times: [0, 0.4, 0.66, 0.9, 0.95, 1, 1],
                          ease: "easeOut"
                        }}
                      />
                    </motion.div>
                  </motion.div>

               
                </motion.div>

                {/* Phone button */}
                <div className="w-10 h-1 bg-gray-600 rounded-full mt-1"></div>
              </motion.div>
              {/* Floating UI Elements */}
              <motion.div
                className="absolute top-8 right-8 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shadow-md"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                🍕
              </motion.div>
              
              <motion.div
                className="absolute top-20 left-4 w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center shadow-md"
                animate={{ 
                  x: [0, 20, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                🥤
              </motion.div>
              
              <motion.div
                className="absolute bottom-8 right-12 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shadow-md"
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [0, -180, -360]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                🍔
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
