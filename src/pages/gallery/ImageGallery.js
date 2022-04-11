import React from 'react'
import './image_gallery.scss'




const ImageGallery = () => {





    const item = (url) => {
        return <a href="https://unsplash.com/@jeka_fe" target="_blank" className="gallery__link">
            <figure className="gallery__thumb">
                <img src={url} alt="Portrait by Jessica Felicio" className="gallery__image" />
                <figcaption className="gallery__caption">Portrait by Jessica Felicio</figcaption>
            </figure>
        </a>
    }




    return (
        <React.Fragment>

            <div className="page-content">

                <section class="gallery">
                    <div class="container">
                        
                    </div>
                </section>


            </div>
        </React.Fragment>
    )
}

export default ImageGallery
