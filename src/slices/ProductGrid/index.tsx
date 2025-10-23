import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Bounded } from "@/app/components/Bounded";
import { Heading } from "@/app/components/Heading";
import { SnowboardProduct } from "./SnowboardProduct";

/**
 * Props for `ProductGrid`.
 */
export type ProductGridProps = SliceComponentProps<Content.ProductGridSlice>;

/**
 * Component for "ProductGrid" Slices.
 */
const ProductGrid: FC<ProductGridProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-texture bg-brand-grey"
    >
      <Heading className="text-center ~mb-4/6" as="h2">
        <PrismicRichText field={slice.primary.heading} />
      </Heading>
      <div className="text-center ~mb-6/10">
        <PrismicRichText field={slice.primary.body} />
      </div>
      {slice.primary.product.map(
        ({ snowboard }) =>
          isFilled.contentRelationship(snowboard) && (
            <SnowboardProduct key={snowboard.id} id={snowboard.id} />
          )
      )}
    </Bounded>
  );
};

export default ProductGrid;
