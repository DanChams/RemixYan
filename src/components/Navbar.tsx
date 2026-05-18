/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4"
        >
          <img 
            src="/images/yanone_logo_lavender_1779020855814.png" 
            alt="Yan + One Logo" 
            className="h-8 md:h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="h-6 w-[1px] bg-gray-200 hidden sm:block" />
          <span className="font-display font-semibold text-xl tracking-wide text-brand-dark">Projet Conception</span>
        </motion.div>
      </div>
    </nav>
  );
}
