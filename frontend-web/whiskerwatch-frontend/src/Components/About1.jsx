import React from "react";
import "../assets/about.css";

function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1 className="about-title">Welcome to WhiskerWatch</h1>
        <p className="about-subtext">
          WhiskerWatch is dedicated to helping pets find their forever homes. Whether you're adopting or listing a pet, our platform makes it easy for you to connect with the right pet for you.
        </p>
      </header>

      <section className="about-content">
        <div className="about-mission">
          <h2 className="section-heading">Our Mission</h2>
          <p>
            At WhiskerWatch, we strive to create a safe and loving community for pets in need of a forever home. Our mission is to reduce the number of abandoned and stray animals, while ensuring they find the right family.
          </p>
        </div>

        <div className="about-services">
          <h2 className="section-heading">What We Offer</h2>
          <div className="service-item">
            <h3>Adopt a Pet</h3>
            <p>
              Browse through available pets and adopt a furry friend. We help you find the best match, whether it's a playful kitten or a loyal dog.
            </p>
          </div>

          <div className="service-item">
            <h3>List Your Pet</h3>
            <p>
              Have a pet or stray animal in need of a new home? List your pet on WhiskerWatch and connect with potential adopters who care.
            </p>
          </div>

          <div className="service-item">
            <h3>Lost and Found</h3>
            <p>
              If your pet has gone missing or you've found a pet, report it on WhiskerWatch. Our platform helps reunite pets with their owners quickly.
            </p>
          </div>
        </div>

        <div className="about-contact">
          <h2 className="section-heading">Get In Touch</h2>
          <p>
            Have questions or need support? Feel free to reach out to us at <a href="mailto:support@whiskerwatch.com">support@whiskerwatch.com</a>.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
