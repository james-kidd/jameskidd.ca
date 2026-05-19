import { heroData } from "../data";

export default function ContactInfo({ emails }) {
  const { contactGuidance } = heroData;

  return (
    <div className="bg-white border border-(--border)/40 rounded-md px-3 py-2 text-[11px] text-(--text-muted) leading-snug">
      {Object.entries(contactGuidance).map(([key, guide]) => (
        <div key={key}>
          <span className="font-medium">{guide.label}:</span>{" "}
          {guide.emailKey ? (
            <a
              href={`mailto:${emails[guide.emailKey]}?subject=${encodeURIComponent(guide.label)}`}
              className="text-(--primary) hover:underline"
            >
              {emails[guide.emailKey]}
            </a>
          ) : (
            guide.text
          )}
        </div>
      ))}
    </div>
  );
}
