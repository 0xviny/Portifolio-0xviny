import Reveal from "./Reveal";

export default function SectionHeading({
  index,
  title,
  hint,
}: {
  index: string;
  title: string;
  hint?: string;
}) {
  return (
    <Reveal className="mb-12 flex flex-col gap-4 border-b hairline pb-6 md:mb-16 md:flex-row md:items-end md:justify-between">
      <div className="flex items-baseline gap-5">
        <span className="label text-moss-bright">{index}</span>
        <h2 className="text-4xl leading-[0.95] font-semibold tracking-tight text-bone md:text-6xl">
          {title}
        </h2>
      </div>
      {hint && <p className="label max-w-xs md:text-right">{hint}</p>}
    </Reveal>
  );
}
