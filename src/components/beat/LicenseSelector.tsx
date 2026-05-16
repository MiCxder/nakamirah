"use client";

type LicenseType = "basic" | "premium" | "exclusive";

type Beat = {
  licenses: Record<LicenseType, number>;
};

type LicenseOption = {
  id: LicenseType;
  title: string;
  desc: string;
  price: number;
};

export default function LicenseSelector({
  beat,
  selected,
  setSelected,
}: {
  beat: Beat;
  selected: LicenseType;
  setSelected: (val: LicenseType) => void;
}) {
  const licenses: LicenseOption[] = [
    {
      id: "basic",
      title: "Basic License",
      desc: "MP3 lease • Non-exclusive use • Limited distribution",
      price: beat.licenses.basic,
    },
    {
      id: "premium",
      title: "Premium License",
      desc: "WAV + MP3 • Higher streams • Monetization allowed",
      price: beat.licenses.premium,
    },
    {
      id: "exclusive",
      title: "Exclusive Rights",
      desc: "Full ownership • Beat removed from store • Unlimited usage",
      price: beat.licenses.exclusive,
    },
  ];

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-200 tracking-wide">
          Choose License
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Select a license type before adding to cart
        </p>
      </div>

      {/* OPTIONS */}
      <div className="space-y-3">
        {licenses.map((lic) => {
          const isActive = selected === lic.id;

          return (
            <button
              key={lic.id}
              onClick={() => {
                setSelected(lic.id);
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${
                isActive
                  ? "border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                  : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">

                {/* LEFT TEXT */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white group-hover:text-purple-300 transition">
                      {lic.title}
                    </span>

                    {isActive && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Selected
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {lic.desc}
                  </p>
                </div>

                {/* PRICE */}
                <div className="text-right">
                  <span className="text-purple-400 font-bold text-sm">
                    ${lic.price}
                  </span>
                </div>
              </div>

              {/* ACTIVE INDICATOR BAR */}
              <div
                className={`mt-3 h-[2px] w-full rounded-full transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-purple-300 opacity-100"
                    : "bg-zinc-800 opacity-40"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* SUMMARY */}
      <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-500 flex justify-between">
        <span>Selected License</span>
        <span className="text-white capitalize font-medium">
          {selected}
        </span>
      </div>
    </div>
  );
}