import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children, className, ...props }) => {
      return (
        <a
          href={href}
          target={!href || !href.startsWith("http") ? "" : "_blank"}
          className={"default " + className}
          {...props}
        >
          {children}
        </a>
      );
    },
    ...components,
  };
}
