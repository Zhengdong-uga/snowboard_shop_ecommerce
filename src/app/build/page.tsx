import Link from "next/link";
import React from "react";
import { WideLogo } from "@/slices/Hero/WideLogo";
import { Heading } from "../components/Heading";
import { ButtonLink } from "../components/ButtonLink";

import { CustomizerControlsProvider } from "./context";
import { createClient } from "@/prismicio";
import Preview from "./Preview";
import { asImageSrc } from "@prismicio/client";
import { Logo } from "../components/Logo";

type SearchParams = {
  board?: string;
  bindingl?: string;
  bindingr?: string;
};

export default async function page() {
  const client = createClient();
  const customizerSettings = await client.getSingle("board_customizer");
  const { board, bindingl, bindingr } = customizerSettings.data;

  const defaultBoard = board[0];
  // board.find((board) => board.uid === searchParams.board) ?? board[0];

  const defaultBindingL = bindingl[0];
  // bindingl.find((bindingl) => bindingl.uid === searchParams.bindingl) ??
  // bindingl[0];
  const defaultBindingR = bindingr[0];
  // bindingr.find((bindingr) => bindingr.uid === searchParams.bindingr) ??
  // bindingr[0];

  const boardTextureURLs = board
    .map((texture) => asImageSrc(texture.texture))
    .filter((url): url is string => Boolean(url));

  const bindinglTextureURLs = bindingl
    .map((texture) => asImageSrc(texture.texture))
    .filter((url): url is string => Boolean(url));

  const bindingrTextureURLs = bindingr
    .map((texture) => asImageSrc(texture.texture))
    .filter((url): url is string => Boolean(url));

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <CustomizerControlsProvider
        defaultBoard={defaultBoard}
        defaultBindingL={defaultBindingL}
        defaultBindingR={defaultBindingR}
      >
        <div className="relative aspect-square shrink-0 bg-[#3a414a] lg:aspect-auto lg:grow">
          <div className="absolute inset-0">
            <Preview
              boardTextureURLs={boardTextureURLs}
              bindinglTextureURLs={bindinglTextureURLs}
              bindingrTextureURLs={bindingrTextureURLs}
            />
          </div>
          <Link href="/" className="absolute left-6 top-6">
            <Logo className="text-brand-white ~h-12/20" fill="white" />
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
      </CustomizerControlsProvider>
    </div>
  );
}
