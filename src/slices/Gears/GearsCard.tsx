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
    <div className="group relative flex flex-col items-center gap-4">
      <div className="stack-layout overflow-hidden">
        <PrismicNextImage
          field={gears.data.photo_background}
          width={500}
          // height={800}
          imgixParams={{ q: 20 }}
          alt=""
          className="scale-110 transform transition-all duration-1000 ease-in-out group-hover:scale-100 group-hover:brightness-75 group-hover:saturate-[.8]"
        />
        <PrismicNextImage
          field={gears.data.photo_foreground}
          width={500}
          alt=""
        />
        {gears.data.gear_name}
      </div>
    </div>
  );
}
