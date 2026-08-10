import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } }, // was 0.09 / 0.05
}

const getItemVariant = (direction) => {
  const offsets = {
    left: { x: -28, y: 0 },
    up: { x: 0, y: 24 },
    scale: { x: 0, y: 0, scale: 0.9 },
  }
  const offset = offsets[direction] || offsets.left

  return {
    hidden: { opacity: 0, ...offset },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] }, // was 0.5
    },
  }
}

export function StaggerGrid({ children, className = '' }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, direction = 'left', className = '' }) {
  return (
    <motion.div variants={getItemVariant(direction)} className={className}>
      {children}
    </motion.div>
  )
}