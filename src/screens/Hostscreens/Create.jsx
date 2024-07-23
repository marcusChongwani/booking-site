import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../Firebase/Firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';

const Create = () => {
  const uniqueId = uuidv4();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    location: '',
    school: '',
    time: '',
    gender: '',
    hostName: '',
    hostNumber: '',
    category: 'Basic',
    information: '',
    detailsBoys: '',
    detailsGirls: '',
    amenities: '',
  });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listingId, setListingId] = useState(uniqueId);
  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    const fetchUserUid = () => {
      const user = auth.currentUser;
      if (user) {
        setUserUid(user.uid);
      } else {
        toast.error('User not logged in.');
        setIsLoading(false);
      }
    };

    fetchUserUid();
  }, []);

  useEffect(() => {
    const fetchHostInfo = async () => {
      if (userUid) {
        try {
          const userRef = doc(db, 'Users', userUid); // Adjust 'Users' to your collection name
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFormData(prevState => ({
              ...prevState,
              hostName: userData.name || '',
              hostNumber: userData.phone || '',
            }));
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching host information:', error);
        }
      }
    };

    fetchHostInfo();
  }, [userUid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const compressImages = async (imageFiles) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    const compressedFiles = await Promise.all(
      Array.from(imageFiles).map(file => imageCompression(file, options))
    );

    return compressedFiles;
  };

  const uploadImages = async (compressedImages) => {
    const uploadPromises = compressedImages.map(async (image) => {
      const uniqueImageName = `${uuidv4()}-${image.name}`;
      const imageRef = ref(storage, `ListingImages/${uniqueImageName}`);
      await uploadBytes(imageRef, image);
      return getDownloadURL(imageRef);
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userUid) {
      toast.error('User not authenticated');
      setIsLoading(false);
      return;
    }

    const createListingPromise = (async () => {
      try {
        const compressedImages = await compressImages(images);
        const imageUrls = await uploadImages(compressedImages);
        const {
          name,
          price,
          location,
          school,
          time,
          gender,
          hostName,
          hostNumber,
          category,
          information,
          detailsBoys,
          detailsGirls,
          amenities,
        } = formData;

        await addDoc(collection(db, 'Listings'), {
          approved: false,
          featured: false,
          listingId: listingId,
          uid: userUid,
          name,
          price: parseFloat(price), // Convert to float if needed
          location,
          school,
          time,
          gender,
          hostName,
          hostNumber,
          category,
          information,
          detailsBoys: detailsBoys.split(',').map(item => item.trim()),
          detailsGirls: detailsGirls.split(',').map(item => item.trim()),
          amenities: amenities.split(',').map(item => item.trim()),
          images: imageUrls,
        });

        setFormData({
          name: '',
          price: '',
          location: '',
          school: '',
          time: '',
          gender: '',
          hostName: '',
          hostNumber: '',
          category: 'Basic',
          information: '',
          detailsBoys: '',
          detailsGirls: '',
          amenities: '',
        });
        setImages([]);
        setListingId(uuidv4());
      } catch (error) {
        console.error('Error adding document:', error);
        throw new Error('Failed to create listing');
      }
    })();

    toast.promise(createListingPromise, {
      pending: 'Creating listing, please wait...',
      success: 'Listing created successfully!',
      error: 'Failed to create listing',
    });

    createListingPromise.finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="container2">
      <h3>Create a New Listing</h3>
      <div>
        <form className="listing-form" onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" required name="name" value={formData.name} onChange={handleInputChange} />

          <label htmlFor="images">Images</label>
          <input type="file" id="images" name="images" multiple onChange={handleImageChange} className="file-input" />

          <div className="form-row">
            <div className="half">
              <label htmlFor="cat">Category</label>
              <select id="cat" name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="Basic">Basic</option>
                <option value="Midrange">Midrange</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div className="half2">
              <label htmlFor="gen">Gender</label>
              <input type="text" id="gen" name="gender" value={formData.gender} onChange={handleInputChange} required />
            </div>
          </div>

          <label htmlFor="description">Description</label>
          <input type="text" id="description" name="information" value={formData.information} onChange={handleInputChange} required rows="4" />

          <div className="form-row">
            <div className="half">
              <label htmlFor="price">Price per month</label>
              <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} required />
            </div>
            <div className="half2">
              <label htmlFor="location">Location</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="half">
              <label htmlFor="school">Nearby school</label>
              <input type="text" id="school" name="school" value={formData.school} onChange={handleInputChange} />
            </div>
            <div className="half2">
              <label htmlFor="time">Time</label>
              <input type="text" id="time" name="time" value={formData.time} onChange={handleInputChange} />
            </div>
          </div>

          <label htmlFor="amenities">Amenities (comma-separated)</label>
          <input type="text" id="amenities" name="amenities" value={formData.amenities} onChange={handleInputChange} required />
          <label htmlFor="male">Male rooms (comma-separated)</label>
          <input type="text" id="male" name="detailsBoys" value={formData.detailsBoys} onChange={handleInputChange} />

          <label htmlFor="female">Female rooms (comma-separated)</label>
          <input type="text" id="female" name="detailsGirls" value={formData.detailsGirls} onChange={handleInputChange} />

          <button type="submit" disabled={isLoading}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Create;
