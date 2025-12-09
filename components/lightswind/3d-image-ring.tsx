"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, easeOut } from "framer-motion";
import { cn } from "../../lib/utils"; // Assuming you have this utility for class names
import { animate } from "framer-motion";

export interface ImageItem {
  src: string;
  name?: string;
}

export interface ThreeDImageRingProps {
  /** Array of image URLs or image objects with names to display in the ring */
  images: string[] | ImageItem[];
  /** Container width in pixels (will be scaled) */
  width?: number;
  /** 3D perspective value */
  perspective?: number;
  /** Distance of images from center (z-depth) */
  imageDistance?: number;
  /** Initial rotation of the ring */
  initialRotation?: number;
  /** Animation duration for entrance */
  animationDuration?: number;
  /** Stagger delay between images */
  staggerDelay?: number;
  /** Hover opacity for non-hovered images */
  hoverOpacity?: number;
  /** Custom container className */
  containerClassName?: string;
  /** Custom ring className */
  ringClassName?: string;
  /** Custom image className */
  imageClassName?: string;
  /** Background color of the stage */
  backgroundColor?: string;
  /** Enable/disable drag functionality */
  draggable?: boolean;
  /** Animation ease for entrance */
  ease?: string;
  /** Breakpoint for mobile responsiveness (e.g., 768 for iPad mini) */
  mobileBreakpoint?: number;
  /** Scale factor for mobile (e.g., 0.7 for 70% size) */
  mobileScaleFactor?: number;
  /** Power for the drag end inertia animation (higher means faster stop) */
  inertiaPower?: number;
  /** Time constant for the drag end inertia animation (duration of deceleration in ms) */
  inertiaTimeConstant?: number;
  /** Multiplier for initial velocity when drag ends (influences initial "spin") */
  inertiaVelocityMultiplier?: number;
  /** Enable auto-rotation */
  autoRotate?: boolean;
  /** Auto-rotation speed (degrees per second) */
  autoRotateSpeed?: number;
  /** Delay before auto-rotation starts (ms) */
  autoRotateDelay?: number;
  /** Duration of each auto-rotation step (ms) */
  autoRotateStepDuration?: number;
  /** Pause between auto-rotation steps (ms) */
  autoRotatePause?: number;
}

