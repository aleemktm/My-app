// SwipeableRow.js — Generic Apple iOS Native Swipe-to-Action row wrapper.
// Provides the touch physics (drag, spring-damped snap, rubber-band cap)
// used by both transaction rows and account rows so both list types get
// identical "swipe left to reveal actions" behavior, just like Apple Mail
// and Apple Notes.
(function () {
  function SwipeableRow(props) {
    const { actions = [], children, enabled = true, outerClassName = "", contentClassName = "", onClick } = props;
    const [offsetX, setOffsetX] = React.useState(0);
    const startXRef = React.useRef(0);
    const startYRef = React.useRef(0);
    const isSwipingRef = React.useRef(false);
    const isHorizontalRef = React.useRef(null);

    const actionWidth = 68;
    const maxLeft = -(actions.length * actionWidth);

    const resetSwipe = () => setOffsetX(0);

    if (!enabled || actions.length === 0) {
      return React.createElement("div", {
        className: `mb-2.5 ${contentClassName} ${outerClassName}`,
        onClick
      }, children);
    }

    const handleTouchStart = (e) => {
      if (!e.touches[0]) return;
      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
      isSwipingRef.current = true;
      isHorizontalRef.current = null;
    };

    const handleTouchMove = (e) => {
      if (!isSwipingRef.current || !e.touches[0]) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - startXRef.current;
      const diffY = currentY - startYRef.current;

      if (isHorizontalRef.current === null) {
        if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
          isHorizontalRef.current = Math.abs(diffX) > Math.abs(diffY);
        }
      }

      if (isHorizontalRef.current) {
        if (diffX < 0) {
          // Rubber-band resistance once past the fully-open position
          setOffsetX(Math.max(maxLeft * 1.2, diffX));
        } else if (offsetX < 0) {
          setOffsetX(Math.min(0, offsetX + diffX));
        }
      }
    };

    const handleTouchEnd = () => {
      if (offsetX < maxLeft * 0.35) {
        setOffsetX(maxLeft);
        if (window.triggerHaptic) window.triggerHaptic("light");
      } else {
        setOffsetX(0);
      }
      isSwipingRef.current = false;
      isHorizontalRef.current = null;
    };

    return React.createElement("div", {
      className: `ios-swipe-row group mb-2.5 ${outerClassName}`,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
      React.createElement("div", { className: "ios-swipe-actions-bg" },
        actions.map((a) => React.createElement("button", {
          key: a.key,
          type: "button",
          onClick: (e) => {
            e.stopPropagation();
            resetSwipe();
            a.onClick(e);
          },
          className: `ios-swipe-btn ${a.bg || "bg-zinc-600 hover:bg-zinc-500"}`
        },
          a.icon && React.createElement(a.icon, { className: "w-4 h-4 mb-1" }),
          a.label
        ))
      ),
      React.createElement("div", {
        className: `ios-swipe-content ${contentClassName}`,
        style: { transform: `translateX(${offsetX}px)` },
        onClick: (e) => {
          if (offsetX !== 0) {
            resetSwipe();
            return;
          }
          if (onClick) onClick(e);
        }
      }, children)
    );
  }

  window.SwipeableRow = SwipeableRow;
})();
