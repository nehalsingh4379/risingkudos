"use client";

import { motion } from "motion/react";
import React from "react";

export interface MarqueeImage {
  src: string;
  alt: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

export interface ThreeDMarqueeProps {
  images: MarqueeImage[];
  className?: string;
  cols?: number; // default is 4
  onImageClick?: (image: MarqueeImage, index: number) => void;
}

export const ThreeDMarquee: React.FC<ThreeDMarqueeProps> = ({
  images,
  className = "",
  cols = 6,
  onImageClick,
}) => {
  // To create a dense grid, we need many items per column.
  // Each column will have a randomized or offset slice of the images, repeated to allow infinite scroll.
  const itemsPerCol = 10;
  
  const handleImageClick = (image: MarqueeImage, globalIndex: number) => {
    if (onImageClick) {
      onImageClick(image, globalIndex);
    } else if (image.href) {
      window.open(image.href, image.target || "_self");
    }
  };

  return (
    <div className={`mx-auto block h-full w-full overflow-hidden ${className}`}>
      <div
        className="flex w-full h-full items-center justify-center"
        style={{
          transform: "rotateX(55deg) rotateY(0deg) rotateZ(45deg) scale(1.5)",
        }}
      >
        <div className="w-[200%] h-[200%] overflow-hidden flex items-center justify-center">
          <div
            className="relative grid h-[150%] w-[150%] origin-center gap-4 transform"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: cols }).map((_, colIdx) => {
              // Stagger the images differently for each column
              const colImages = Array.from({ length: itemsPerCol }).map((_, i) => {
                return images[(i + colIdx * 2) % images.length];
              });

              // Double the array for seamless infinite looping
              const loopedImages = [...colImages, ...colImages];
              const isEven = colIdx % 2 === 0;

              return (
                <div key={`column-${colIdx}`} className="relative h-full overflow-hidden">
                  <motion.div
                    animate={{ 
                      y: isEven ? ["-50%", "0%"] : ["0%", "-50%"] 
                    }}
                    transition={{
                      duration: isEven ? 30 : 40,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="flex flex-col items-center gap-4 absolute top-0 w-full"
                  >
                    {loopedImages.map((image, imgIdx) => {
                      const isClickable = image.href || onImageClick;
                      return (
                        <div key={`img-${colIdx}-${imgIdx}`} className="relative w-full flex justify-center shrink-0">
                          <motion.img
                            whileHover={{ y: -10 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            src={image.src}
                            alt={image.alt}
                            className={`aspect-video w-full rounded-2xl object-cover shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-2xl transition-shadow duration-300 ${
                              isClickable ? "cursor-pointer" : ""
                            }`}
                            onClick={() => handleImageClick(image, imgIdx)}
                          />
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
