import React, { useEffect, useMemo, useRef, useState } from 'react';

export type ProductImageUploaderProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  title?: string;
  description?: string;
  className?: string;
  accept?: string;
};

type PreviewItem = {
  key: string;
  src: string;
  name: string;
  file: File;
};

function createFileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export default function ProductImageUploader({
  files,
  onFilesChange,
  maxFiles = 10,
  disabled = false,
  title = 'Product images',
  description = 'Select images from your device. They stay staged here until you publish the product.',
  className = '',
  accept = 'image/*',
}: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [objectUrls, setObjectUrls] = useState<Record<string, string>>({});

  const fileItems = useMemo(() => {
    return files.map((file) => ({
      key: createFileKey(file),
      file,
    }));
  }, [files]);

  useEffect(() => {
    const nextObjectUrls: Record<string, string> = {};

    fileItems.forEach(({ key, file }) => {
      nextObjectUrls[key] = URL.createObjectURL(file);
    });

    setObjectUrls((previous) => {
      Object.values(previous).forEach((url) => URL.revokeObjectURL(url));
      return nextObjectUrls;
    });

    return () => {
      Object.values(nextObjectUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileItems]);

  const previewItems: PreviewItem[] = fileItems.map(({ key, file }) => ({
    key,
    src: objectUrls[key],
    name: file.name,
    file,
  }));

  const remainingSlots = Math.max(0, maxFiles - previewItems.length);

  const openFilePicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;

    const nextFiles = [...files, ...selected].slice(0, maxFiles);
    onFilesChange(nextFiles);
    event.target.value = '';
  };

  const removeLocalFile = (fileKey: string) => {
    const nextFiles = files.filter((file) => createFileKey(file) !== fileKey);
    onFilesChange(nextFiles);
  };

  const clearAll = () => {
    onFilesChange([]);
  };

  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={openFilePicker}
            disabled={disabled || remainingSlots <= 0}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {previewItems.length ? 'Add more images' : 'Select images'}
          </button>

          {previewItems.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              disabled={disabled}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || remainingSlots <= 0}
      />

      <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        {previewItems.length === 0 ? (
          <button
            type="button"
            onClick={openFilePicker}
            disabled={disabled}
            className="flex w-full flex-col items-center justify-center rounded-xl py-10 text-center text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-sm font-medium text-slate-900">No images selected yet</span>
            <span className="mt-1 text-sm">Tap to choose product photos from your device</span>
            <span className="mt-2 text-xs text-slate-500">Previews stay here until you publish</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {previewItems.map((item) => (
              <div key={item.key} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="aspect-square w-full bg-slate-100">
                  <img
                    src={item.src}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="border-t border-slate-200 p-2">
                  <p className="truncate text-xs font-medium text-slate-700" title={item.name}>
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">Staged for publish</p>
                </div>

                <button
                  type="button"
                  onClick={() => removeLocalFile(item.key)}
                  disabled={disabled}
                  className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-100 transition group-hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Remove ${item.name}`}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}

            {remainingSlots > 0 && (
              <button
                type="button"
                onClick={openFilePicker}
                disabled={disabled}
                className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="text-2xl font-light">+</span>
                <span className="mt-1 text-xs font-medium">Add photos</span>
                <span className="mt-1 text-[11px] text-slate-500">{remainingSlots} slot{remainingSlots === 1 ? '' : 's'} left</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>{previewItems.length} / {maxFiles} selected</span>
        <span>Images stay local until Publish</span>
      </div>
    </section>
  );
}
