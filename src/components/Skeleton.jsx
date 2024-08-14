// CustomSkeleton.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './Components.css'; // Ensure you have your CSS file for additional styling
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';


const CustomSkeleton = ({ layout }) => {
  switch (layout) {
    case 'allCards':
      return (
        <div className="skeleton-container">
          {[...Array(1)].map((_, index) => (
            <div key={index} className="skeleton-card">
              <Skeleton height={180} width={"100%"} />
            </div>
          ))}
        </div>
      );
    case 'hostCards':
      return (
        <div className="skeleton-container">
          {[...Array(1)].map((_, index) => (
            <div key={index} className="skeleton-card">
              <Skeleton height={70} width={"100%"} />
            </div>
          ))}
        </div>
      );
      case 'userCards':
      return (
        <div className="skeleton-container-admin">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="skeleton-card-admin">
              <Skeleton height={105} width={"95%"} className="skeleton-admin" />
            </div>
          ))}
        </div>
      );
    case 'featuredCards':
      return (
        <div className="skeleton-container2">
          {[...Array(1)].map((_, index) => (
            <div key={index} className="skeleton-card2">
              <Skeleton height={200} width={150} />
            </div>
          ))}
        </div>
      );
    case 'hostdetails':
      return (
        <div className="host-details-container">
          {[...Array(1)].map((_, index) => (
            <div key={index} className="devvy">
              <Skeleton height={350} width={350} />
            </div>
          ))}
        </div>
      );
    case 'details':
      return (
        <div className='details-container'>
          <Link to="/listings">Back to all Listings</Link>
          <div className='details'>
            <div className='images-container'>
              <Swiper
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination]}
                className="mySwiper"
              >
                {[1, 2, 3].map((_, index) => (
                  <SwiperSlide key={index}>
                    <Skeleton height={500} />
                  </SwiperSlide>
                ))}
              </Swiper>
            
            </div>
            <div className='text-content'>
              <div className='text-header'>
                <h2><Skeleton width={150} /></h2>
                <p><Skeleton width={100} /></p>
              </div>
              <div className='host-info'>
                <Skeleton circle={true} height={50} width={50} />
                <div>
                  <p><Skeleton width={80} /></p>
                  <p><Skeleton width={100} /></p>
                </div>
              </div>
              <Skeleton width={120} height={40} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                <p style={{ margin: 0 }}><Skeleton width={50} /></p>
                <p style={{ margin: 0 }}><Skeleton width={100} /></p>
              </div>
              <p><Skeleton count={3} /></p>
              <div>
                <p className='offers-header'>What comes with this place!!!</p>
                <ul className='offers'>
                  {[1, 2, 3].map((_, index) => (
                    <li key={index}><Skeleton width={150} /></li>
                  ))}
                </ul>
              </div>
              <div className='more-info'>
                <div>
                  <h4><Skeleton width={100} /></h4>
                  {[1, 2, 3].map((_, index) => (
                    <p key={index}><Skeleton width={200} /></p>
                  ))}
                </div>
              </div>
             
            </div>
          </div>
        </div>
      );
    default:
      return <Skeleton height={20} width={`100%`} />;
  }
};

export default CustomSkeleton;
