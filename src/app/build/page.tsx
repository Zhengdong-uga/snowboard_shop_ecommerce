import Link from "next/link";
import React from "react";
import { Logo } from "../components/Logo";
import { TallLogo } from "@/slices/Hero/TallLogo";
import { WideLogo } from "@/slices/Hero/WideLogo";
import { Heading } from "../components/Heading";
import { ButtonLink } from "../components/ButtonLink";

type Props = {};

export default async function page({}: Props) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative aspect-square shrink-0 bg-[#3a414a] lg:aspect-auto lg:grow">
        <Link href="/" className="absolute left-6 top-6">
          <WideLogo className="h-16 text-white" />
        </Link>
      </div>
      <div className="grow bg-texture bg-zinc-900 text-white ~p-4/6 lg:w-96 lg:shrink-0 lg:grow-0">
        <Heading as="h1" size="sm" className="mb-6 mt-0">
          Build your board
        </Heading>
        <ButtonLink href="" color="lime" icon="plus">
          Add to cart
        </ButtonLink>
      </div>
    </div>
  );
}
