"use client";

import { useState } from "react";
import {
  Panel,
  Group,
  Separator,
} from "react-resizable-panels";
import { marked } from "marked";
import { GripVertical } from "lucide-react";


export default function page() {
  const [markdown, setMarkdown] = useState(`# Markdown Editor

## Live Preview

This is **bold**

This is *italic*

---

### List

- Apple
- Banana
- Mango

---

### Code

\`\`\`js
function hello() {
    console.log("Hello World");
}
\`\`\`

---

### Table

| Name | Age |
|------|-----|
| John | 20 |
| Alex | 30 |

`);

  return (
    <Group className="h-screen">
      {/* LEFT */}
      <Panel defaultSize={50} minSize={20}>
        <div className="h-full flex flex-col bg-zinc-950 h-screen">
          <div className="border-b border-zinc-800 px-4 py-3 font-semibold text-white">
            Markdown
          </div>

          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            className="
              flex-1
              resize-none
              bg-zinc-950
              text-white
              p-5
              outline-none
              font-mono
              text-[15px]
            "
          />
        </div>
      </Panel>

      {/* Divider */}
      <Separator>
        <CustomDivider />
      </Separator>

      {/* RIGHT */}
      <Panel defaultSize={50} minSize={20}>
        <div className="h-full flex flex-col bg-white">
          <div className="border-b border-zinc-800 px-4 py-3 font-semibold text-black">
            HTML Preview
          </div>

          <div
            className="
              flex-1
              overflow-auto
              p-8
              prose
              prose-invert
              max-w-none
            "
            dangerouslySetInnerHTML={{
              __html: marked.parse(markdown) as string,
            }}
          />
        </div>
      </Panel>
    </Group>
  );
}

function CustomDivider() {
  return (
    <div className="relative h-full w-3 cursor-ew-resize group flex items-center justify-center bg-zinc-900 hover:bg-blue-500 transition-colors duration-200">
      <GripVertical
        size={18}
        className="text-zinc-400 group-hover:text-white"
      />
    </div>
  );
}