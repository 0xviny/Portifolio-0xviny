export default function SectionHeading({
  title,
  hint,
  tone = "paper",
}: {
  title: string;
  hint?: string;
  tone?: "paper" | "deep";
}) {
  const deep = tone === "deep";

  return (
    <div className="mb-10 md:mb-14">
      <span className={`tick ${deep ? "bg-paper" : ""}`} aria-hidden="true" />
      <div className="mt-5 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-10">
        <h2
          className={`text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] ${
            deep ? "text-paper" : "text-ink"
          }`}
        >
          {title}
        </h2>
        {hint && (
          <p
            className={`max-w-xs text-[15px] leading-snug md:text-right ${
              deep ? "text-navy-muted" : "text-muted"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
