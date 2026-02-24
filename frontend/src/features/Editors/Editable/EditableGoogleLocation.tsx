import React from "react";
import type { GoogleLocation } from "@/features/pages/types/blocks";
import { SaveBlockButton } from "@/shared/components";

export interface EditableGoogleLocationProps {
  value: GoogleLocation;
  onChange: (value: GoogleLocation) => void;
}

const EditableGoogleLocation: React.FC<EditableGoogleLocationProps> = ({ value, onChange }) => {
  const update = <K extends keyof GoogleLocation>(k: K, v: GoogleLocation[K]) => onChange({ ...value, [k]: v });

  return (
    <div style={{ display: "grid", gap: "0.5em" }}>
      <input type="text" placeholder="Adresse" value={value.address ?? ""} onChange={(e) => update("address", e.target.value)} />
      <input type="url" placeholder="Embed URL" value={value.embedUrl ?? ""} onChange={(e) => update("embedUrl", e.target.value)} />
      <input type="text" placeholder="API Key" value={value.apiKey ?? ""} onChange={(e) => update("apiKey", e.target.value)} />
      <input type="text" placeholder="CSS-Klasse" value={value.className ?? ""} onChange={(e) => update("className", e.target.value)} />
      <label>
        Zustimmung notwendig
        <input type="checkbox" checked={!!value.withConsent} onChange={(e) => update("withConsent", e.target.checked)} style={{ marginLeft: "0.5em" }} />
      </label>
      <input type="text" placeholder="Storage Key" value={value.storageKey ?? ""} onChange={(e) => update("storageKey", e.target.value)} />
      <input type="text" placeholder="Zustimmungsnachricht" value={value.consentMessage ?? ""} onChange={(e) => update("consentMessage", e.target.value)} />
      <input type="text" placeholder="Button Label" value={value.buttonLabel ?? ""} onChange={(e) => update("buttonLabel", e.target.value)} />
      <div style={{ marginTop: 8 }}>
        <SaveBlockButton />
      </div>
    </div>
  );
};

export default EditableGoogleLocation;
