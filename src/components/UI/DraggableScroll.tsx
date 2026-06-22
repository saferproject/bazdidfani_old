import React, { useEffect, useRef, useState, ReactNode } from "react";

interface DraggableScrollProps {
  children: ReactNode;
  className?: string;
  gap?: number;
  direction?: "horizontal" | "vertical";
  hideScrollbar?: boolean;
  customCursor?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDrag?: (progress: number) => void;
}

const DraggableScroll: React.FC<DraggableScrollProps> = ({
  children,
  className = "",
  gap = 16,
  direction = "horizontal",
  hideScrollbar = true,
  customCursor = true,
  onDragStart,
  onDragEnd,
  onDrag,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  // Check if element or its parents are interactive
  const isInteractiveElement = (element: HTMLElement | null): boolean => {
    if (!element || element === wrapperRef.current) return false;

    // List of interactive elements and their attributes
    const interactiveElements = [
      "input",
      "textarea",
      "select",
      "a",
      "video",
      "audio",
      "embed",
      "iframe",
      "label",
    ];

    // Check for role="slider" or other interactive ARIA roles
    const interactiveRoles = [
      "checkbox",
      "listbox",
      "menuitem",
      "menuitemcheckbox",
      "menuitemradio",
      "option",
      "radio",
      "scrollbar",
      "slider",
      "spinbutton",
      "switch",
      "tab",
      "textbox",
    ];

    const isInteractive =
      interactiveElements.includes(element.tagName.toLowerCase()) ||
      element.hasAttribute("contenteditable") ||
      (element.hasAttribute("role") &&
        interactiveRoles.includes(
          element.getAttribute("role")?.toLowerCase() || ""
        )) ||
      element.classList.contains("MuiSlider-root") || // MUI Slider specific check
      element.classList.contains("interactive"); // Custom class for interactive elements

    return isInteractive || isInteractiveElement(element.parentElement);
  };

  // Start dragging only if not clicking on an interactive element
  const startDragging = (
    clientX: number,
    clientY: number,
    target: EventTarget | null
  ) => {
    if (
      !wrapperRef.current ||
      (target instanceof HTMLElement && isInteractiveElement(target))
    ) {
      return;
    }

    setIsDragging(true);
    setStartPosition({ x: clientX, y: clientY });
    setScrollPosition({
      x: wrapperRef.current.scrollLeft,
      y: wrapperRef.current.scrollTop,
    });
    onDragStart?.();
  };

  const drag = (clientX: number, clientY: number) => {
    if (!isDragging || !wrapperRef.current) return;

    const deltaX = startPosition.x - clientX;
    const deltaY = startPosition.y - clientY;

    const newScrollLeft = scrollPosition.x + deltaX;
    const newScrollTop = scrollPosition.y + deltaY;

    if (direction === "horizontal") {
      wrapperRef.current.scrollLeft = newScrollLeft;
    } else {
      wrapperRef.current.scrollTop = newScrollTop;
    }

    const progress =
      direction === "horizontal"
        ? newScrollLeft /
          (wrapperRef.current.scrollWidth - wrapperRef.current.clientWidth)
        : newScrollTop /
          (wrapperRef.current.scrollHeight - wrapperRef.current.clientHeight);

    onDrag?.(Math.max(0, Math.min(1, progress)));
  };

  const stopDragging = () => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd?.();
    }
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const preventScroll = (e: WheelEvent) => {
      if (hideScrollbar) {
        e.preventDefault();
      }
    };

    // Pass the event target to startDragging
    const handleMouseDown = (e: MouseEvent) => {
      startDragging(e.clientX, e.clientY, e.target);
    };

    const handleMouseMove = (e: MouseEvent) => {
      drag(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      stopDragging();
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startDragging(touch.clientX, touch.clientY, e.target);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault(); // Prevent scrolling while dragging
        const touch = e.touches[0];
        drag(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      stopDragging();
    };

    // wrapper.addEventListener("wheel", preventScroll, { passive: false });
    wrapper.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    wrapper.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      // wrapper.removeEventListener("wheel", preventScroll);
      wrapper.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      wrapper.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, hideScrollbar, direction, onDragStart, onDragEnd, onDrag]);

  const baseStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: direction === "horizontal" ? "row" : "column",
    gap: `${gap}px`,
    overflow: "hidden",
    WebkitOverflowScrolling: "touch",
    ...(hideScrollbar && {
      msOverflowStyle: "none",
      scrollbarWidth: "none",
    }),
    ...(customCursor && {
      cursor: isDragging ? "grabbing" : "grab",
      userSelect: "none",
    }),
  };

  return (
    <div
      ref={wrapperRef}
      className={`draggable-scroll ${className}`}
      style={baseStyles}
    >
      {children}
    </div>
  );
};

export default DraggableScroll;
