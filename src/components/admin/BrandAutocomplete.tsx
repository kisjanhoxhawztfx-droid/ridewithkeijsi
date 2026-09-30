"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X, Search } from "lucide-react";

export const ALL_MOTORCYCLE_BRANDS = [
  // Top Popular Brands (Common in Albania & Worldwide)
  "Honda",
  "Yamaha",
  "BMW",
  "Kawasaki",
  "KTM",
  "Ducati",
  "Suzuki",
  "Harley-Davidson",
  "Piaggio",
  "Vespa",
  "CFMOTO",
  "Aprilia",
  "Triumph",
  "Voge",
  "Benelli",
  "Husqvarna",
  "Moto Guzzi",
  "MV Agusta",
  "Royal Enfield",
  "Indian Motorcycle",
  "Kymco",
  "SYM",
  "Peugeot",
  "Gilera",
  "Can-Am",
  "Polaris",
  "Spy Racing",
  "Zontes",
  "QJMotor",
  "Keeway",
  "Lifan",
  "Loncin",
  "Zongshen",
  "Benda",
  "Kove",

  // Complete Worldwide Motorcycle Brands List
  "AJP",
  "Aprilia Racing",
  "Arch Motorcycle",
  "Ariel",
  "Bajaj",
  "Benelli QJ",
  "Beta",
  "Big Dog",
  "Bimota",
  "Borrini",
  "Boss Hoss",
  "Brammo",
  "Brough Superior",
  "BSA",
  "Buell",
  "Cagiva",
  "Cake",
  "CCM",
  "Cleveland CycleWerks",
  "Confederate",
  "CPI",
  "Curtiss",
  "Daelim",
  "Derbi",
  "Dongfang",
  "Ducati Corse",
  "Energica",
  "Erik Buell Racing (EBR)",
  "Fantic Motor",
  "FB Mondial",
  "Garelli",
  "GASGAS",
  "Generic",
  "Harley-Davidson CVO",
  "Hero",
  "Hesketh",
  "Horwin",
  "Horex",
  "Hyosung",
  "Italjet",
  "Jawa",
  "Kawasaki Ninja",
  "Kreidler",
  "KSR Moto",
  "KTM PowerSports",
  "Laverda",
  "Lexmoto",
  "LiveWire",
  "Magni",
  "Malaguti",
  "MBK",
  "Midual",
  "Minsk",
  "Montesa",
  "Moriwaki",
  "Moto Morini",
  "Motobi",
  "Motorhispania",
  "Münch",
  "Mutt Motorcycles",
  "MZ",
  "NIU",
  "Norton",
  "Pannonia",
  "PGO",
  "Polini",
  "Puch",
  "Quadro",
  "Rewaco",
  "Rieju",
  "Romet",
  "Rokon",
  "Sachs",
  "Scorpa",
  "Sherco",
  "Shineray",
  "Simson",
  "Sinnis",
  "Skyteam",
  "Super Soco",
  "Stark Future",
  "Stomp",
  "Sur-Ron",
  "SWM",
  "Talaria",
  "TGB",
  "TM Racing",
  "Torrot",
  "TVS",
  "Ural",
  "Vectrix",
  "Velocette",
  "Vertigo",
  "Victory",
  "Vincent",
  "Vins",
  "Viper",
  "VOR",
  "Voxan",
  "Wottan",
  "Yamaha Star",
  "Zero Motorcycles",
];

interface BrandAutocompleteProps {
  value: string;
  onChange: (brand: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function BrandAutocomplete({
  value,
  onChange,
  placeholder = "Shkruaj markën (p.sh. Honda, Yamaha...)",
  required = false,
}: BrandAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBrands = ALL_MOTORCYCLE_BRANDS.filter((b) =>
    b.toLowerCase().includes((search || "").toLowerCase())
  );

  const handleSelect = (brandName: string) => {
    onChange(brandName);
    setSearch(brandName);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    onChange(val);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredBrands.length > 0) {
        handleSelect(filteredBrands[0]);
      } else if (search.trim()) {
        handleSelect(search.trim());
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          required={required}
          value={search}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-[#06080d] border border-white/15 focus:border-[#00b2fe] rounded-lg pl-3.5 pr-8 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
        />

        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            inputRef.current?.focus();
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00b2fe] transition-colors p-0.5"
          tabIndex={-1}
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#00b2fe]" : ""}`} />
        </button>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#090d16] border border-white/20 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(0,178,254,0.2)] max-h-56 overflow-y-auto divide-y divide-white/5 animate-in fade-in zoom-in-95 duration-150">
          {filteredBrands.length > 0 ? (
            filteredBrands.map((b) => {
              const isSelected = value.toLowerCase() === b.toLowerCase();
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleSelect(b)}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-[#00b2fe]/20 text-[#00d2ff] font-bold"
                      : "text-gray-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="font-['Outfit']">{b}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#00b2fe]" />}
                </button>
              );
            })
          ) : (
            <div className="p-3 text-xs text-gray-400 text-center">
              <span>Nuk u gjet &quot;{search}&quot;. Mund ta përdorni si markë të re duke shtypur Enter.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
