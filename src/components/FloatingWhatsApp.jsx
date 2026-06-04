import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";

const WHATSAPP_NUMBER = "917794045533";
const WHATSAPP_MESSAGE = encodeURIComponent("Hi Career Mitra team, I need help with a job opportunity.");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function FloatingWhatsApp() {
  return (
    <div className="fixed right-4 bottom-6 sm:right-6 sm:bottom-8 z-[80]">
      <div className="relative group">
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-green-400/60"
          animate={{ scale: [1, 1.6], opacity: [0.45, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-green-500/50"
          animate={{ scale: [1, 1.85], opacity: [0.35, 0] }}
          transition={{ duration: 1.8, delay: 0.45, repeat: Infinity, ease: "easeOut" }}
        />

        <motion.a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="relative w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-green-500/40 flex items-center justify-center border-2 border-white"
          whileHover={{ scale: 1.08, rotate: -4 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.1, ease: "easeInOut" }}
          >
            <FaWhatsapp size={30} />
          </motion.span>

          <motion.span
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-green-600 flex items-center justify-center shadow-md"
            animate={{ rotate: [0, 18, -18, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
          >
            <HiOutlineSparkles size={14} />
          </motion.span>
        </motion.a>

        <div className="hidden sm:block absolute right-16 bottom-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250 pointer-events-none">
          <div className="bg-white border border-green-100 text-gray-700 shadow-lg rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap">
            Chat on WhatsApp
          </div>
        </div>
      </div>
    </div>
  );
}
