import React, { useState, useEffect } from "react";
import "../css/Slider.css";

const Slider = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reversedChildren, setReversedChildren] = useState([]);

  useEffect(() => {
    setReversedChildren([...children].reverse());
  }, [children]);

  const slideCount = Math.ceil(reversedChildren.length / 4);

  const previousSlide = () => {
    setCurrentSlide((currentSlide + 1) % slideCount);
  };

  const nextSlide = () => {
    setCurrentSlide((currentSlide - 1 + slideCount) % slideCount);
  };

  const cardChunks = [];
  for (let i = 0; i < reversedChildren.length; i += 4) {
    const chunk = reversedChildren.slice(i, i + 4);
    cardChunks.push(chunk);
  }

  return (
    <div className="slider-container">
      <button className="slider-button prev" onClick={previousSlide}>
        &#10094;
      </button>
      <div className="slider-content">
        {cardChunks.map((chunk, index) => (
          <div
            className={`slider-item ${index === currentSlide ? "active" : ""}`}
            key={index}
          >
            {chunk.map((item, itemIndex) => (
              <div className="slider-tab" key={itemIndex}>{item}</div>

            ))}
          </div>
        ))}
      </div>
      <button className="slider-button next" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
};

export default Slider;
