import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/services/documents";
import { CustomInput } from "@/components/CustomInput";

type ImageUploadProps = {
  label?: string;
  imageUrl?: string;
  onUrlChange: (url: string) => void;
  error?: string;
  wrapperClassName?: string;
};

export function ImageUpload({
  label = "Image",
  imageUrl,
  onUrlChange,
  error,
  wrapperClassName,
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(imageUrl ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select a valid image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image size should be less than 5MB"); return; }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) { toast.error("Please select an image first"); return; }
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = (reader.result as string).split(",")[1];
          const response = await uploadImage(base64, selectedFile.name);
          const url =
            response.data?.data?.url ||
            response.data?.data?.image?.url ||
            response.data?.data?.display_url;
          if (url) {
            onUrlChange(url);
            setPreviewUrl(url);
            setSelectedFile(null);
            toast.success("Image uploaded successfully");
          } else {
            toast.error("Failed to get image URL from response");
          }
        } catch (error: any) {
          toast.error(error?.message || "Failed to upload image");
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload image");
      setIsUploading(false);
    }
  };

  return (
    <CustomInput
      inputType="image"
      label={label}
      wrapperClassName={wrapperClassName ?? "w-full"}
      previewUrl={previewUrl}
      imageUrl={imageUrl}
      selectedFileName={selectedFile?.name}
      isUploading={isUploading}
      fileInputRef={fileInputRef}
      onFileSelect={handleFileSelect}
      onUpload={handleUpload}
      error={error}
    />
  );
}
