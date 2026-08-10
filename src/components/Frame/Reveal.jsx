import { motion } from 'framer-motion'

// direction: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'
const getVariants = (direction, distance) => {
  const offsets = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    fade: { x: 0, y: 0 },
    scale: { x: 0, y: 0, scale: 0.92 },
  }
  const offset = offsets[direction] || offsets.up

  return {
    hidden: { opacity: 0, ...offset },
    show: { opacity: 1, x: 0, y: 0, scale: 1 },
  }
}

function Reveal({
  children,
  delay = 0,
  direction = 'up',
  distance = 32,
  duration = 0.9, // was 0.7
  className = '',
}) {
  return (
    <motion.div
      variants={getVariants(direction, distance)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration,
        delay,
        type: 'spring',
        stiffness: 40,   // was 60 — lower = slower, floatier
        damping: 18,      // was 16 — slightly higher = less bounce
        mass: 1,          // was 0.9
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default Reveal