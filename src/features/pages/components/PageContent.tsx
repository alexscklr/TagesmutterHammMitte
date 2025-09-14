import { useParams } from "react-router-dom";
import { renderPageBlock } from "@/features/pages/components/PageBlockRenderer";
import { usePageBlocks } from "@/features/pages/hooks/usePageBlocks";
import React from "react";
import Startseite from "@/pages/Startseite";


type PageContentProps = {

};

const PageContent = (_: PageContentProps) => {
    const { slug } = useParams<{ slug: string }>();

    const { blocks, loading } = usePageBlocks(slug || "");

    if (blocks.length == 0 && loading) {
        return <p>LOADING ...</p>
    }
    else if (blocks.length == 0 || slug?.length === 0) {
        return <p>Seite nicht vorhanden</p>
    }

    if (!slug || slug === "") {
        return <Startseite />
    }

    return (
        <div className="page">
            {blocks.map((block, index) => (
                <React.Fragment key={index}>{renderPageBlock(block)}</React.Fragment>
            ))}
        </div>
    );
};

export default PageContent;