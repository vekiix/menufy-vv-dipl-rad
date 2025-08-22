"use client";
import { motion } from "framer-motion";

const features = [
  {
    icon: "📱",
    title: "NFC-Powered Ordering",
    description: "Customers tap their phones on NFC chips to instantly access menus without downloading apps"
  },
  {
    icon: "⚡",
    title: "Real-Time Processing",
    description: "Orders are processed instantly with live updates for both customers and restaurant staff"
  },
  {
    icon: "💳",
    title: "Multiple Payment Options",
    description: "Integrated with KeksPay, WSPay, and other payment gateways for seamless transactions"
  },
  {
    icon: "📊",
    title: "Live Order Management",
    description: "Staff receive instant notifications and can track all orders in real-time"
  },
  {
    icon: "🪑",
    title: "Table Organization",
    description: "Efficiently manage multiple tables with status tracking and order organization"
  },
  {
    icon: "📋",
    title: "Dynamic Menu Control",
    description: "Update menu items, prices, and availability instantly without system downtime"
  }
];

const benefits = [
  "Reduce wait times by up to 40%",
  "Eliminate the need for physical menus",
  "Streamline staff workflow and efficiency",
  "Increase table turnover rates",
  "Provide contactless dining experience",
  "Detailed analytics and reporting",
];

export default function Information() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            How Menufy Works
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 font-light">
            Simple, powerful features that transform your restaurant operations
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Benefits List */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Key Benefits
              </h2>
              <p className="text-lg text-gray-600 mb-8 font-light">
                Transform your restaurant with these proven advantages
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column - Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-8 text-gray-900 text-center">
                Proven Results
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <motion.div 
                  className="text-center p-4 bg-orange-50 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-4xl font-bold text-orange-500 mb-2">40%</div>
                  <div className="text-gray-700 font-medium text-sm">Faster Service</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 bg-blue-50 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-4xl font-bold text-blue-500 mb-2">99.9%</div>
                  <div className="text-gray-700 font-medium text-sm">System Uptime</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 bg-green-50 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-4xl font-bold text-green-500 mb-2">24/7</div>
                  <div className="text-gray-700 font-medium text-sm">Customer Support</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 bg-purple-50 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-4xl font-bold text-purple-500 mb-2">500+</div>
                  <div className="text-gray-700 font-medium text-sm">Restaurants Served</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
