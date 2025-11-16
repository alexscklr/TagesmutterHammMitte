import type { ContactFormBlock } from "../../types/index";
import ContactForm from "@/shared/components/ContactForm/ContactForm";

interface ContactFormBlockProps {
    block: ContactFormBlock;
}

export function ContactFormBlock({ block }: ContactFormBlockProps) {
    if (!block) return <></>
    
    return <ContactForm />;
};