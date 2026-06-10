import React, { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/element/css/effect-creative";
import { EffectCreative } from "swiper/modules";

interface CustomSwiperProps {
  children: ReactNode;
  className?: string;
  swiperOptions?: Partial<SwiperOptions>;
}

const CustomSwiper: React.FC<CustomSwiperProps> = ({
  children,
  className = "",
  swiperOptions = {},
}) => {
  const slides = React.Children.toArray(children);

  const defaultSwiperConfig: Partial<SwiperOptions> = {
    // @ts-ignore
    dir: "rtl",
    direction: "horizontal",
    slidesPerView: "auto",
    spaceBetween: -64,
    initialSlide: 0,
    speed: 400,
    grabCursor: true,
    touchEventsTarget: "wrapper",
    touchRatio: 1,
    touchangles: 45,
    resistance: false,
    watchSlidesProgress: true,
    effect: "creative",
    creativeEffect: {
      perspective: true,
      next: {
        translate: ["100%", 0, 0],
        origin: "center center",
      },
      prev: {
        translate: [0, 0, -100],
        opacity: 0.25,
        scale: 1.2,
        origin: "center center",
      },
    },
    modules: [EffectCreative],
  };

  const swiperConfig = {
    ...defaultSwiperConfig,
    ...swiperOptions,
  };

  return (
    <div className={`w-full overflow-visible ${className}`.trim()} dir="rtl">
      <Swiper
        {...swiperConfig}
        className="w-full overflow-visible"
        wrapperClass="items-stretch"
        dir={"ltr"}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="transition-transform duration-300 w-full"
          >
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomSwiper;
