import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { doc, getDoc } from "firebase/firestore"; 
import { db, auth } from '../../Firebase/Firebase';
import { onAuthStateChanged } from "firebase/auth";
import Modal from '../../components/Modal';
import CustomSkeleton from '../../components/Skeleton';
import ReviewForm from '../../components/ReviewForm';
import ReviewsList from '../../components/Reviewlist';
import profilepic from "../../assets/profileImage.jpg";

export default function Details() {
    const { id } = useParams();
    const [house, setHouse] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [hostProfilePic, setHostProfilePic] = useState(null);

    useEffect(() => {
        const fetchHouse = async () => {
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

    if (!house) {
        return <CustomSkeleton layout='details'/>;
    }

    const filteredDetailsBoys = house.detailsBoys.filter(room => room.trim() !== '');
    const filteredDetailsGirls = house.detailsGirls.filter(room => room.trim() !== '');

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
                        {house.images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img src={image} className='images' onClick={() => openModal(image)} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <Modal isOpen={isOpen} onClose={closeModal} imageSrc={selectedImage} />
                </div>
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
                    <button className='host-category'>{house.category}</button>
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
                    <ReviewForm listingId={id} currentUserId={currentUserId}/>
                    <ReviewsList listingId={id} currentUserId={currentUserId}/>
                </div>
            </div>
        </div>
    );
}
