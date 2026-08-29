import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ open, onClose, title, children, size = 'md' }) => (
  <AnimatePresence>
    {open && (
      <div className="modal-overlay" onClick={onClose} role="presentation">
        <motion.div
          className={`modal modal-${size}`}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="modal-header">
            <h3>{title}</h3>
            <button type="button" className="btn-icon" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default Modal;
