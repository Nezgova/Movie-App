import React, { useEffect, useState, useRef } from "react";
import { useFavorites } from "./FavoritesContext";
import { useNavigate } from "react-router-dom";
import ContentGrid from "./ContentGrid";
import "./Profile.css";
import { AppContainer, PageContainer, Section } from "./layout/Layout";

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

  // Fetch user data with authentication
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Add a console.log to debug the token
        console.log('Token:', token);

        const response = await fetch('http://localhost:5000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'  // Add this line
          }
        });

        // Add console.logs for debugging
        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response text:', responseText);

        // Parse the response only if it's valid JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse JSON:', e);
          throw new Error('Invalid JSON response from server');
        }

        if (response.ok) {
          setUserData(data);
          setMessage('');
        } else {
          throw new Error(data.message || 'Failed to fetch user data');
        }
      } catch (error) {
        setMessage('Error fetching user data: ' + error.message);
        console.error('Fetch user data error:', error);

        // If unauthorized, redirect to login
        if (error.message.includes('401') || error.message.includes('403')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Set enriched content from favoriteContent
  useEffect(() => {
    setEnrichedContent(favoriteContent);
  }, [favoriteContent]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('profile_picture', file);

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/user/upload-profile-picture', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(prevState => ({
            ...prevState,
            profile_picture: data.profile_picture_url
          }));
          setMessage('Profile picture updated successfully');
        } else {
          setMessage('Error uploading profile picture');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setMessage('Error uploading profile picture');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/user/edit', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: userData.full_name,
          phone_number: userData.phone_number,
          birthday: userData.birthday,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Profile saved successfully!');
      } else {
        setMessage(result.message || 'Error saving profile');
      }
    } catch (error) {
      setMessage('Error saving profile');
      console.error('Save profile error:', error);
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/user/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.removeItem('token');
        setMessage('Account deleted successfully!');
        setShowDeleteModal(false);
        navigate('/login');
      } else {
        setMessage(result.message || 'Error deleting account');
      }
    } catch (error) {
      setMessage('Error deleting account');
      console.error('Delete account error:', error);
    }
  };

  const handleContentClick = (id, mediaType) => {
    const route = mediaType === "tv" ? `/seriedetail/${id}` : `/movie/${id}`;
    navigate(route);
  };

  const handleRemoveFavorite = (id) => {
    setEnrichedContent((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <div className="profile-page">
        <h1>Your Favorites</h1>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <AppContainer>
      <PageContainer>
        <div className="profile-page">
          <div className="profile-section glass-panel">
            <div className="profile-content">
              <div className="profile-info">
                <div className="profile-picture-section">
                  <div className="profile-picture">
                    <img
                      src={userData.profile_picture
                        ? `http://localhost:5000${userData.profile_picture}`
                        : "https://via.placeholder.com/200"}
                      alt="Profile"
                    />
                  </div>
                  <button className="change-picture-btn" onClick={() => fileInputRef.current.click()}>
                    Change Picture
                  </button>
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                  <div className="member-since">
                    <span>🕒</span>
                    <span>Member Since</span>
                    <div className="date">{userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'Loading...'}</div>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="input-group">
                    <label>
                      <span>👤</span>
                      Username
                    </label>
                    <input type="text" name="username" value={userData.username || ''} readOnly />
                  </div>

                  <div className="input-group">
                    <label>
                      <span>📧</span>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email || ''}
                      readOnly
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
                      value={userData.phone_number || ''}
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

          <Section title="Your favorites" subtitle="Saved titles and curated picks">
            {enrichedContent.length > 0 ? (
              <ContentGrid content={enrichedContent} onClick={handleContentClick} isProfilePage={true} onRemoveFavorite={handleRemoveFavorite} />
            ) : (
              <div className="empty-state">
                <p>No favorites yet. Browse the catalog and save your next watch.</p>
              </div>
            )}
          </Section>
        </div>
      </PageContainer>
    </AppContainer>
  );
};

export default ProfilePage;
