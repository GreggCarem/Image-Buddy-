import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getImagesThunk,
  getSearchedImagesThunk,
} from "../../features/images/imageThunk.js";
import {
  imagesDataSelector,
  imagesStatusSelector,
  imagesErrorSelector,
} from "../../features/images/imageSlice.js";
import Tools from "../tools/Tools.jsx";
import "./ImageGallery.scss";

const ImageGallery = () => {
  const dispatch = useDispatch();
  const images = useSelector(imagesDataSelector);
  const status = useSelector(imagesStatusSelector);
  const error = useSelector(imagesErrorSelector);
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("date");

  useEffect(() => {
    if (query === "") {
      dispatch(getImagesThunk());
    } else {
      dispatch(getSearchedImagesThunk(query));
    }
  }, [query, dispatch]);

  const handleSearchChange = (searchQuery) => {
    setQuery(searchQuery);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const sortedImages = [...images].sort((a, b) => {
    switch (sortOption) {
      case "width":
        return b.width - a.width;
      case "height":
        return b.height - a.height;
      case "date":
        return new Date(b.created_at) - new Date(a.created_at);
      case "likes":
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  return (
    <div>
      <Tools
        query={query}
        onSearchChange={handleSearchChange}
        sortOption={sortOption}
        onSortChange={handleSortChange}
      />
      {status === "pending" && <p>Loading...</p>}
      {status === "rejected" && <p>Error: {error.message}</p>}
      <div className="image-gallery">
        {sortedImages.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;