"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { fetchWithAuth } from "@/lib/apiHelper";

interface ImageUploaderProps {
  onUploadSuccess: (data: { imageUrl: string; publicId: string }) => void;
  defaultImage?: string;
  className?: string;
}

export default function ImageUploader({ onUploadSuccess, defaultImage, className = "" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Only JPEG, PNG, or WEBP are allowed.");
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setError("Max file size is 4MB.");
        return;
      }

      setError(null);
      setUploading(true);

      try {
        const signRes = await fetchWithAuth("/admin/upload/sign", { method: "POST" });
        const signData = await signRes.json();

        if (!signData.success) throw new Error(signData.message || "Failed to get upload signature");

        const { signature, timestamp, cloudName, apiKey, folder } = signData.data;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) throw new Error(uploadData.error?.message || "Upload to Cloudinary failed");

        setPreview(uploadData.secure_url);
        onUploadSuccess({ imageUrl: uploadData.secure_url, publicId: uploadData.public_id });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 1,
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUploadSuccess({ imageUrl: "", publicId: "" });
  };

  return (
    <div className={`w-full min-w-0 space-y-3 ${className}`}>
      {error && <p className="text-xs text-red-600">{error}</p>}

      <div
        {...getRootProps()}
        className={`relative flex min-h-[12rem] w-full min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors sm:min-h-[14rem] ${
          isDragActive
            ? "border-emerald-500 bg-emerald-500/8"
            : "border-neutral-200/90 bg-gradient-to-b from-emerald-50/40 to-neutral-50/80 hover:border-emerald-400/60 hover:from-emerald-50/60"
        }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="absolute inset-0 h-full w-full">
            <Image src={preview} alt="Preview" fill className="object-cover opacity-80" unoptimized />
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                <Spinner />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <p className="text-xs font-semibold text-white">Click or drag to replace</p>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="rounded bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full px-6 py-8 text-center">
            {uploading ? (
              <Spinner />
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-600 ring-1 ring-emerald-500/20">
                  <ImageIcon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold text-emerald-700">Upload image</p>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                  Drag and drop or click to browse · JPG, PNG, or WebP · max 4MB
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#10b981] border-t-transparent" />;
}