export function ThreeDImageRing({
  images,
  width = 300,
  perspective = 2000,
  imageDistance = 500,
  initialRotation = 180,
  animationDuration = 1.5,
  staggerDelay = 0.1,
  hoverOpacity = 0.5,
  containerClassName,
  ringClassName,
  imageClassName,
  backgroundColor,
  draggable = true,
  ease = "easeOut",
  mobileBreakpoint = 768,
  mobileScaleFactor = 0.8,
  inertiaPower = 0.8, // Default power for inertia
  inertiaTimeConstant = 300, // Default time constant for inertia
  inertiaVelocityMultiplier = 20, // Default multiplier for initial spin
  autoRotate = false, // Auto-rotation disabled by default
  autoRotateSpeed = 15, // Degrees per second
  autoRotateDelay = 3000, // 3 seconds delay before auto-rotation
  autoRotateStepDuration = 800, // ms for each rotate animation
  autoRotatePause = 1200, // ms pause on each image
}: ThreeDImageRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const rotationY = useMotionValue(initialRotation);
  const startX = useRef<number>(0);
  const currentRotationY = useRef<number>(initialRotation);
  const isDragging = useRef<boolean>(false);
  const velocity = useRef<number>(0); // To track drag velocity

  const [currentScale, setCurrentScale] = useState(1);
  const [showImages, setShowImages] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const autoRotateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoRotateStepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoRotateAnimationRef = useRef<number | null>(null);
  const autoRotateAnimationCtrlRef = useRef<ReturnType<typeof animate> | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Normalize images to always be ImageItem[]
  const normalizedImages: ImageItem[] = useMemo(() => {
    return images.map((img) => {
      if (typeof img === 'string') {
        return { src: img };
      }
      return img;
    });
  }, [images]);

  const angle = useMemo(() => 360 / normalizedImages.length, [normalizedImages.length]);

  const getBgPos = (imageIndex: number, currentRot: number, scale: number) => {
    // Center the background image instead of parallax offset
    return `center center`;
  };

  useEffect(() => {
    const unsubscribe = rotationY.on("change", (latestRotation) => {
      if (ringRef.current) {
        Array.from(ringRef.current.children).forEach((imgElement, i) => {
          (imgElement as HTMLElement).style.backgroundPosition = getBgPos(
            i,
            latestRotation,
            currentScale
          );
        });
      }
      currentRotationY.current = latestRotation;
    });
    return () => unsubscribe();
  }, [rotationY, images.length, imageDistance, currentScale, angle]);

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const newScale = viewportWidth <= mobileBreakpoint ? mobileScaleFactor : 1;
      setCurrentScale(newScale);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [mobileBreakpoint, mobileScaleFactor]);

  useEffect(() => {
    setShowImages(true);
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate) return;

    const scheduleStep = () => {
      const start = Math.round(rotationY.get() / angle) * angle;
      const target = start + angle;
      setIsAutoRotating(true);

      autoRotateAnimationCtrlRef.current = animate(start, target, {
        duration: autoRotateStepDuration / 1000,
        ease: "easeInOut",
        onUpdate: (latest) => {
          rotationY.set(latest);
          currentRotationY.current = latest;
        },
        onComplete: () => {
          setIsAutoRotating(false);
          autoRotateStepTimeoutRef.current = setTimeout(scheduleStep, autoRotatePause);
        },
      });
    };

    // Start auto-rotation after delay
    autoRotateTimeoutRef.current = setTimeout(scheduleStep, autoRotateDelay);

    return () => {
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current);
      }
      if (autoRotateStepTimeoutRef.current) {
        clearTimeout(autoRotateStepTimeoutRef.current);
      }
      if (autoRotateAnimationRef.current) {
        cancelAnimationFrame(autoRotateAnimationRef.current);
      }
      if (autoRotateAnimationCtrlRef.current) {
        autoRotateAnimationCtrlRef.current.stop();
      }
      setIsAutoRotating(false);
    };
  }, [autoRotate, autoRotateDelay, autoRotatePause, autoRotateStepDuration, angle, rotationY]);

  // Stop auto-rotation on interaction, restart after delay
  const stopAutoRotation = () => {
    if (autoRotateAnimationRef.current) {
      cancelAnimationFrame(autoRotateAnimationRef.current);
      autoRotateAnimationRef.current = null;
    }
    if (autoRotateAnimationCtrlRef.current) {
      autoRotateAnimationCtrlRef.current.stop();
      autoRotateAnimationCtrlRef.current = null;
    }
    setIsAutoRotating(false);
    
    // Clear any existing timeout
    if (autoRotateTimeoutRef.current) {
      clearTimeout(autoRotateTimeoutRef.current);
    }
    if (autoRotateStepTimeoutRef.current) {
      clearTimeout(autoRotateStepTimeoutRef.current);
    }
  };

  const restartAutoRotation = () => {
    if (!autoRotate) return;
    
    // Restart auto-rotation after delay
    autoRotateTimeoutRef.current = setTimeout(() => {
      const start = Math.round(rotationY.get() / angle) * angle;
      const target = start + angle;
      setIsAutoRotating(true);

      autoRotateAnimationCtrlRef.current = animate(start, target, {
        duration: autoRotateStepDuration / 1000,
        ease: "easeInOut",
        onUpdate: (latest) => {
          rotationY.set(latest);
          currentRotationY.current = latest;
        },
        onComplete: () => {
          setIsAutoRotating(false);
          autoRotateStepTimeoutRef.current = setTimeout(() => {
            restartAutoRotation();
          }, autoRotatePause);
        },
      });
    }, autoRotateDelay);
  };

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (!draggable) return;
    stopAutoRotation(); // Stop auto-rotation when user starts dragging
    isDragging.current = true;
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    startX.current = clientX;
    // Stop any ongoing animation instantly when drag starts
    rotationY.stop();
    velocity.current = 0; // Reset velocity
    if (ringRef.current) {
      (ringRef.current as HTMLElement).style.cursor = "grabbing";
    }
    // Attach global move and end listeners to document when dragging starts
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("touchend", handleDragEnd);
  };

  const handleDrag = (event: MouseEvent | TouchEvent) => {
    // Only proceed if dragging is active
    if (!draggable || !isDragging.current) return;

    const clientX = "touches" in event ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
    const deltaX = clientX - startX.current;

    // Update velocity based on deltaX
    velocity.current = -deltaX * 0.5; // Factor of 0.5 to control sensitivity

    rotationY.set(currentRotationY.current + velocity.current);

    startX.current = clientX;
  };

