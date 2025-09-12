import ImageSlider from "@/shared/components/ImageSlider/ImageSlider";

const Bildergalerie = () => {
  return (
    <div className="page gallery" style={{ padding: "5vh" }}>
      <h1>Bildergalerie</h1>
      <h3>Das Haus</h3>
      <ImageSlider items={["https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/house.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/bed1.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/bed2.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/bed3.jpg"]} speed={0.25}/>
      <h3>Die Kids zusammen</h3>
      <ImageSlider items={["https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidPuzzle1.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsChalk.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsCrafting.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsFingerPaint.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsMusic.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsPiano.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsPuddle.jpg"]} speed={0.15}/>
      <h3>Hier spielt die Musik</h3>
      <ImageSlider items={["https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/instruments.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsMusic.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsPiano.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsXylophone.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsUkulele.jpg"]} speed={0.35}/>
      <h3>Unterwegs mit den Kids</h3>
      <ImageSlider items={["https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/fireDepartment.png", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/ducks.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/cockchafer.jpg", "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/library.jpg"]} speed={0.15}/>
    </div>
  );
};

export default Bildergalerie;