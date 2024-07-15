import "./ImageGallery.scss";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//  API Thunks
import {
  getImagesThunk,
  getSearchedImagesThunk,
  loadMoreImagesThunk,
} from "../../features/images/imageThunk.js";

//  API
import {
  imagesDataSelector,
  imagesStatusSelector,
  imagesErrorSelector,
} from "../../features/images/imageSlice.js";

// Components
import Tools from "../tools/Tools.jsx";
import LoadMoreButton from "../load/Load.jsx";
import InfoButton from "../information/information.jsx";
import DownloadButton from "../download/DownloadBtn.jsx";
import LikeButton from "../like/LikeBtn.jsx";

// Components to Display
const ImageGallery = () => {
  const dispatch = useDispatch();
  const images = useSelector(imagesDataSelector);
  const status = useSelector(imagesStatusSelector);
  const error = useSelector(imagesErrorSelector);
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [likes, setLikes] = useState({});

  // Fetch images
  useEffect(() => {
    if (query === "") {
      dispatch(getImagesThunk());
    } else {
      dispatch(getSearchedImagesThunk(query));
    }
  }, [query, dispatch]);

  // Search
  const handleSearchChange = (searchQuery) => {
    setQuery(searchQuery);
  };

  //Sort options
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Load More images
  const loadMoreImages = () => {
    dispatch(loadMoreImagesThunk());
  };

  //Like count
  useEffect(() => {
    const initialLikes = {};
    images.forEach((image) => {
      initialLikes[image.id] = image.likes;
    });
    setLikes(initialLikes);
  }, [images]);

  // Chmages in Liked
  const handleLikeChange = (liked, imageId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [imageId]: liked ? prevLikes[imageId] + 1 : prevLikes[imageId] - 1,
    }));
  };

  //  Sort images
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
    <>
      <Tools
        query={query}
        onSearchChange={handleSearchChange}
        sortOption={sortOption}
        onSortChange={handleSortChange}
      />

      {status === "pending" && <p>Loading...</p>}

      {status === "rejected" && <p>Error: {error.message}</p>}

      <div className="image__gallery">
        {sortedImages.map((image) => (
          <div key={image.id} className="image__container">
            <InfoButton image={image} />

            <img
              src={image.urls.small}
              alt={image.alt_description}
              className="gallery__image"
            />

            <LikeButton
              image={image}
              onLikeChange={(liked) => handleLikeChange(liked, image.id)}
            />

            <DownloadButton image={image} />
          </div>
        ))}
      </div>

      <LoadMoreButton onLoadMore={loadMoreImages} />
    </>
  );
};

export default ImageGallery;
