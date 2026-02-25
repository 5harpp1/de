import { useEffect , useState} from "react";
import "../styles/HomePage.css";
import slide1 from "../assets/1.jpg";
import slide2 from "../assets/2.jpg";
import slide3 from "../assets/3.jpg";
import slide4 from "../assets/4.jpg";
const images = [slide1, slide2, slide3, slide4]
export default function HomePage(){
    const [index, setIndex] = useState(0);

    useEffect(() =>{
        const id = setInterval(
            () => setIndex((i) => (i + 1) % images.length),
            3000
        );
        return () => clearInterval(id);

    }, []);
    const prev = () =>
        setIndex ((i) => (i - 1 + images.length) % images.length);
    const next = () => setIndex ((i) => (i + 1) %images.length);
    return(
        <div className="home-wrapper">
            <div className="home-container">
                <div className="home-slider">
                    <img src={images[index]} alt="slide"/>
                    <button 
                    type="Button"
                    className="home-arrow home-arrow-left"
                    onClick={prev}
                    >
                    {"<"}
                    </button>
                    <button 
                    type="Button"
                    className="home-arrow home-arrow-right"
                    onClick={next}
                    >
                    {">"}
                    </button>
                </div>
            </div>
        </div>
    )
 }