import {
  type Accessor,
  createMemo,
  createSignal,
  For,
  type JSX,
  Show,
} from "solid-js";
import { CodeBlock } from "~/components/code-block";
import { CopyButton } from "~/components/copy-button";
import { IconChevronRight, IconExternalLink } from "~/components/icons";
import { InstallCommand } from "~/components/install-command";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

type BlockFile = {
  path: string;
  content: string;
  type?: string;
};

type BlockViewerProps = {
  name: string;
  registryName: string;
  files: BlockFile[];
  preview?: JSX.Element;
  previewUrl?: string;
  class?: string;
};

function IconRefresh(props: { class?: string }) {
  return (
    <svg
      aria-hidden="true"
      class={cn("size-4", props.class)}
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
    </svg>
  );
}

function IconFile(props: { class?: string }) {
  return (
    <svg
      aria-hidden="true"
      class={cn("size-4", props.class)}
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function IconFolder(props: { class?: string }) {
  return (
    <svg
      aria-hidden="true"
      class={cn("size-4", props.class)}
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}

function IconFolderOpen(props: { class?: string }) {
  return (
    <svg
      aria-hidden="true"
      class={cn("size-4", props.class)}
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

type TreeNode = {
  name: string;
  path: string;
  isFolder: boolean;
  children: TreeNode[];
  content?: string;
};

function buildFileTree(files: BlockFile[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join("/");

      let existing = current.find((n) => n.name === part);

      if (!existing) {
        existing = {
          name: part,
          path: currentPath,
          isFolder: !isLast,
          children: [],
          content: isLast ? file.content : undefined,
        };
        current.push(existing);
      }

      if (!isLast) {
        current = existing.children;
      }
    }
  }

  // Sort folders before files, then alphabetically
  const sortNodes = (nodes: TreeNode[]): TreeNode[] =>
    nodes
      .sort((a, b) => {
        if (a.isFolder && !b.isFolder) {
          return -1;
        }
        if (!a.isFolder && b.isFolder) {
          return 1;
        }
        return a.name.localeCompare(b.name);
      })
      .map((node) => ({
        ...node,
        children: sortNodes(node.children),
      }));

  return sortNodes(root);
}

type FileTreeNodeProps = {
  node: TreeNode;
  selectedFile: Accessor<string>;
  onSelect: (path: string) => void;
  depth?: number;
};

function FileTreeNode(props: FileTreeNodeProps) {
  const [expanded, setExpanded] = createSignal(true);
  const depth = () => props.depth ?? 0;
  const isSelected = () => props.selectedFile() === props.node.path;

  return (
    <div>
      <button
        class={cn(
          "flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm transition-colors hover:bg-muted/80",
          isSelected() &&
            !props.node.isFolder &&
            "bg-muted font-medium text-foreground"
        )}
        onClick={() => {
          if (props.node.isFolder) {
            setExpanded(!expanded());
          } else {
            props.onSelect(props.node.path);
          }
        }}
        style={{ "padding-left": `${depth() * 12 + 8}px` }}
        type="button"
      >
        <Show fallback={<span class="w-4" />} when={props.node.isFolder}>
          <IconChevronRight
            class={cn(
              "size-3 text-muted-foreground transition-transform",
              expanded() && "rotate-90"
            )}
          />
        </Show>
        <Show
          fallback={<IconFile class="size-4 text-muted-foreground" />}
          when={props.node.isFolder}
        >
          <Show
            fallback={<IconFolder class="size-4 text-blue-500" />}
            when={expanded()}
          >
            <IconFolderOpen class="size-4 text-blue-500" />
          </Show>
        </Show>
        <span class="truncate">{props.node.name}</span>
      </button>
      <Show when={props.node.isFolder && expanded()}>
        <For each={props.node.children}>
          {(child) => (
            <FileTreeNode
              depth={depth() + 1}
              node={child}
              onSelect={props.onSelect}
              selectedFile={props.selectedFile}
            />
          )}
        </For>
      </Show>
    </div>
  );
}

type FileTreeProps = {
  files: BlockFile[];
  selectedFile: Accessor<string>;
  onSelect: (path: string) => void;
};

function FileTree(props: FileTreeProps) {
  const tree = createMemo(() => buildFileTree(props.files));

  return (
    <div class="h-full overflow-auto border-r bg-muted/30 p-2">
      <For each={tree()}>
        {(node) => (
          <FileTreeNode
            node={node}
            onSelect={props.onSelect}
            selectedFile={props.selectedFile}
          />
        )}
      </For>
    </div>
  );
}

function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ts":
    case "tsx":
      return "tsx";
    case "js":
    case "jsx":
      return "jsx";
    case "css":
      return "css";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "html":
      return "html";
    default:
      return "typescript";
  }
}

export function BlockViewer(props: BlockViewerProps) {
  const [activeTab, setActiveTab] = createSignal<"preview" | "code">("preview");
  const [selectedFile, setSelectedFile] = createSignal(
    props.files[0]?.path ?? ""
  );
  const [previewKey, setPreviewKey] = createSignal(0);

  const selectedFileContent = createMemo(() => {
    const file = props.files.find((f) => f.path === selectedFile());
    return file?.content ?? "";
  });

  const hasPreview = () => !!props.preview || !!props.previewUrl;
  const hasMultipleFiles = () => props.files.length > 1;

  const handleRefresh = () => {
    setPreviewKey((k) => k + 1);
  };

  const handleOpenInNewTab = () => {
    if (props.previewUrl) {
      window.open(props.previewUrl, "_blank", "noopener");
    }
  };

  return (
    <div class={cn("space-y-4", props.class)}>
      {/* Install Command */}
      <InstallCommand component={props.registryName} />

      {/* Main Viewer */}
      <div class="overflow-hidden rounded-lg border">
        {/* Toolbar */}
        <div class="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
          <Tabs
            class="flex-1"
            onChange={(value) => setActiveTab(value as "preview" | "code")}
            value={activeTab()}
          >
            <TabsList class="h-8 bg-transparent p-0">
              <Show when={hasPreview()}>
                <TabsTrigger
                  class="h-7 rounded-md px-3 text-xs data-[selected]:bg-background"
                  value="preview"
                >
                  Preview
                </TabsTrigger>
              </Show>
              <TabsTrigger
                class="h-7 rounded-md px-3 text-xs data-[selected]:bg-background"
                value="code"
              >
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div class="flex items-center gap-1">
            <Show when={activeTab() === "preview" && hasPreview()}>
              <Button
                aria-label="Refresh preview"
                class="h-7 w-7"
                onClick={handleRefresh}
                size="icon"
                variant="ghost"
              >
                <IconRefresh class="size-4" />
              </Button>
              <Show when={props.previewUrl}>
                <Button
                  aria-label="Open in new tab"
                  class="h-7 w-7"
                  onClick={handleOpenInNewTab}
                  size="icon"
                  variant="ghost"
                >
                  <IconExternalLink class="size-4" />
                </Button>
              </Show>
            </Show>
            <Show when={activeTab() === "code"}>
              <CopyButton class="h-7 w-7" value={selectedFileContent()} />
            </Show>
          </div>
        </div>

        {/* Content */}
        <div class="min-h-[400px]">
          <Show when={activeTab() === "preview" && hasPreview()}>
            <div
              class="flex min-h-[400px] items-center justify-center p-6"
              data-preview-key={previewKey()}
            >
              <Show fallback={props.preview} when={props.previewUrl}>
                <iframe
                  class="h-[400px] w-full rounded border-0"
                  src={props.previewUrl}
                  title={`${props.name} preview`}
                />
              </Show>
            </div>
          </Show>

          <Show when={activeTab() === "code" || !hasPreview()}>
            <div class={cn("flex", hasMultipleFiles() ? "min-h-[400px]" : "")}>
              {/* File Tree - only show for multiple files */}
              <Show when={hasMultipleFiles()}>
                <div class="w-64 shrink-0">
                  <FileTree
                    files={props.files}
                    onSelect={setSelectedFile}
                    selectedFile={selectedFile}
                  />
                </div>
              </Show>

              {/* Code Panel */}
              <div class="min-w-0 flex-1">
                <CodeBlock
                  class="rounded-none border-0"
                  code={selectedFileContent()}
                  filename={hasMultipleFiles() ? selectedFile() : undefined}
                  lang={getLanguageFromPath(selectedFile())}
                  showCopy={false}
                />
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
