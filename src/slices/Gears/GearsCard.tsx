import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import React from "react";

type Props = {
  gears: Content.GearsDocument;
  index: number;
};

// 👇 Keep export name different from the slice component
export function Gears({ gears, index }: Props) {
  return (
    <div className="skater group relative flex flex-col items-center gap-4">
      <div className="stack-layout overflow-hidden">
        <PrismicNextImage
          field={gears.data.photo_background}
          width={500}
          alt=""
          className="scale-110 transform transition-all duration-1000 ease-in-out group-hover:scale-100 group-hover:brightness-75 group-hover:saturate-[.8]"
        />
        <PrismicNextImage
          field={gears.data.photo_foreground}
          width={500}
          alt=""
          className="transform transition-transform duration-1000 ease-in-out group-hover:scale-110"
        />
        <div className="relative h-48 w-full place-self-end bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <h3 className="relative grid place-self-end justify-self-start p-2 font-sans text-brand-gray ~text-2xl/3xl">
          <span className="mb-[-.3em]">{gears.data.gear_name}</span>
          <span className="block">{gears.data.gear_brand}</span>
        </h3>
      </div>
    </div>
  );
}
