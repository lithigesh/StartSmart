import { useRef, useEffect } from "react";

export const useTilt = (options = {}) => {
  const ref = useRef(null);
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 400,
    easing = "cubic-bezier(.03,.98,.52,.99)",
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let requestId = null;

    const handleMouseMove = (e) => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }

      requestId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;

        const tiltX = percentY * maxTilt;
        const tiltY = -percentX * maxTilt;

        element.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;
      });
    };

    const handleMouseEnter = () => {
      element.style.transition = `transform ${speed}ms ${easing}`;
    };

    const handleMouseLeave = () => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
      element.style.transition = `transform ${speed}ms ${easing}`;
      element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [maxTilt, perspective, scale, speed, easing]);

  return ref;
};
