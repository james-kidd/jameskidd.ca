import { education } from "@/content/education";

export function Education() {
  return (
    <ol className="timeline space-y-10">
      {education.map((entry) => (
        <li key={entry.school} className="relative">
          <span className="timeline-dot" aria-hidden />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="t-heading">{entry.school}</h3>
            <p className="t-label">{entry.years}</p>
          </div>
          <p className="t-small mt-1 text-ink-muted">{entry.degree}</p>
          <p className="t-small mt-3">{entry.description}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {entry.coursework.map((course) => (
              <li key={course.code}>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noreferrer"
                  title={course.name}
                  className="tag t-small"
                >
                  {course.code}
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
