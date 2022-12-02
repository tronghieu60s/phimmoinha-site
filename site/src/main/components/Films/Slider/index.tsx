import { EXTRA_WIDTH, LARGE_WIDTH, MEDIUM_WIDTH } from '@const/responsive';
import { MovieType } from '@const/types';
import React, { useCallback, useRef } from 'react';
import Slider from 'react-slick';
import FilmsSliderItem from './FilmsSliderItem';

const settings = {
  dots: false,
  infinite: true,
  speed: 800,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToShow: 5,
  slidesToScroll: 5,
  responsive: [
    {
      breakpoint: MEDIUM_WIDTH,
      settings: { slidesToShow: 2, slidesToScroll: 2 },
    },
    {
      breakpoint: LARGE_WIDTH,
      settings: { slidesToShow: 3, slidesToScroll: 3 },
    },
    {
      breakpoint: EXTRA_WIDTH,
      settings: { slidesToShow: 4, slidesToScroll: 4 },
    },
  ],
};

type Props = React.ComponentProps<typeof Slider> & {
  ref?: React.MutableRefObject<Slider>;
  items?: MovieType[];
};

export default function FilmsSlider(props: Props) {
  const { ref, items, ...restProps } = props;
  const rootRef = useRef<Slider>(null);
  const sliderRef = ref || rootRef;

  const afterChange = useCallback(() => {
    // @ts-ignore
    const slider = sliderRef.current?.innerSlider?.list;
    const slickSlider = slider.querySelectorAll('.slick-slide');
    const slickSliderArray = Array.from(slickSlider);
    slickSliderArray.forEach((item: any) => item.removeAttribute('aria-hidden'));
  }, [sliderRef]);

  return (
    <Slider
      ref={sliderRef}
      className="pm-main-film-slider"
      afterChange={afterChange}
      {...settings}
      {...restProps}
    >
      {items?.map((item) => (
        <FilmsSliderItem key={item._id} value={item} />
      ))}
    </Slider>
  );
}
