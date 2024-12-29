import React, { useEffect, useState, useRef } from "react";
import { useFavorites } from "./FavoritesContext";
import { useNavigate } from "react-router-dom";
import ContentGrid from "./ContentGrid";
import "./Profile.css";

const ProfilePage = () => {
  const { favoriteContent, loading } = useFavorites();
  const [enrichedContent, setEnrichedContent] = useState([]);
  const [userData, setUserData] = useState({
    profile_picture: '',
    created_at: '',
    username: '',
    email: '',
    full_name: '',
    phone_number: '',
    birthday: ''
  });
  const [message, setMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user'); // Replace with your backend API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success) {
          setUserData(data.user); // Set the user data from the backend response
        } else {
          setMessage('Error fetching user data');
        }
      } catch (error) {
        setMessage('Error fetching user data');
        console.error('Fetch user data error:', error);
      }
    };
  
    fetchUserData();
  }, []);
  

  // Fetch enriched content
  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        const enrichedResults = await Promise.all(
          favoriteContent.map(async (item) => {
            const type = item.mediaType;
            const url = `https://api.themoviedb.org/3/${type}/${item.id}?api_key=bfbc42cc51a737715f9ab554c951d6ad`;

            const response = await fetch(url);
            const data = await response.json();

            // Get the image from poster_path or backdrop_path
            const image = data.poster_path
              ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
              : data.backdrop_path
              ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}`
              : '/LOGO.png'; // Fallback to logo image

            return {
              ...item,
              title: type === 'tv' ? data.name : data.title,
              image: image,
            };
          })
        );
        
        setEnrichedContent(enrichedResults);
      } catch (error) {
        console.error('Error fetching content details:', error);
      }
    };

    if (favoriteContent.length > 0) {
      fetchContentDetails();
    }
  }, [favoriteContent]);

  const handleContentClick = (id, mediaType) => {
    const route = mediaType === "tv" ? `/seriedetail/${id}` : `/movie/${id}`;
    navigate(route);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData((prevState) => ({
        ...prevState,
        profile_picture: URL.createObjectURL(file)
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/user', { // Replace with the correct endpoint to update the profile
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (result.success) {
        setMessage('Profile saved successfully!');
      } else {
        setMessage('Error saving profile');
      }
    } catch (error) {
      setMessage('Error saving profile');
      console.error(error);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/user', { // Replace with correct API endpoint for deleting user
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        setMessage('Account deleted successfully!');
        setShowDeleteModal(false);
        // Redirect or handle logout after deletion
      } else {
        setMessage('Error deleting account');
      }
    } catch (error) {
      setMessage('Error deleting account');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <h1>Your Favorites</h1>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  const favoriteMovies = enrichedContent.filter((item) => item.mediaType === "movie");
  const favoriteSeries = enrichedContent.filter((item) => item.mediaType === "tv");

  return (
    <div className="profile-page">{/* Profile Section */}
      <div className="profile-section">
        <div className="profile-content">
          <div className="profile-info">
            <div className="profile-picture-section">
              <div className="profile-picture">
                <img src={userData.profile_picture || "https://via.placeholder.com/200"} alt="Profile" />
              </div>
              <button className="change-picture-btn" onClick={() => fileInputRef.current.click()}>
                Change Picture
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <div className="member-since">
                <span>🕒</span>
                <span>Member Since</span>
                <div className="date">{new Date(userData.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="profile-details">
              <div className="input-group">
                <label>
                  <span>👤</span>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  readOnly
                />
              </div>

              <div className="input-group">
                <label>
                  <span>📧</span>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  readOnly
                />
              </div>

              <div className="input-group">
                <label>
                  <span>📝</span>
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={userData.full_name || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="input-group">
                <label>
                  <span>📞</span>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={userData.phone_number}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="input-group">
                <label>
                  <span>🎂</span>
                  Birthday
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={userData.birthday || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <div className="save-section">
              <button className="save-profile-btn" onClick={handleSaveProfile}>
                SAVE PROFILE
              </button>
              {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                  {message}
                </div>
              )}
            </div>
            <button className="delete-account-btn" onClick={handleDeleteClick}>
              DELETE ACCOUNT
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Delete Account</h2>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="modal-cancel" onClick={handleDeleteCancel}>
                Cancel
              </button>
              <button className="modal-delete" onClick={handleDeleteConfirm}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      <h1>Your Favorites</h1>

      <div className="favorites-section">
        <h2>Favorite Movies</h2>
        {favoriteMovies.length > 0 ? (
          <ContentGrid
            content={favoriteMovies.map((item) => ({
              ...item,
              poster_path: item.image.replace("https://image.tmdb.org/t/p/w500", ""),
              media_type: "movie"
            }))}
            onClick={handleContentClick}
            isProfilePage={true}
          />
        ) : (
          <p className="no-favorites">No favorite movies yet!</p>
        )}
      </div>

      <div className="favorites-section">
        <h2>Favorite Series</h2>
        {favoriteSeries.length > 0 ? (
          <ContentGrid
            content={favoriteSeries.map((item) => ({
              ...item,
              poster_path: item.image.replace("https://image.tmdb.org/t/p/w500", ""),
              media_type: "tv"
            }))}
            onClick={handleContentClick}
            isProfilePage={true}
          />
        ) : (
          <p className="no-favorites">No favorite series yet!</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;


