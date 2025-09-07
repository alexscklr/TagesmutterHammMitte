import { PageSlugs } from "@/constants/slugs";
import { usePageBlocks } from "@/features/pageBlocks/hooks/usePageBlocks";
import { renderPageBlock } from "@/features/pageBlocks/components/PageBlockRenderer";


const UeberMich = () => {

  const {blocks, loading} = usePageBlocks(PageSlugs.AboutMe);

  if (blocks.length == 0 && loading) {
    return <p>LOADING ...</p>
  }

  return (
    <section className="page about-me">
      {blocks.map((block, index) => (
        <div key={index}>{renderPageBlock(block)}</div>
      ))}

    </section>

  );
};

export default UeberMich;