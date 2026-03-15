import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPackageType, updatePackageType } from "@/services/adminSettings";
import { uploadImage } from "@/services/documents";
import { useEffect, useState, useRef } from "react";
import {
  useGetAdminDimensionUnits,
  useGetAdminWeightUnits,
} from "@/queries/admin/useGetAdminSettings";
import { allowOnlyNumbers } from "@/lib/utils";
import { CustomInput } from "@/components/CustomInput";

export function PackageTypeModal({
  open,
  setOpen,
  type,
  info,
}: {
  open: boolean;
  setOpen: any;
  type: string;
  info: any;
}) {
  const { data: weightUnits } = useGetAdminWeightUnits();
  const { data: dimensionUnits } = useGetAdminDimensionUnits();

  const schema = z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(3, { message: "Please enter a name" }),
    length: z
      .number({ required_error: "Length is required" })
      .min(1, { message: "Please enter a valid length" }),
    width: z
      .number({ required_error: "Width is required" })
      .min(1, { message: "Please enter a valid width" }),
    height: z
      .number({ required_error: "Height is required" })
      .min(1, { message: "Please enter a valid height" }),
    maxWeight: z
      .number({ required_error: "Max weight is required" })
      .min(1, { message: "Please enter a valid max weight" }),
    weightUnit: z
      .string({ required_error: "Weight unit is required" })
      .min(1, { message: "Please enter a weight unit" }),
    dimensionUnit: z
      .string({ required_error: "Dimension unit is required" })
      .min(1, { message: "Please enter a dimension unit" }),
    code: z
      .string({ required_error: "Code is required" })
      .min(1, { message: "Please enter a code" }),
    description: z
      // .string().optional(),
      .string({ required_error: "Description is required" })
      .min(5, { message: "Please enter a description" }),
    imageUrl: z
      .string({ required_error: "Image URL is required" })
      .min(1, { message: "Please upload an image" })
      .url({ message: "Please provide a valid image URL" }),
    active: z.boolean().optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const weightUnit = watch("weightUnit");
  const dimensionUnit = watch("dimensionUnit");
  const imageUrl = watch("imageUrl");
  const active = watch("active") ?? false;

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Reset form with incoming info when modal opens
  useEffect(() => {
    if (open && type === "edit" && info) {
      reset({
        ...info,
        length: info.length?.toString() ?? "",
        width: info.width?.toString() ?? "",
        height: info.height?.toString() ?? "",
        maxWeight: info.maxWeight?.toString() ?? "",
        imageUrl: info.imageUrl ?? "",
        active: info.active ?? false,
      });
    } else if (open && type === "create") {
      reset({
        name: "",
        length: undefined,
        width: undefined,
        height: undefined,
        maxWeight: undefined,
        weightUnit: "",
        dimensionUnit: "",
        code: "",
        description: "",
        imageUrl: "",
        active: false,
      });
    }
  }, [open, info, type, reset]);

  const queryClient = useQueryClient();

  const { mutate: createType, isPending: pendingCreate } = useMutation({
    mutationFn: createPackageType,
    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["package_types"],
      });
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const { mutate: updateType, isPending: pendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updatePackageType(id, data), // ✅ call with correct shape

    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["package_types"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    setIsUploading(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = (reader.result as string).split(",")[1]; // Remove data:image/jpeg;base64, prefix
          const response = await uploadImage(base64, selectedFile.name);

          // Extract URL from nested response structure
          const imageUrl =
            response.data?.data?.url ||
            response.data?.data?.image?.url ||
            response.data?.data?.display_url;

          if (imageUrl) {
            setValue("imageUrl", imageUrl, { shouldValidate: true });
            toast.success("Image uploaded successfully");
            setSelectedFile(null);
            setPreviewUrl(imageUrl);
          } else {
            toast.error("Failed to get image URL from response");
            console.error("Unexpected response structure:", response);
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

  const onSubmit = (data: z.infer<typeof schema>) => {
    type === "create" && createType(data);

    type === "edit" &&
      updateType({
        id: info?.id,
        data: data,
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent autoFocus={false} className="gap-0">
        <DialogTitle className="text-[20px] font-semibold font-inter mb-2">
          Package Type
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-neutral600">
          {type === "create" ? "Add a package type." : "Edit a package type."}
        </DialogDescription>
        <>
          <div className="py-4 text-sm mt-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex md:flex-row flex-col gap-4 items-center">
                <CustomInput
                  inputType="text"
                  label="Name"
                  wrapperClassName="w-full"
                  registration={register("name")}
                  error={errors.name?.message}
                  inputProps={{ placeholder: "Enter name" }}
                />
                <CustomInput
                  inputType="number"
                  label="Length"
                  wrapperClassName="w-full"
                  registration={register("length", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  error={errors.length?.message}
                  inputProps={{
                    placeholder: "Enter length",
                    onKeyDown: allowOnlyNumbers,
                  }}
                />
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <CustomInput
                  inputType="number"
                  label="Width"
                  wrapperClassName="w-full"
                  registration={register("width", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  error={errors.width?.message}
                  inputProps={{
                    placeholder: "Enter width",
                    onKeyDown: allowOnlyNumbers,
                  }}
                />
                <CustomInput
                  inputType="number"
                  label="Height"
                  wrapperClassName="w-full"
                  registration={register("height", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  error={errors.height?.message}
                  inputProps={{
                    placeholder: "Enter height",
                    onKeyDown: allowOnlyNumbers,
                  }}
                />
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <CustomInput
                  inputType="number"
                  label="Max Weight"
                  wrapperClassName="w-full"
                  registration={register("maxWeight", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  error={errors.maxWeight?.message}
                  inputProps={{
                    placeholder: "Enter max weight",
                    onKeyDown: allowOnlyNumbers,
                  }}
                />
                <CustomInput
                  inputType="select"
                  label="Weight Unit"
                  wrapperClassName="w-full"
                  value={weightUnit}
                  placeholder="Select weight unit"
                  options={
                    weightUnits?.map((item: string) => ({
                      label: item,
                      value: item,
                    })) ?? []
                  }
                  error={errors.weightUnit?.message}
                  onValueChange={(val) =>
                    setValue("weightUnit", val, { shouldValidate: true })
                  }
                />
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <CustomInput
                  inputType="select"
                  label="Dimension Unit"
                  wrapperClassName="w-full"
                  value={dimensionUnit}
                  placeholder="Select dimension unit"
                  options={
                    dimensionUnits?.map((item: string) => ({
                      label: item,
                      value: item,
                    })) ?? []
                  }
                  error={errors.dimensionUnit?.message}
                  onValueChange={(val) =>
                    setValue("dimensionUnit", val, { shouldValidate: true })
                  }
                />
                <CustomInput
                  inputType="text"
                  label="Code"
                  wrapperClassName="w-full"
                  registration={register("code")}
                  error={errors.code?.message}
                  inputProps={{ placeholder: "Enter code" }}
                />
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <CustomInput
                  inputType="text"
                  label="Description"
                  wrapperClassName="w-full"
                  registration={register("description")}
                  error={errors.description?.message}
                  inputProps={{ placeholder: "Enter description" }}
                />
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <CustomInput
                  inputType="image"
                  label={
                    <>
                      Package Image <span className="text-red-500">*</span>
                    </>
                  }
                  wrapperClassName="w-full"
                  previewUrl={previewUrl}
                  imageUrl={imageUrl}
                  selectedFileName={selectedFile?.name}
                  isUploading={isUploading}
                  fileInputRef={fileInputRef}
                  onFileSelect={handleFileSelect}
                  onUpload={handleImageUpload}
                  error={errors.imageUrl?.message}
                />
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <CustomInput
                  inputType="toggle"
                  label="Status"
                  checked={active}
                  onCheckedChange={(val) => setValue("active", val)}
                />
              </div>

              <Button
                variant={"secondary"}
                className=" bg-brand"
                loading={type === "edit" ? pendingUpdate : pendingCreate}
              >
                {type === "edit" ? "Update" : "Add"}
              </Button>
            </form>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
