import { motion } from 'framer-motion';
export default function MotionDiv({ children, ...props }: any) {
  return <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} {...props}>{children}</motion.div>;
}
