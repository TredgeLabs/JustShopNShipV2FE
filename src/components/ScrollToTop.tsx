import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Scrolls to the top instantly on any route change
    window.scrollTo(0, 0);
  }, [pathname]); // Depend on pathname to trigger the effect

  return null; // The component doesn't render any UI
};

export default ScrollToTop;
