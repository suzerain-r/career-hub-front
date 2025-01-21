import '../styles/footer.css';

const Footer = () => {
    return (
        <footer className="home_footer">
            <div className="footer_content">
                <div className="footer_section">
                    <div className="footer_logo">
                        <i className="footer_logo_icon"></i> CareerHub
                    </div>
                    <p>Call now: <strong>8777-777-77-77</strong></p>
                    <p className="footer_location_name">Almaty, Kaskelen, SDU University</p>
                </div>
                <div className="footer_section">
                    <h3>Quick Link</h3>
                    <ul>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>
                <div className="footer_section">
                    <h3>Support</h3>
                    <ul>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer_bottom">
                <p>© 2024 CareerHub - Job Portal. All rights reserved</p>
                <div className="social_icons">
                    <a href="#"><i className="icon-facebook"></i></a>
                    <a href="#"><i className="icon-youtube"></i></a>
                    <a href="#"><i className="icon-instagram"></i></a>
                    <a href="#"><i className="icon-twitter"></i></a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;