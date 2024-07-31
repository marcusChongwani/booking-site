import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore"; 
import { db, auth } from '../../Firebase/Firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useMediaQuery } from 'react-responsive';
import Modal from '../../components/Modal';
import CustomSkeleton from '../../components/Skeleton';
import ReviewForm from '../../components/ReviewForm';
import ReviewsList from '../../components/Reviewlist';
import profilepic from "../../assets/profileImage.jpg";
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import ContactHostButton from '../../components/hostButton';

export default function Details() {
    const { id } = useParams();
    const [house, setHouse] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [hostProfilePic, setHostProfilePic] = useState(null);
    const [loading, setLoading] = useState(true);

    const isLargeScreen = useMediaQuery({ query: '(min-width: 700px)' });

    useEffect(() => {
        const fetchHouse = async () => {
            setLoading(true);
            const docRef = doc(db, "Listings", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const houseData = docSnap.data();
                setHouse(houseData);

                // Fetch host's profile picture from Users document
                const userRef = doc(db, "Users", houseData.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setHostProfilePic(userData.profilePic);
                }
            } else {
                console.log("No such document!");
            }
            setLoading(false);
        };

        fetchHouse();
    }, [id]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserId(user.uid);
            } else {
                setCurrentUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleTextHost = (number, name) => {
        const whatsappMessage = encodeURIComponent(`**vistra.netlify.app** Is there still space at your boarding house ${name}`);
        const whatsappLink = `https://wa.me/+26${number}?text=${whatsappMessage}`;
        window.location.href = whatsappLink;
    };

    const openModal = (imageSrc) => {
        setSelectedImage(imageSrc);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedImage(null);
    };

    if (loading) {
        return <CustomSkeleton layout='details' />;
    }

    if (!house) {
        return <div>No house data found.</div>;
    }

    const filteredDetailsBoys = house.detailsBoys.filter(room => room.trim() !== '');
    const filteredDetailsGirls = house.detailsGirls.filter(room => room.trim() !== '');

    return (
        <div className='details-container'>
            <Link to="/listings">Back to all Listings</Link>
            <div className='details'>
                <div className='images-container'>
                    {isLargeScreen ? (
                        <div className='gallery'>
                            <div className='main-image'>
                                <img src={house.images[0]} onClick={() => openModal(house.images[0])} />
                            </div>
                            <div className='thumbnails'>
                                {house.images.slice(1, 5).map((image, index) => (
                                    <img key={index} src={image} onClick={() => openModal(image)} />
                                ))}
                                {house.images.length > 5 && (
                                    <div className='more-images' onClick={() => openModal(house.images[5])}>
                                        <p>Show all photos</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Swiper
                            spaceBetween={30}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[Pagination]}
                            className="mySwiper"
                        >
                           {house.images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <img src={image} className='images' onClick={() => openModal(image)} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                    <Modal isOpen={isOpen} onClose={closeModal} imageSrc={selectedImage} />
                </div>
                <div className='text-content2'>
                    <div className='text-content'>
                        <div className='text-header'>
                            <h2>{house.name}</h2>
                            <p>K{house.price}/mon</p>
                        </div>
                        <div className='host-info'>
                            <img src={hostProfilePic || profilepic} className='host-image' alt="Host Profile" />
                            <div>
                                <p>Hosted by</p>
                                <p>{house.hostName}</p>
                            </div>
                        </div>
                        <button className='category'>{house.category}</button>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, marginBottom: 20 }}>
                            <p style={{ margin: 0 }}>{house.gender}</p>
                            <p style={{ margin: 0 }}>{house.time} from {house.school}</p>
                        </div>
                        <p>{house.information}</p>
                        <div style={{ marginTop: 10, marginBottom: 20 }}>
                            <p className='offers-header'>What comes with this place!!!</p>
                            <ul className='offers'>
                                {house.amenities.map((offer, index) => (
                                    <li key={index}>{offer}</li>
                                ))}
                            </ul>
                        </div>
                        <div className='more-info'>
                            {filteredDetailsBoys.length > 0 && (
                                <div>
                                    <h4>Male rooms</h4>
                                    {filteredDetailsBoys.map((room, index) => (
                                        <p key={index}>{room}</p>
                                    ))}
                                </div>
                            )}
                            {filteredDetailsGirls.length > 0 && (
                                <div>
                                    <h4>Female rooms</h4>
                                    {filteredDetailsGirls.map((room, index) => (
                                        <p key={index}>{room}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className='contactHost' onClick={() => handleTextHost(house.hostNumber, house.hostName)}>Contact Host</button>
                    </div>
                    <div>
                        <ReviewForm listingId={id} currentUserId={currentUserId} />
                        <ReviewsList listingId={id} currentUserId={currentUserId} />
                    </div>
                </div>
            </div>
        </div>
    );
}
