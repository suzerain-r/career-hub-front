import '../style/home_style.css';
import { useNavigate } from "react-router-dom";
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
        "SDU University",
        "SDU University",
        "SDU University",
        "SDU University",
        "SDU University",
        "SDU University",
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
                    <h2>Find a worker who suits your interests & requirements.</h2>
                    <p>Look for employees to grow your companies among the best students.</p>
                </section>

                <section className="home_categories">
                    <h2>Popular Categories</h2>
                    <div className="home_category_grid">
                        {categories.map((category, index) => (
                            <div key={index} className="home_category_item">
                                {category}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="home_students">
                    <h2>Top Students</h2>
                    <div className="home_student_grid">
                        {students.map((student, index) => (
                            <div key={index} className="home_student_item">
                                {student}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="home_universities">
                    <h2>Top Universities</h2>
                    <div className="home_university_grid">
                        {universities.map((university, index) => (
                            <div key={index} className="home_university_item">
                                {university}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="home_companies">
                    <h2>Top Companies</h2>
                    <div className="home_company_grid">
                        {companies.map((company, index) => (
                            <div key={index} className="home_company_item">
                                {company}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
