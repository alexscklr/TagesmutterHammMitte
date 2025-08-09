import { useForm, ValidationError } from '@formspree/react';
import { BouncyText } from '../components/BouncyText/BouncyText';

function ContactForm() {
  const [state, handleSubmit] = useForm("xqaldlwk");
  if (state.succeeded) {
    return <p>Danke für deine Nachricht!</p>;
  }
  return (
    <form onSubmit={handleSubmit} style={{ width:"max(61vw, 61%)", display: "flex", flexDirection: "column", border: "1px solid var(--color-text-medium)", borderRadius: "15px", padding: "2%", marginTop: "1%", backgroundColor: "white" }}>
      <label htmlFor="email">
        E-Mailadresse
      </label>
      <input
        id="email"
        type="email"
        name="email"
        style={{ margin: "2%", padding: "2%", width: "50%", maxHeight: "2.5rem" }}
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
        style={{ margin: "2%", padding: "2%" }}
      />

      <ValidationError
        prefix="Message"
        field="message"
        errors={state.errors}
      />
      <p style={{ fontSize: "clamp(0.7rem, 2vw, 1rem)", width: "90%", margin: "auto" }}>
        Mit dem Absenden des Formulars erklären Sie sich damit einverstanden, dass Ihre Angaben zur Beantwortung Ihrer Anfrage verwendet werden.
        Weitere Informationen finden Sie in unserer <a href="/datenschutz" target="_blank">Datenschutzerklärung</a>.
      </p>
      <button type="submit" disabled={state.submitting} style={{width:"50%", margin: "1rem auto"}}>
        Submit
      </button>
    </form>
  );
}

const Kontakt = () => {
  return (
    <div className="page contact">
      <h1>Kontakt</h1>
      <section className="page">
        <p>
          <strong>Falls Sie eine Betreuung für Ihr Kind benötigen, können Sie sich mit mir gern telefonisch oder per E-Mail in Verbindung setzen.</strong>
        </p>
        <ul style={{
          listStyleType: "none",
          listStylePosition: "outside",
          listStyleImage: "none",
          paddingLeft: 0,
          fontSize: "1.5rem",
          textAlign: "center",
          lineHeight: "200%"
        }}>
          <li>Kerstin Sickler</li>
          <li>Weißdornweg 14</li>
          <li>59063 Hamm</li>
          <li>Telefon: 02381 31366</li>
          <li>E-Mail: Kerstin.Sickler@web.de</li>
        </ul>
      </section>
      <section className="page">
        <h3><BouncyText
          text="Oder per Kontaktformular:"
          amplitude={10}
          duration={1000}
          pauseDuration={2500}
          characterDelay={50}
          frequency={1}
          style={{fontSize:"clamp(1.5rem, 5vw, 4rem)"}}
        />
        </h3>
        <ContactForm />
      </section>

    </div>
  );
};

export default Kontakt;