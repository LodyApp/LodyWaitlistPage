import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const FlagCarousel = () => {
  const countries = ['US', 'GB', 'DE', 'JP', 'FR', 'BR', 'IN', 'KR'];

  return (
    <Carousel
      showArrows={true}
      showStatus={false}
      showThumbs={false}
      swipeable={true}
      emulateTouch={true}
      centerMode={true}
      centerSlidePercentage={40}
      className="max-w-xs mx-auto"
    >
      {countries.map((code) => (
        <div key={code} className="p-2">
          <ReactCountryFlag 
            countryCode={code} 
            className="text-4xl mx-auto"
            aria-label={code}
          />
          <p className="mt-2 text-sm text-center">{code}</p>
        </div>
      ))}
    </Carousel>
  );
};

export default FlagCarousel; 