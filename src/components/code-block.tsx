import { codeToHtml } from "shiki";
import { createEffect, createSignal, onMount } from "solid-js";
import { isServer } from "solid-js/web";
import { CopyButton } from "~/components/copy-button";
import { cn } from "~/lib/utils";

type CodeBlockProps = {
  code: string;
  lang?: string;
  class?: string;
  showCopy?: boolean;
  filename?: string;
};

export function CodeBlock(props: CodeBlockProps) {
  const [html, setHtml] = createSignal<string | null>(null);
  const lang = () => props.lang || "typescript";

  // Only run highlighting on client to avoid hydration mismatch
  onMount(() => {
    codeToHtml(props.code, {
      lang: lang(),
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    }).then(setHtml);
  });

  // Re-highlight if code changes
  createEffect(() => {
    if (isServer) {
      return;
    }
    const code = props.code;
    const language = lang();
    codeToHtml(code, {
      lang: language,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    }).then(setHtml);
  });

  return (
    <div class={cn("relative rounded-md bg-muted", props.class)}>
      {props.filename ? (
        <div class="border-border/50 border-b px-4 py-2 font-mono text-muted-foreground text-xs">
          {props.filename}
        </div>
      ) : null}
      {html() ? (
        <div
          class="[&_.shiki]:!bg-transparent [&_pre]:!bg-transparent overflow-x-auto text-sm [&_pre]:p-4 [&_pre]:pr-12"
          innerHTML={html() ?? ""}
        />
      ) : (
        <pre class="overflow-x-auto p-4 pr-12 text-sm">
          <code>{props.code}</code>
        </pre>
      )}
      {props.showCopy !== false && (
        <CopyButton
          class={cn("absolute right-2", props.filename ? "top-10" : "top-2")}
          value={props.code}
        />
      )}
    </div>
  );
}
