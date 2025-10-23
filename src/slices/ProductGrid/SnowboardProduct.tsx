import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import React from "react";

type Props = {
  id: string;
};

export async function SnowboardProduct({ id }: Props) {
  const client = createClient();
  const product = await client.getByID<Content.SnowboardDocument>(id);

  return (
    <div>
      <PrismicNextImage alt="" field={product.data.image} width={150} />
    </div>
  );
}
