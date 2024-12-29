import React, { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteContent, setFavoriteContent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // Check if the token is valid
  const isTokenValid = (token) => {
    return token !== null && token !== '';
  };

  // Fetch favorites when component mounts
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = getToken();
      console.log('Fetching favorites with token:', token);

      if (!isTokenValid(token)) {
        console.error('No valid token found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/favorites', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched favorites:', data);

          // Enrich the favorite content with title and image
          const enrichedData = await Promise.all(
            data.map(async (item) => {
              const mediaType = item.media_type;
              const url = `https://api.themoviedb.org/3/${mediaType === 'movie' ? 'movie' : 'tv'}/${item.content_id}?api_key=bfbc42cc51a737715f9ab554c951d6ad`;

              const mediaResponse = await fetch(url);
              const mediaData = await mediaResponse.json();

              return {
                ...item,
                title: mediaType === 'tv' ? mediaData.name : mediaData.title,
                poster_path: mediaData.poster_path
                  ? `https://image.tmdb.org/t/p/w500${mediaData.poster_path}`
                  : 'path/to/fallback-image.jpg',
              };
            })
          );

          setFavoriteContent(enrichedData);
        } else {
          console.error('Failed to fetch favorites:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const addToFavorites = async (content) => {
    const token = getToken();
    
    if (!isTokenValid(token)) {
      console.error('No valid token found');
      return;
    }

    // Log the incoming content object
    console.log('Original content object:', content);

    try {
      // Ensure content.id exists
      if (!content.id) {
        console.error('Content ID is missing');
        return;
      }

      // Ensure mediaType exists
      if (!content.mediaType) {
        console.error('Media type is missing');
        return;
      }

      const favoriteData = {
        content_id: content.id.toString(), // Convert to string since content_id is VARCHAR
        media_type: content.mediaType.toLowerCase() // Ensure it's lowercase
      };

      // Log the prepared data
      console.log('Prepared favorite data:', favoriteData);

      // Validate media_type
      if (!['movie', 'tv'].includes(favoriteData.media_type)) {
        console.error('Invalid media type:', favoriteData.media_type);
        return;
      }

      console.log('Sending request to add to favorites:', JSON.stringify(favoriteData));
      
      const response = await fetch('http://localhost:5000/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(favoriteData)
      });

      console.log('Response status:', response.status);
      
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        console.log('Successfully added to favorites:', responseData);
        setFavoriteContent(prev => [...prev, responseData]);
      } else {
        console.error('Error response:', responseData);
        throw new Error(responseData.message || 'Error adding to favorites');
      }
    } catch (error) {
      console.error('Error in addToFavorites:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
  };

  const removeFromFavorites = async (contentId) => {
    const token = getToken();
    console.log('Removing from favorites with token:', token);

    if (!isTokenValid(token)) {
      console.error('No valid token found');
      return;
    }

    try {
      console.log('Sending request to remove from favorites for content ID:', contentId);
      const response = await fetch(`http://localhost:5000/favorites/${contentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status for remove from favorites:', response.status);
      if (response.ok) {
        console.log('Removed from favorites:', contentId);
        setFavoriteContent(favoriteContent.filter(item => item.id !== contentId));
      } else {
        console.error('Failed to remove from favorites:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <FavoritesContext.Provider 
      value={{ 
        favoriteContent, 
        addToFavorites, 
        removeFromFavorites, 
        loading 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
