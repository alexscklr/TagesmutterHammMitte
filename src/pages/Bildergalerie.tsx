import ImageSlider from "../components/ImageSlider/ImageSlider";

import Bed1 from "./../assets/bed1.jpg"
import Bed2 from "./../assets/bed2.jpg"
import Cockchafer from "./../assets/cockchafer.jpg"
import Ducks from "./../assets/ducks.jpg"
import FireDep from "./../assets/fireDepartment.png"
import House from "./../assets/house.jpg"


const Bildergalerie = () => {
  return (
    <div className="page gallery" style={{padding: "5vh"}}>
      <h1>Bildergalerie</h1>
      <ImageSlider items={[Bed1, Bed2, Cockchafer, Ducks, FireDep, House]} />
    </div>
  );
};

export default Bildergalerie;