const handleDragEnd = () => {
  isDragging.current = false;
  if (ringRef.current) {
    ringRef.current.style.cursor = "grab";
    currentRotationY.current = rotationY.get();
  }

  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", handleDragEnd);
  document.removeEventListener("touchmove", handleDrag);
  document.removeEventListener("touchend", handleDragEnd);

  const initial = rotationY.get();
  const velocityBoost = velocity.current * inertiaVelocityMultiplier;
  const target = initial + velocityBoost;

  // Animate with inertia manually using `animate()`
  animate(initial, target, {
    type: "inertia",
    velocity: velocityBoost,
    power: inertiaPower,
    timeConstant: inertiaTimeConstant,
    restDelta: 0.5,
    modifyTarget: (target) => Math.round(target / angle) * angle,
    onUpdate: (latest) => {
      rotationY.set(latest);
    },
  });

  velocity.current = 0;
  restartAutoRotation(); // Restart auto-rotation after drag ends
};


  // Corrected imageVariants: no function for 'visible' state
  const imageVariants = {
    hidden: { y: 200, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      // Transition properties will be defined directly on the motion.div using `custom` prop
    },
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full overflow-hidden select-none relative",
        containerClassName
      )}
      style={{
        backgroundColor,
        transform: `scale(${currentScale})`,
        transformOrigin: "center center",
      }}
      // Attach initial drag start listeners only
      onMouseDown={draggable ? handleDragStart : undefined}
      onTouchStart={draggable ? handleDragStart : undefined}
    >
      <div
        style={{
          perspective: `${perspective}px`,
          width: `${width}px`,
          height: `${width * 1.33}px`,
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <motion.div
          ref={ringRef}
          className={cn(
            "w-full h-full absolute",
            ringClassName
          )}
          style={{
            transformStyle: "preserve-3d",
            rotateY: rotationY,
            cursor: draggable ? "grab" : "default",
          }}
        >
          <AnimatePresence>
            {showImages && normalizedImages.map((imageItem, index) => (
              <motion.div
                key={index}
                className={cn(
                  "w-full h-full absolute",
                  imageClassName
                )}
                style={{
                  transformStyle: "preserve-3d",
                  backgroundImage: `url(${imageItem.src})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backfaceVisibility: "hidden",
                  rotateY: index * -angle,
                  z: -imageDistance * currentScale,
                  transformOrigin: `50% 50% ${imageDistance * currentScale}px`,
                  backgroundPosition: getBgPos(index, currentRotationY.current, currentScale),
                  borderRadius: "12px",
                  outline: "none",
                  border: "none",
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={imageVariants} // Use the simplified variants object
                custom={index} // Pass the index as a custom prop
                transition={{
                  delay: index * staggerDelay, // Use index directly in transition
                  duration: animationDuration,
                  ease: easeOut, // Apply ease for entrance animation
                }}
                whileHover={{ opacity: 1, transition: { duration: 0.15 } }}
                onHoverStart={() => {
                  // Prevent hover effects while dragging
                  if (isDragging.current) return;
                  if (ringRef.current) {
                    Array.from(ringRef.current.children).forEach((imgEl, i) => {
                      if (i !== index) {
                        (imgEl as HTMLElement).style.opacity = `${hoverOpacity}`;
                      }
                    });
                  }
                }}
                onHoverEnd={() => {
                  // Prevent hover effects while dragging
                  if (isDragging.current) return;
                  if (ringRef.current) {
                    Array.from(ringRef.current.children).forEach((imgEl) => {
                      (imgEl as HTMLElement).style.opacity = `1`;
                    });
                  }
                }}
              >
                {/* Celebrity Name Label */}
                {imageItem.name && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-4 px-4 rounded-b-xl"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <p className="text-white text-center font-playfair text-lg md:text-xl tracking-wide">
                      {imageItem.name}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default ThreeDImageRing;
