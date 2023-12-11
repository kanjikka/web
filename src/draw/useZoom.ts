import { useState, useEffect } from "react";

const DEFAULT_TILE_WIDTH = 109;
const LOWER_BOUNDARY = 50;
const UPPER_BOUNDARY = 200;

// TODO: not the most optimal way
function findDivisors(n: number) {
  const THRESHOLD = 3;
  const divisors = [];

  for (let i = 1; i <= n; i++) {
    const res = n % i;
    if (res >= 0 && res <= THRESHOLD) {
      divisors.push(i);
    }
  }

  return divisors;
}

function filterBetween(lower: number, higher: number, arr: number[]) {
  return arr.filter((a) => a >= lower && a <= higher);
}

type ZoomProps = {
  canvasWidth: number;
};
export function useZoom(props: ZoomProps) {
  const [tileWidthHeight, setTileWidthHeight] = useState(DEFAULT_TILE_WIDTH);
  const [initialTileWidth, setInitialTileWidth] = useState(DEFAULT_TILE_WIDTH);
  const [zoomLevel, setZoomLevel] = useState(1);

  const { canvasWidth } = props;
  // Since we will add borders to the first and last item
  // They also needed to be accounted for
  const canvasSizeWidth = canvasWidth - 2;
  const divisors = filterBetween(
    LOWER_BOUNDARY,
    UPPER_BOUNDARY,
    findDivisors(canvasSizeWidth)
  );

  // Set a default, which right now is the median
  // We should do something more smart about it...
  useEffect(() => {
    // TODO: set a default...
    // In fact it should be as close as possible to the real size
    if (canvasWidth > 0) {
      const median = divisors[Math.floor(divisors.length / 2)];
      setInitialTileWidth(median);
      setTileWidthHeight(median);
    }
  }, [canvasWidth]);

  const currentIndex = divisors.findIndex((a) => a === tileWidthHeight);
  const canZoomOut = currentIndex > 0;
  const canZoomIn = currentIndex < divisors.length - 1;

  const zoomOut = () => {
    if (canZoomOut) {
      const newTileWidth = divisors[currentIndex - 1];

      setZoomLevel(newTileWidth / initialTileWidth);
      setTileWidthHeight(newTileWidth);
    }
  };

  const zoomIn = () => {
    if (canZoomIn) {
      const newTileWidth = divisors[currentIndex + 1];

      setZoomLevel(newTileWidth / initialTileWidth);
      setTileWidthHeight(newTileWidth);
    }
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--tile-width",
      `${tileWidthHeight}px`
    );
    document.documentElement.style.setProperty(
      "--tile-height",
      `${tileWidthHeight}px`
    );
  }, [tileWidthHeight]);

  return {
    zoomLevel,
    tileWidth: tileWidthHeight,
    zoomIn,
    zoomOut,
    canZoomIn,
    canZoomOut,
  };
}
