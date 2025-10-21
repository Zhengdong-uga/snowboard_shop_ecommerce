import { FaCartShopping, FaPlus } from "react-icons/fa6";
import { PrismicNextLink, PrismicNextLinkProps } from "@prismicio/next";
import clsx from "clsx";

export type ButtonProps = PrismicNextLinkProps & {
  color?: "orange" | "purple" | "lime";
  size?: "sm" | "md" | "lg";
  icon?: "cart" | "snowboard" | "plus";
};

export function ButtonLink({
  color = "orange",
  size = "md",
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <PrismicNextLink
      className={clsx(
        "button-cutout group mx-4 inline-flex items-center bg-gradient-to-b from-25% to-75% bg-[length:100%_400%] font-bold transition-[filter,background-position] duration-300 hover:bg-bottom",
        size === "sm" && "gap-2.5 py-2 text-base",
        size === "md" && "gap-3 px-1 text-lg ~py-2.5/3",
        size === "lg" && "~text-lg/2xl ~gap-3/4 ~px-1/2 ~py-3/4",
        color === "orange" &&
          "from-brand-orange to-brand-lime text-black hover:text-black",
        color === "purple" &&
          "from-brand-purple to-brand-lime text-white hover:text-black",
        color === "lime" && "from-brand-lime to-brand-orange text-black",
        className
      )}
      {...props}
    >
      {icon ? (
        <>
          <div
            className={clsx(
              "flex size-6 items-center justify-center transition-transform group-hover:-rotate-[25deg] [&>svg]:h-full [&>svg]:w-full",
              size === "sm" && "size-5",
              size === "md" && "size-6",
              size === "lg" && "~size-6/8"
            )}
          >
            {icon === "cart" && <FaCartShopping />}
            {icon === "snowboard" && <SnowboardIcon />}
            {icon === "plus" && <FaPlus />}
          </div>
          <div className="w-px self-stretch bg-black/25" />
        </>
      ) : null}
      {children}
    </PrismicNextLink>
  );
}

function SnowboardIcon() {
  return (
    <svg
      fill="#000000"
      width="800px"
      height="800px"
      viewBox="-2 -2 24 24"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin"
      className="jam jam-snowboard-f"
    >
      <path d="M18.504 1.47a3.608 3.608 0 0 1-.263 5.34c-3.097 2.541-5.131 4.296-6.101 5.266-.97.97-2.725 3.004-5.266 6.101a3.608 3.608 0 0 1-5.34.263 3.48 3.48 0 0 1 .291-5.183A72.408 72.408 0 0 0 13.321 1.761a3.48 3.48 0 0 1 5.183-.291zm-7.071 7.07a1 1 0 1 0 1.414-1.413 1 1 0 0 0-1.414 1.414zM7.19 12.785a1 1 0 1 0 1.414-1.415 1 1 0 0 0-1.414 1.415z" />
    </svg>
  );
}
