// Contact.jsx
import React from "react";
import "../assets/contact.css"; // Import the CSS for styling

function Contact() {
  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>If you have any questions or need assistance, feel free to reach out to us!</p>
      </header>

      <section className="contact-info">
        <div className="contact-item">
          <h3>Our Address</h3>
          <p>1234 Pet Street, Animal Town, PA 56789</p>
        </div>

        <div className="contact-item">
          <h3>Phone</h3>
          <p>+1 (123) 456-7890</p>
        </div>

        <div className="contact-item">
          <h3>Email</h3>
          <p>contact@whiskerwatch.com</p>
        </div>

        <div className="contact-item">
          <h3>Social Media</h3>
          <p>Follow us on:</p>
          <ul className="social-links">
            <li><a href="https://www.facebook.com/groups/cebudog" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://x.com/PAWSPhilippines" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://www.instagram.com/adopt.ph/?hl=en" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Contact;
