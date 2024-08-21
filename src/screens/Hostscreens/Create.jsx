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
    rooms: '',
    amenities: '',
  });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listingId, setListingId] = useState(uniqueId);
  const [userUid, setUserUid] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [fade, setFade] = useState(true);
  const [errors, setErrors] = useState({});

  const schools = [
    { name: 'Cavendish Main', abbreviation: 'Cavendish Main' },
    { name: 'Cavendish LongAcres', abbreviation: 'Cavendish LA' },
    { name: 'UNZA', abbreviation: 'UNZA' },
    { name: 'ZCAS', abbreviation: 'ZCAS' },
    { name: 'UNILUS', abbreviation: 'UNILUS' },
  ];

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
          const userRef = doc(db, 'Users', userUid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFormData((prevState) => ({
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

  useEffect(() => {
    setFade(true);
  }, [currentStep]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedImages = e.target.files;
    if (selectedImages.length < 5 || selectedImages.length > 10) {
      toast.error('Please select between 5 and 10 images.');
      return;
    }
    setImages(selectedImages);
  };

  const compressImages = async (imageFiles) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressedFiles = await Promise.all(
        Array.from(imageFiles).map((file) => imageCompression(file, options))
      );
      return compressedFiles;
    } catch (error) {
      console.error('Error compressing images:', error);
      throw error;
    }
  };

  const uploadImages = async (compressedImages) => {
    try {
      const uploadPromises = compressedImages.map(async (image) => {
        const uniqueImageName = `${uuidv4()}-${image.name}`;
        const imageRef = ref(storage, `ListingImages/${uniqueImageName}`);
        await uploadBytes(imageRef, image);
        return getDownloadURL(imageRef);
      });

      const imageUrls = await Promise.all(uploadPromises);
      return imageUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.information) errors.information = 'Description is required';
    if (!formData.amenities) errors.amenities = 'Amenities are required';
    if (!formData.school) errors.school = 'School is required';
    if (!formData.time) errors.time = 'Walking time is required';
    if (!formData.gender) errors.gender = 'Gender specification is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please correct the errors before submitting.');
      return;
    }

    setIsLoading(true);

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
        rooms,
        amenities,
      } = formData;

      await addDoc(collection(db, 'Listings'), {
        approved: false,
        featured: false,
        listingId: listingId,
        uid: userUid,
        name,
        price: parseFloat(price),
        location: location.toLowerCase(),
        school,
        time,
        gender,
        hostName,
        hostNumber,
        category,
        information,
        rooms: rooms.split(',').map((item) => item.trim()),
        amenities: amenities.split(',').map((item) => item.trim()),
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
        rooms: '',
        amenities: '',
      });
      setImages([]);
      setListingId(uuidv4());
      toast.success('Listing created successfully!');
      setCurrentStep(1);
    } catch (error) {
      toast.error('Failed to create listing');
      console.error('Error creating listing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPreviewData = () => (
    <div className="preview-data">
      <h4 className="preview-title">Preview</h4>
      <div className="preview-info">
        {Object.entries(formData).map(([key, value]) => (
          <div className="preview-item" key={key}>
            <span className="preview-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
            <span className="preview-value">{value}</span>
          </div>
        ))}
      </div>
      <div className="preview-images">
        {Array.from(images).map((img, index) => (
          <img key={index} src={URL.createObjectURL(img)} alt={`preview-${index}`} className="preview-image" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="container2">
      <h3>Create a New Listing</h3>
      <div className="progress-bar">
        <div style={{ width: `${(currentStep / 5) * 100}%` }}></div>
      </div>
      <form className={`listing-form ${currentStep}`} onSubmit={handleSubmit}>
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className={`fade ${fade ? 'fade-active' : ''}`}>
            <div className="form-section">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter the name of the place"
                required
                disabled={isLoading}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}

              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="information"
                value={formData.information}
                onChange={handleInputChange}
                placeholder="Describe your listing in detail"
                required
                rows="4"
                disabled={isLoading}
              />
              {errors.information && <p className="error-text">{errors.information}</p>}

              <label htmlFor="school">Select School</label>
              <select
                id="school"
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              >
                <option value="">--Select School--</option>
                {schools.map((school) => (
                  <option key={school.abbreviation} value={school.name}>
                    {school.abbreviation}
                  </option>
                ))}
              </select>
              {errors.school && <p className="error-text">{errors.school}</p>}

              <label htmlFor="walking-time">Walking Time</label>
              <input
                type="text"
                id="walking-time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="Enter walking time in minutes"
                required
                disabled={isLoading}
              />
              {errors.time && <p className="error-text">{errors.time}</p>}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className={`fade ${fade ? 'fade-active' : ''}`}>
            <div className="form-section">
              <label htmlFor="gender">Gender Preference</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              >
                <option value="">--Select Gender--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="any">Male & Female</option>
              </select>
              {errors.gender && <p className="error-text">{errors.gender}</p>}

              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter the price per month"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className={`fade ${fade ? 'fade-active' : ''}`}>
            <div className="form-section">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              >
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Luxury">Luxury</option>
              </select>

              <label htmlFor="rooms">Rooms</label>
              <input
                type="text"
                id="rooms"
                name="rooms"
                value={formData.rooms}
                onChange={handleInputChange}
                placeholder="Enter room details separated by commas"
                disabled={isLoading}
              />

              <label htmlFor="hostName">Host Name</label>
              <input
                type="text"
                id="hostName"
                name="hostName"
                value={formData.hostName}
                onChange={handleInputChange}
                placeholder="Enter host's name"
                required
                disabled={isLoading}
              />

              <label htmlFor="hostNumber">Host Phone Number</label>
              <input
                type="text"
                id="hostNumber"
                name="hostNumber"
                value={formData.hostNumber}
                onChange={handleInputChange}
                placeholder="Enter host's phone number"
                required
                disabled={isLoading}
              />
          
            </div>
          </div>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <div className={`fade ${fade ? 'fade-active' : ''}`}>
            <div className="form-section">
              <label htmlFor="images">Upload Images</label>
              <input
                type="file"
                id="images"
                name="images"
                onChange={handleImageChange}
                accept="image/*"
                multiple
                disabled={isLoading}
              />
              {images.length > 0 && <p>{images.length} images selected</p>}
              <p>Please upload between 5 and 10 images.</p>
            </div>
            <div className="form-section">
              <label htmlFor="amenities">Amenities</label>
              <input
                type="text"
                id="amenities"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                placeholder="Enter amenities separated by commas"
                disabled={isLoading}
              />
              {errors.amenities && <p className="error-text">{errors.amenities}</p>}

              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter the location of the listing"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Step 5 */}
        {currentStep === 5 && (
          <div className={`fade ${fade ? 'fade-active' : ''}`}>
            {currentStep ==5 && getPreviewData()}
          </div>
        )}

        {/* Step Navigation */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button
              type="button"
              className="back-button"
              onClick={() => {
                setCurrentStep((prev) => prev - 1);
                setFade(false);
              }}
              disabled={isLoading}
            >
              Back
            </button>
          )}
          {currentStep < 5 && (
            <button
              type="button"
              className="next-button"
              onClick={() => {
                setCurrentStep((prev) => prev + 1);
                setFade(false);
              }}
              disabled={isLoading}
            >
              Next
            </button>
          )}
          {currentStep === 5 && (
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </form>

      {/* Preview Section */}
     
    </div>
  );
};

export default Create;
