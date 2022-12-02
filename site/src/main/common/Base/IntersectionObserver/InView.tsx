import React, { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  skeleton?: React.ReactNode;
  skeletonDuration?: number;
  options?: {
    root: IntersectionObserver['root'];
    rootMargin: IntersectionObserver['rootMargin'];
    thresholds: IntersectionObserver['thresholds'];
  };
  continueObserving?: boolean;
  onIntersection?: (entries: IntersectionObserverEntry[]) => void;
  children: React.ElementType;
};

const defaultOptions = {
  root: null,
  rootMargin: '0px',
  thresholds: 0,
};

export default function IntersectionObserverInView(props: Props): React.ReactElement {
  const {
    skeleton,
    skeletonDuration = 3000,
    options = defaultOptions,
    continueObserving,
    onIntersection,
    children: Children,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  const onIntersectionCallback = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (!continueObserving && !hasIntersected) {
        const entry = entries.find((e) => e.target === containerRef.current);

        if (entry && entry.isIntersecting) {
          setHasIntersected(true);
          setTimeout(() => setIsShow(true), skeleton ? skeletonDuration : 0);
          if (onIntersection) onIntersection(entries);
          if (containerRef.current) observer.unobserve(containerRef.current);
        }
      } else if (continueObserving && onIntersection) {
        onIntersection(entries);
      }
    },
    [continueObserving, hasIntersected, onIntersection, skeleton, skeletonDuration],
  );

  useEffect(() => {
    let observerRefValue: Element | null = null;
    const observer = new IntersectionObserver(onIntersectionCallback, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
      observerRefValue = containerRef.current;
    }

    return () => {
      if (observerRefValue) observer.unobserve(observerRefValue);
      observer.disconnect();
    };
  }, [hasIntersected, containerRef, onIntersectionCallback, options]);

  const childrenWithProps = <Children ref={containerRef} />;

  if (continueObserving) {
    return childrenWithProps;
  }

  if (isShow && hasIntersected) {
    return childrenWithProps;
  }

  if (hasIntersected) {
    return skeleton as React.ReactElement;
  }

  return <div ref={containerRef} />;
}
