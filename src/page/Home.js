import '../style/home_style.css';
import { useNavigate } from "react-router-dom";
import howWorkInfo from '../resources/how-work-info.svg';
import mainInfo from '../resources/main-info.svg';
import universityIcon from '../resources/university-icon.svg';
import Header from "./Header";

const Home = () => {


    const categories = [
        "Code & Programming",
        "Design & Art",
        "Data Science",
        "Marketing",
        "Business Development",
        "Engineering",
    ];

    const students = [
        "Student",
        "Student",
        "Student",
        "Student",
        "Student",
        "Student",
    ];

    const universities = [
        {
            name: "SDU university",
            location: "Almaty",
            rating: 4.9,
            logo: "sdu-logo.svg",
        },
        {
            name: "KBTU",
            location: "Almaty",
            rating: 4.8,
            logo: "kbtu-logo.svg",
        },
        {
            name: "AITU",
            location: "Astana",
            rating: 4.7,
            logo: "aitu-logo.svg",
        },
        {
            name: "IITU",
            location: "Almaty",
            rating: 4.7,
            logo: "iitu-logo.svg",
        },
        {
            name: "AITU",
            location: "Astana",
            rating: 4.7,
            logo: "aitu-logo.svg",
        },
        {
            name: "IITU",
            location: "Almaty",
            rating: 4.7,
            logo: "iitu-logo.svg",
        },
    ];

    const companies = [
        "Kaspi",
        "Kaspi",
        "Kaspi",
        "Kaspi",
        "Kaspi",
        "Kaspi",
    ];

    return (
        <div className="home_container">
            <Header/>
            <main className="home_content">
                <section className="home_search">
                    <div className="steps-container">
                        <img src={mainInfo} className="mainInfo"></img>
                    </div>
                </section>

                <section className="how-work-section">
                    <div className="steps-container">
                        <img src={howWorkInfo} className="howWorkInfo"></img>
                    </div>
                </section>

                <section className="home_universities">
                    <h2>Top Universities</h2>
                    <div className="home_university_grid">
                        {universities.map((university, index) => (
                            <div key={index} className="home_university_item">
                                <div className="item_container">
                                    <img
                                        src={universityIcon}
                                        alt={`${university.name} Logo`}
                                        className="university_logo"
                                    />
                                    <div className="location_container">
                                        <h3>{university.name}</h3>
                                        <p className="university_location">
                                            <i className="location_icon"></i>
                                            <span className="location_name">{university.location}</span>
                                        </p>
                                    </div>
                                </div>
                                <button className="profile_button">
                                    <span className="profile_button_text">Open Profile</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
