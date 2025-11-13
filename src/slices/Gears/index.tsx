import { JSX } from "react";
import { Content } from "@prismicio/client";
import { PrismicText, SliceComponentProps } from "@prismicio/react";
import { Bounded } from "@/app/components/Bounded";
import { Heading } from "@/app/components/Heading";
import { createClient } from "@/prismicio";
import React from "react";

// 👇 Import the card component with an alias
import { Gears as GearCard } from "./GearsCard"; // or wherever it lives
import { SlideIn } from "@/app/components/SlideIn";

export type GearsProps = SliceComponentProps<Content.GearsSlice>;

const Gears = async ({ slice }: GearsProps): Promise<JSX.Element> => {
  const client = createClient();
  const gearDocs = await client.getAllByType("gears"); // avoid shadowing the name "gears"

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-texture bg-brand-navy"
    >
      <SlideIn>
        <Heading as="h2" size="lg" className="mb-8 text-center text-white">
          <PrismicText field={slice.primary.heading} />
        </Heading>
      </SlideIn>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {gearDocs.map((doc, index) => (
          <React.Fragment key={doc.id ?? index}>
            {doc.data.gear_name && <GearCard index={index} gears={doc} />}
          </React.Fragment>
        ))}
      </div>
    </Bounded>
  );
};

export default Gears;
