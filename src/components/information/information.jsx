import React, { useState, useEffect } from "react";
import "./Information.scss";
import DownloadButton from "../download/DownloadBtn";
import LikeBtn from "../like/LikeBtn.jsx";
import CloseBtn from "../CloseBtn/CloseBtn.jsx";

const InfoButton = ({ image, setIsModalOpen, onUnlike }) => {
  // States
  const [showModal, setShowModal] = useState(false);
  const [editableDescription, setEditableDescription] = useState(
    image.alt_description
  );
  const [likes, setLikes] = useState(image.likes);
  const [liked, setLiked] = useState(false); // Track liked state in modal

  useEffect(() => {
    // Check if image is liked and set initial state
    const likedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
    const isLiked = likedImages.some((img) => img.id === image.id);
    setLiked(isLiked);
  }, [image]);

  // Update local storage with the new description
  const saveDescription = () => {
    console.log("Description Updated");
    const updatedImage = { ...image, alt_description: editableDescription };
    const likedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
    const updatedLikedImages = likedImages.map((img) =>
      img.id === image.id ? updatedImage : img
    );
    localStorage.setItem("likedImages", JSON.stringify(updatedLikedImages));
  };

  // Handle Like Change
  const handleLikeChange = (liked) => {
    setLiked(liked); // Update liked state in modal
    setLikes((prevLikes) => (liked ? prevLikes + 1 : prevLikes - 1)); // Update like count in modal
    if (liked) {
      // Add image to liked images
      const likedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
      likedImages.push(image);
      localStorage.setItem("likedImages", JSON.stringify(likedImages));
    } else {
      // Remove image from liked images
      const likedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
      const updatedLikedImages = likedImages.filter(
        (img) => img.id !== image.id
      );
      localStorage.setItem("likedImages", JSON.stringify(updatedLikedImages));
      // Send unLike to parent
      if (typeof onUnlike === "function") {
        onUnlike(image.id);
      }
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    if (typeof setIsModalOpen === "function") {
      setIsModalOpen(false);
    }
  };

  // Show modal
  const openModal = () => {
    setShowModal(true);
    if (typeof setIsModalOpen === "function") {
      setIsModalOpen(true);
    }
  };

  return (
    <div>
      <button className="info__button" onClick={openModal}>
        <img src="/images/information.png" alt="Information" />
      </button>

      {showModal && (
        <div className="image__modal" onClick={closeModal}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <CloseBtn closeModal={closeModal} />
            <img src={image.urls.regular} alt={image.alt_description} />

            <div className="image__details">
              <div className="description__editor">
                <h1 className="description__editor__h1">Information</h1>
                <textarea
                  value={editableDescription}
                  onChange={(e) => setEditableDescription(e.target.value)}
                />
                <div className="like__button__modal">
                  <LikeBtn image={image} onLikeChange={handleLikeChange} />{" "}
                  <p className="Like__number">{likes}</p>
                </div>
                <div className="download__button__modal">
                  <DownloadButton image={image} />
                </div>
              </div>

              <p className="modal__dimensions">
                {image.width}x{image.height}
              </p>
              <button className="save__button" onClick={saveDescription}>
                <img
                  src="/images/Save.png"
                  alt="Saved Logo"
                  className="save__button__logo"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoButton;
