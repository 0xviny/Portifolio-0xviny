import SectionHeading from "./SectionHeading";
import { stackGroups } from "../data/content";

export default function Stacks() {
  return (
    <section id="stacks" className="scroll-mt-20 py-20 md:py-28" aria-labelledby="stacks-title">
      <div className="wrap">
        <span id="stacks-title" className="sr-only">
          Stacks
        </span>
        <SectionHeading title="Stacks" hint="ferramentas que uso todo dia" />

        <div className="panel p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            {stackGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-[15px] font-medium text-accent">{group.title}</h3>
                <ul className="mt-4">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border-t hairline py-3 text-[16px] text-ink last:border-b"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
