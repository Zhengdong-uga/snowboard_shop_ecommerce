"use client";
import {
  ColorField,
  Content,
  ImageField,
  isFilled,
  KeyTextField,
} from "@prismicio/client";
import clsx from "clsx";
import React, { ComponentProps, ReactNode, useEffect } from "react";
import { Heading } from "../components/Heading";
import { PrismicNextImage, PrismicNextImageProps } from "@prismicio/next";
import { useCustomizerControls } from "./context";
import { useRouter } from "next/navigation";

type Props = Pick<
  Content.BoardCustomizerDocumentData,
  "board" | "bindingl" | "bindingr"
> & {
  className?: string;
};

export default function Controls({
  board,
  bindingl,
  bindingr,
  className,
}: Props) {
  const router = useRouter();

  const {
    setBoard,
    setBindingL,
    setBindingR,
    selectedBoard,
    selectedBindingL,
    selectedBindingR,
  } = useCustomizerControls();

  useEffect(() => {
    const url = new URL(window.location.href);

    if (isFilled.keyText(selectedBoard?.uid))
      url.searchParams.set("board", selectedBoard.uid);
    if (isFilled.keyText(selectedBindingL?.uid))
      url.searchParams.set("bindingl", selectedBindingL.uid);
    if (isFilled.keyText(selectedBindingR?.uid))
      url.searchParams.set("bindingr", selectedBindingR.uid);
  });

  return (
    <div className={clsx("flex flex-col gap-6", className)}>
      <Options title="Board" selectedName={selectedBoard?.uid}>
        {board.map((board) => (
          <Option
            key={board.uid}
            imageField={board.texture}
            imgixParams={{
              rect: [20, 2000, 2000, 400],
              width: 150,
              height: 150,
            }}
            selected={board.uid === selectedBoard?.uid}
            onClick={() => setBoard(board)}
          >
            {board.uid?.replace(/-/g, " ")}
          </Option>
        ))}
      </Options>
      <Options title="Left Binding" selectedName={selectedBindingL?.uid}>
        {bindingl.map((Binding_l) => (
          <Option
            key={Binding_l.uid}
            imageField={Binding_l.texture}
            imgixParams={{
              rect: [20, 2000, 2000, 400],
              width: 150,
              height: 150,
            }}
            selected={Binding_l.uid === selectedBindingL?.uid}
            onClick={() => setBindingL(Binding_l)}
          >
            {Binding_l.uid?.replace(/-/g, " ")}
          </Option>
        ))}
      </Options>
      <Options title="Right Binding" selectedName={selectedBindingR?.uid}>
        {bindingr.map((Binding_r) => (
          <Option
            key={Binding_r.uid}
            imageField={Binding_r.texture}
            imgixParams={{
              rect: [20, 2000, 2000, 400],
              width: 150,
              height: 150,
            }}
            selected={Binding_r.uid === selectedBindingR?.uid}
            onClick={() => setBindingR(Binding_r)}
          >
            {Binding_r.uid?.replace(/-/g, " ")}
          </Option>
        ))}
      </Options>
    </div>
  );
}

type OptionsProps = {
  title?: ReactNode;
  selectedName?: KeyTextField;
  children?: ReactNode;
};

function Options({ title, selectedName, children }: OptionsProps) {
  const formattedName = selectedName?.replace(/-/g, " ");

  return (
    <div>
      <div className="flex">
        <Heading as="h2" size="xs" className="mb-2">
          {title}
        </Heading>
        <p className="ml-3 text-zinc-300">
          <span className="selected-none text-zinc-500">| </span>
          {formattedName}
        </p>
      </div>
      <ul className="mb-1 flex flex-wrap gap-2">{children}</ul>
    </div>
  );
}

type OptionProps = Omit<ComponentProps<"button">, "children"> & {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
} & (
    | {
        imageField: ImageField;
        imgixParams?: PrismicNextImageProps["imgixParams"];
        colorField?: never;
      }
    | {
        colorField: ColorField;
        imageField?: never;
        imgixParams?: never;
      }
  );

function Option({
  children,
  selected,
  imageField,
  imgixParams,
  colorField,
  onClick,
}: OptionProps) {
  return (
    <li>
      <button
        className={clsx(
          "size-10 cursor-pointer rounded-full bg-black p-0.5 outline-2 outline-white",
          selected && "outline"
        )}
        onClick={onClick}
      >
        {imageField ? (
          <PrismicNextImage
            field={imageField}
            imgixParams={imgixParams}
            className="pointer-events-none h-full w-full rounded-full"
            alt=""
          />
        ) : (
          <div
            className="h-full w-full rounded-full"
            style={{ backgroundColor: colorField ?? undefined }}
          />
        )}

        <span className="sr-only">{children}</span>
      </button>
    </li>
  );
}
