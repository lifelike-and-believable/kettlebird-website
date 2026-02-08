import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './RadialMenu.css';

interface MenuItem {
  label: string;
  path: string;
  icon?: string;
}

interface RadialMenuProps {
  /** Optional custom menu items, defaults to standard navigation */
  items?: MenuItem[];
  /** Radius of the radial menu in pixels */
  radius?: number;
  /** Custom class name for styling */
  className?: string;
}

const defaultMenuItems: MenuItem[] = [
  { label: 'Home', path: '/', icon: '🏠' },
  { label: 'Portfolio', path: '/portfolio', icon: '🎨' },
  { label: 'Comics', path: '/comics', icon: '📖' },
  { label: 'Writing', path: '/writing', icon: '✍️' },
  { label: 'Commissions', path: '/commissions', icon: '💼' },
  { label: 'About', path: '/about', icon: '👋' },
  { label: 'Contact', path: '/contact', icon: '📧' },
];

export default function RadialMenu({
  items = defaultMenuItems,
  radius = 180,
  className = '',
}: RadialMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      let nextIndex: number | null = null;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = focusedIndex === null ? 0 : (focusedIndex + 1) % items.length;
          setFocusedIndex(nextIndex);
          itemRefs.current[nextIndex]?.focus();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = focusedIndex === null ? items.length - 1 : (focusedIndex - 1 + items.length) % items.length;
          setFocusedIndex(nextIndex);
          itemRefs.current[nextIndex]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          itemRefs.current[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(items.length - 1);
          itemRefs.current[items.length - 1]?.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items.length, focusedIndex]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setFocusedIndex(null);
  };

  // Calculate position for each menu item using trigonometry
  const getItemPosition = (index: number, total: number) => {
    // Start from the top (-90 degrees) and distribute evenly
    const angleOffset = -90; // Start at top
    const angleStep = 360 / total;
    const angle = (angleOffset + angleStep * index) * (Math.PI / 180);
    
    // Use CSS calc with sin/cos for positioning
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    return { x, y };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: 'easeOut' as const,
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: 'easeIn' as const,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0, x: 0, y: 0 },
    visible: (custom: { x: number; y: number }) => ({
      opacity: 1,
      scale: 1,
      x: custom.x,
      y: custom.y,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
      },
    }),
  };

  const buttonVariants = {
    closed: { rotate: 0 },
    open: { rotate: 135 },
  };

  return (
    <div ref={menuRef} className={`radial-menu ${className}`}>
      {/* Toggle Button */}
      <motion.button
        ref={buttonRef}
        className="radial-menu__toggle"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-haspopup="menu"
        animate={isOpen ? 'open' : 'closed'}
        variants={buttonVariants}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      >
        <span className="radial-menu__toggle-icon" aria-hidden="true">
          <span className="radial-menu__toggle-line"></span>
          <span className="radial-menu__toggle-line"></span>
        </span>
        <span className="radial-menu__toggle-text">Menu</span>
      </motion.button>

      {/* Radial Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="radial-menu__container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="menu"
            aria-label="Main navigation"
          >
            {/* Center circle background */}
            <div className="radial-menu__center" aria-hidden="true"></div>

            {/* Menu Items */}
            {items.map((item, index) => {
              const position = getItemPosition(index, items.length);
              
              return (
                <motion.a
                  key={item.path}
                  ref={(el) => (itemRefs.current[index] = el)}
                  href={item.path}
                  className="radial-menu__item"
                  custom={position}
                  variants={itemVariants}
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          scale: 1.15,
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.3 },
                        }
                  }
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  role="menuitem"
                  tabIndex={isOpen ? 0 : -1}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  style={{
                    // Use CSS custom properties for positioning
                    '--item-x': `${position.x}px`,
                    '--item-y': `${position.y}px`,
                  } as React.CSSProperties}
                >
                  <span className="radial-menu__item-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="radial-menu__item-label">{item.label}</span>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
