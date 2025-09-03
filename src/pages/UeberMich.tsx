import { PageSlugs } from "@/constants/slugs";
import { usePageBlocks } from "@/hooks/usePageBlocks";
import { renderPageBlock } from "@/utilities/pageBlocksUtils";


const UeberMich = () => {

  const {blocks, loading} = usePageBlocks(PageSlugs.AboutMe);


  return (
    <section className="page about-me">
      {blocks.map((block) => (
        <>{renderPageBlock(block)}</>
      ))}

    </section>

  );
};

export default UeberMich;