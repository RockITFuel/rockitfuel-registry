import { FileField } from "@kobalte/core/file-field";
import { Upload, X } from "lucide-solid";
import { createMemo, createSignal, Show, splitProps } from "solid-js";
import { useBindSignal } from "~/hooks/use-bind-signal";
import { cn } from "~/lib/utils";
import { Button } from "./button";
import { InputError } from "./input-error";
import { InputLabel } from "./input-label";

type SingleFileInputDndProps = {
  name: string;
  value?: File | null; // File for new uploads, string URL for existing files
  onFileChange?: (file: File | undefined | null) => void;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  errorClass?: string;
  labelClass?: string;
  wrapperClass?: string;
  class?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  showPreview?: boolean;
  existingFileUrl?: string | null; // URL for existing file in edit mode
  existingFileName?: string | null; // Name for existing file in edit mode
};

export function SingleFileInputDnd(props: SingleFileInputDndProps) {
  const [dragActive, setDragActive] = createSignal(false);
  const [previewUrl, setPreviewUrl] = useBindSignal<string | undefined>({
    value: () => props.existingFileUrl ?? undefined,
  });

  // Split props for better organization
  const [local, fileFieldProps] = splitProps(props, [
    "class",
    "label",
    "error",
    "wrapperClass",
    "labelClass",
    "errorClass",
    "placeholder",
    "onFileChange",
    "existingFileUrl",
    "existingFileName",
  ]);

  // Get current file - either from files state or existing value
  const [currentFile, setCurrentFile] = useBindSignal<File | undefined>({
    value: () => (props.value?.size ? props.value : undefined),
  });
  // Get display info for current file/existing file
  const fileInfo = createMemo(() => {
    const file = currentFile();
    if (file) {
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        isNew: true,
      };
    }

    if (props.existingFileUrl && props.existingFileName) {
      return {
        name: props.existingFileName,
        size: null,
        type: null,
        isNew: false,
      };
    }

    return null;
  });

  // Check if file is an image
  const isImage = createMemo(() => {
    const info = fileInfo();
    if (!info) return false;

    if (info.isNew && info.type) {
      return info.type.startsWith("image/");
    }

    // For existing files, check file extension
    if (!info.isNew) {
      const extension = info.name.split(".").pop()?.toLowerCase();
      return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
        extension || ""
      );
    }

    return false;
  });

  // Handle file selection
  const handleFileSelect = (details: any) => {
    const { acceptedFiles } = details;
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // Take only the first file for single file input
    if (!file) return;

    local.onFileChange?.(file);

    // Create preview URL for images
    if (props.showPreview !== false && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    local.onFileChange?.(null);
    setCurrentFile(undefined);
    // Clean up preview URL
    const url = previewUrl();
    if (url) {
      URL.revokeObjectURL(url);
      setPreviewUrl(undefined);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / k ** i).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div class={cn("space-y-1.5", local.wrapperClass)}>
      <InputLabel
        class={local.labelClass}
        label={local.label}
        name={props.name}
        required={props.required}
      />

      <FileField
        accept={props.accept}
        disabled={props.disabled}
        multiple={false}
        onFileChange={handleFileSelect}
      >
        <div class="space-y-3">
          {/* Drop Zone */}
          <FileField.Dropzone
            class={cn(
              "relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
              "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              props.disabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer",
              dragActive() ? "border-primary bg-accent/50" : "border-input",
              props.error ? "border-destructive" : "",
              // Dynamic height based on whether we have an image preview
              fileInfo() && isImage() && previewUrl() ? "min-h-48" : "min-h-32",
              local.class
            )}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDrop={() => setDragActive(false)}
          >
            <Show
              fallback={
                <div class="flex flex-col items-center justify-center space-y-2 p-6 text-center">
                  <Upload class="h-8 w-8 text-muted-foreground" />
                  <div class="text-muted-foreground text-sm">
                    <span class="font-medium">
                      Klik om een bestand te selecteren
                    </span>
                    <span> of sleep het hierheen</span>
                  </div>
                  <Show when={local.placeholder}>
                    <p class="text-muted-foreground text-xs">
                      {local.placeholder}
                    </p>
                  </Show>
                </div>
              }
              when={previewUrl()}
            >
              {/* Image preview in the dropzone */}
              <div class="relative h-full w-full overflow-hidden rounded-lg">
                <img
                  alt={fileInfo()?.name ?? "Uploaded file"}
                  class="h-full w-full object-cover"
                  onError={() => {
                    console.warn("Failed to load image preview");
                  }}
                  src={previewUrl()}
                />
                {/* Delete button overlay */}
                <div class="absolute top-2 right-2">
                  <Button
                    class="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onclick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    size="icon"
                    title="Verwijder bestand"
                    type="button"
                    variant="secondary"
                  >
                    <X class="h-4 w-4" />
                  </Button>
                </div>
                {/* File name overlay */}
                <div class="absolute right-0 bottom-0 left-0 bg-background/80 p-2 backdrop-blur-sm">
                  <p class="truncate font-medium text-foreground text-sm">
                    {fileInfo()?.name}
                  </p>
                  <Show when={fileInfo()?.size}>
                    <p class="text-muted-foreground text-xs">
                      {formatFileSize(fileInfo()!.size!)}
                    </p>
                  </Show>
                </div>
              </div>
            </Show>

            <FileField.HiddenInput id={props.name} />
          </FileField.Dropzone>
        </div>
      </FileField>

      <InputError
        class={local.errorClass}
        error={props.error}
        name={props.name}
      />
    </div>
  );
}
