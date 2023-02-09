import React from 'react';
import './image_gallery.scss';

function ImageGallery() {
  // eslint-disable-next-line no-unused-vars
  const item = (url) => (
    <a href="https://unsplash.com/@jeka_fe" target="_blank" className="gallery__link" rel="noreferrer">
      <figure className="gallery__thumb">
        <img src={url} alt="Portrait by Jessica Felicio" className="gallery__image" />
        <figcaption className="gallery__caption">Portrait by Jessica Felicio</figcaption>
      </figure>
    </a>
  );

  return (
    <div className="page-content">
      <section className="gallery">
        <div className="container"></div>
      </section>
    </div>
  );
}

export default ImageGallery;
