import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../assets/css/imageslider.css";

export default function ImageSlider({ images, setOnViewer }) {
  return (
    <div className="images-slider">
      <div className="images-slider-close" onClick={() => setOnViewer(false)}>
        <i className="fa-solid fa-xmark"></i>
      </div>

      <div className="slider-container">
        <Swiper
          loop={true}
          navigation={false}
          pagination={true}
          modules={[Pagination]}
          spaceBetween={0}
          slidesPerView={1}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} className="image-slide" alt="chat images" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
