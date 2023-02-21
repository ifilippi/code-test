import YouTubePlayer from './YoutubePlayer';
import '../styles/modal-video.scss';
import React, { useRef, useEffect } from "react";

const Movies = ({ videoKey, closeModal }) => {

  // Creates an event listener that listens for clicks outside of the passed ref
  // If a click outside of the passed ref is detected, the passed callback
  // function is executed
  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      // Adds an event listener to the document to detect clicks outside of
      // the app. It is used to close the app when the user clicks outside of it.
      const handleClickOutside = (event) => {
        if (ref.current && ref.current.contains(event.target)) {
          closeModal();
        }
      }

      // Adds an event listener to the document that triggers
      // This event listener will then call the function handleClickOutside
      // when the user clicks anywhere on the page
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        // Adds an event listener to the document that removes an event listener
        // from the document when the user clicks outside of the document.
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <div ref={wrapperRef} className='modal-video' data-testid="modal-video">
      <YouTubePlayer videoKey={videoKey} />
      <button className='close-modal' onClick={closeModal}>X</button>
    </div>
  )
}

export default Movies
