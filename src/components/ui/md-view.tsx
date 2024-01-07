"use client";

import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const MarkDownView: FC<{ children: string }> = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (props) => <h1 {...props} className="text-[35px]" />,
        h2: (props) => <h2 {...props} className="text-[32.5px]" />,
        h3: (props) => <h3 {...props} className="text-[30px]" />,
        h4: (props) => <h4 {...props} className="text-[27.5px]" />,
        h5: (props) => <h5 {...props} className="text-[25px]" />,
        h6: (props) => <h6 {...props} className="text-[22.5px]" />,
        a: (props) => <a {...props} target="_blank" className="default" />,
        ul: (props) => <ul {...props} className="list-disc list-inside" />,
        ol: (props) => <ol {...props} className="list-decimal list-inside" />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
