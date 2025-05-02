import React from "react";
import "../assets/about.css";

const About = () => {
  return (
    <div className="about">
      <header className="about__header">
        <h1 className="about__title">Welcome to WhiskerWatch</h1>
        <p className="about__subtitle">
          WhiskerWatch is dedicated to helping pets find their forever homes. Whether you're adopting or listing a pet, our platform connects you with the right companions.
        </p>
      </header>

      <section className="about__section about__mission">
        <h2 className="about__section-title">Our Mission</h2>
        <p className="about__text">
          We strive to create a compassionate community for pets in need. Our goal is to reduce the number of stray animals and ensure every pet finds a loving home.
        </p>
      </section>

      <section className="about__section about__services">
        <h2 className="about__section-title">What We Offer</h2>
        <div className="about__services-grid">
          <article className="about__service-item">
            <h3>Adopt a Pet</h3>
            <p>Browse available pets and adopt your next best friend — from playful kittens to loyal dogs.</p>
          </article>
          <article className="about__service-item">
            <h3>List Your Pet</h3>
            <p>Have a pet that needs a new home? Create a listing and connect with caring adopters.</p>
          </article>
          <article className="about__service-item">
            <h3>Lost and Found</h3>
            <p>Report lost or found pets. We help reunite families with their beloved companions.</p>
          </article>
        </div>
      </section>

      <section className="about__section about__contact">
        <h2 className="about__section-title">Get In Touch</h2>
        <p className="about__text">
          Need support or have questions? Email us at{" "}
          <a href="mailto:support@whiskerwatch.com" className="about__link">
            support@whiskerwatch.com
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default About;
