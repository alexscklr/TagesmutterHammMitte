import ImageSlider from "../components/ImageSlider/ImageSlider";

import House from "./../assets/images/house/house.jpg"
import Bed1 from "./../assets/images/house/bed1.jpg"
import Bed2 from "./../assets/images/house/bed2.jpg"
import Bed3 from "./../assets/images/house/bed3.jpg"

import KidPuzzle1 from "./../assets/images/kids/kidPuzzle1.jpg"
import KidsChalk from "./../assets/images/kids/kidsChalk.jpg"
import KidsCrafting from "./../assets/images/kids/kidsCrafting.jpg"
import KidsFingerPaint from "./../assets/images/kids/kidsFingerPaint.jpg"
import KidsPuddle from "./../assets/images/kids/kidsPuddle.jpg"

import Instruments from "./../assets/images/music/instruments.jpg"
import KidsMusic from "./../assets/images/music/kidsMusic.jpg"
import KidsPiano from "./../assets/images/music/kidsPiano.jpg"
import KidsXylophone from "./../assets/images/music/kidsXylophone.jpg"
import KidsUkulele from "./../assets/images/music/kidsUkulele.jpg"

import Cockchafer from "./../assets/images/outside/cockchafer.jpg"
import Ducks from "./../assets/images/outside/ducks.jpg"
import FireDep from "./../assets/images/outside/fireDepartment.png"
import Library from "./../assets/images/outside/library.jpg"



const Bildergalerie = () => {
  return (
    <div className="page gallery" style={{ padding: "5vh" }}>
      <h1>Bildergalerie</h1>
      <h3>Das Haus</h3>
      <ImageSlider items={[House, Bed1, Bed2, Bed3]} speed={0.25}/>
      <h3>Die Kids zusammen</h3>
      <ImageSlider items={[KidPuzzle1, KidsChalk, KidsCrafting, KidsFingerPaint, KidsMusic, KidsPiano, KidsPuddle]} speed={0.15}/>
      <h3>Hier spielt die Musik</h3>
      <ImageSlider items={[Instruments, KidsMusic, KidsPiano, KidsXylophone, KidsUkulele]} speed={0.35}/>
      <h3>Unterwegs mit den Kids</h3>
      <ImageSlider items={[FireDep, Ducks, Cockchafer, Library]} speed={0.15}/>
    </div>
  );
};

export default Bildergalerie;