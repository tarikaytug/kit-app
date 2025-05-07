import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const MotionWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

MotionWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MotionWrapper;