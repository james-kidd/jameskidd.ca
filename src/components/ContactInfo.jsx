export default function ContactInfo({ emails }) {
  return (
    <div className="bg-white border border-(--border)/40 rounded-md px-3 py-2 text-[11px] text-(--text-muted) leading-snug">
      <div>
        <span className="font-medium">Recruiters:</span>{" "}
        contact details are included in my resume
      </div>
      <div>
        <span className="font-medium">Contract inquiries:</span>{" "}
        <a
          href={`mailto:${emails.dev}?subject=Contract Inquiry`}
          className="text-(--primary) hover:underline"
        >
          {emails.dev}
        </a>
      </div>
    </div>
  );
}
