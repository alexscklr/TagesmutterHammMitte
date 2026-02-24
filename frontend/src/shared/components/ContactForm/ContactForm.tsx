import { useForm, ValidationError } from '@formspree/react';
import styles from "./ContactForm.module.css";

function ContactForm() {
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_CODE);
  if (state.succeeded) {
    return <p>Danke für deine Nachricht!</p>;
  }
  return (
    <form onSubmit={handleSubmit} className={styles.contactForm}>
      <label htmlFor="email">
        E-Mailadresse
      </label>
      <input
        id="email"
        type="email"
        name="email"
        className={styles.emailInput}
      />

      <ValidationError
        prefix="Email"
        field="email"
        errors={state.errors}
      />
      <label htmlFor="message">Nachricht</label>
      <textarea
        id="message"
        name="message"
        className={styles.messageInput}
      />

      <ValidationError
        prefix="Message"
        field="message"
        errors={state.errors}
      />
      <p className={styles.privacyNotice}>
        Mit dem Absenden des Formulars erklären Sie sich damit einverstanden, dass Ihre Angaben zur Beantwortung Ihrer Anfrage verwendet werden.
        Weitere Informationen finden Sie in unserer <a href="/datenschutz" target="_blank">Datenschutzerklärung</a>.
      </p>
      <button type="submit" disabled={state.submitting} className={styles.submitButton}>
        Submit
      </button>
    </form>
  );
}

export default ContactForm;