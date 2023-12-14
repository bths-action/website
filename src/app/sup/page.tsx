import { FC } from "react";
import { motion } from "framer-motion";

const Home: FC = () => {
  return (
    <main>
      <motion.h1
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
      >
        BTHS Action
      </motion.h1>
    </main>
  );
};

export default Home;
