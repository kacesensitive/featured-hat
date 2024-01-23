import React from 'react';
import { motion } from 'framer-motion';

const MobileLandingPage: React.FC = () => {
  const containerVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } }
  };

  const rotatingHatVariant = {
    hidden: { rotate: 0 },
    visible: { 
      rotate: 360,
      transition: { loop: Infinity, ease: "easeOut", duration: 1 }
    }
  };

  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '20px',
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.img 
        src="/logo.png"
        alt="Featured Hat Logo"
        style={{ width: '100px', height: '100px' }}
        variants={rotatingHatVariant}
      />
      <motion.h1 variants={itemVariants} className="mt-10">
        Welcome to Featured Hat!
      </motion.h1>
      <motion.p variants={itemVariants} className="mt-10">
        A free, open-source alternative to featured.chat
      </motion.p>
      <motion.div variants={itemVariants} className="mt-10">
        <p>Engage with your audience in a whole new way.</p>
      </motion.div>
      <motion.div variants={itemVariants} className="mt-10">
        <p>Visit the desktop site to get started!</p>
      </motion.div>
    </motion.div>
  );
};

export default MobileLandingPage;
