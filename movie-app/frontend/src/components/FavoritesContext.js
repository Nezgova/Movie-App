import React, { createContext, useContext, useState } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteContent, setFavoriteContent] = useState([]);
  return (
    <FavoritesContext.Provider value={{ favoriteContent, setFavoriteContent }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
