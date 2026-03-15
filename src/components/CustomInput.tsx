import { type InputHTMLAttributes, type ReactNode, type RefObject } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type Option = {
  label: ReactNode;
  value: string;
};

type BaseProps = {
  label: ReactNode;
  error?: string;
  className?: string;
  wrapperClassName?: string;
};

type TextLikeProps = BaseProps & {
  inputType: "text" | "number";
  registration: UseFormRegisterReturn;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "type">;
};

type SelectProps = BaseProps & {
  inputType: "select";
  value?: string;
  placeholder?: string;
  options: Option[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

type MultiSelectProps = BaseProps & {
  inputType: "multiSelect";
  value: string[];
  placeholder?: string;
  options: Option[];
  onChange: (value: string[]) => void;
};

type ToggleProps = BaseProps & {
  inputType: "toggle";
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
};

type ImageProps = BaseProps & {
  inputType: "image";
  previewUrl?: string;
  imageUrl?: string;
  selectedFileName?: string;
  isUploading?: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
};

type CustomInputProps =
  | TextLikeProps
  | SelectProps
  | MultiSelectProps
  | ToggleProps
  | ImageProps;

export function CustomInput(props: CustomInputProps) {
  const wrapperClassName =
    props.wrapperClassName ??
    (props.inputType === "toggle" || props.inputType === "image"
      ? "w-full"
      : "lg:w-1/2 w-full");

  const renderField = () => {
    if (props.inputType === "image") {
      return (
        <div className="w-full">
          {(props.previewUrl || props.imageUrl) && (
            <div className="mt-2 mb-3">
              <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={props.previewUrl || props.imageUrl}
                  alt="Package preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          )}

          <input
            ref={props.fileInputRef}
            type="file"
            accept="image/*"
            onChange={props.onFileSelect}
            className="hidden"
          />

          <div className="flex gap-2 items-center mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => props.fileInputRef.current?.click()}
              className="text-xs"
            >
              Choose Image
            </Button>

            {props.selectedFileName && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={props.onUpload}
                loading={props.isUploading}
                className="text-xs"
              >
                Upload
              </Button>
            )}
          </div>

          {props.selectedFileName && !props.isUploading && (
            <p className="text-xs text-gray-600 mt-1">
              Selected: {props.selectedFileName}
            </p>
          )}

          {props.imageUrl && (
            <p className="text-xs text-green-600 mt-1 break-all">
              ✓ Image uploaded successfully
            </p>
          )}
        </div>
      );
    }

    if (props.inputType === "toggle") {
      return (
        <Switch checked={props.checked} onCheckedChange={props.onCheckedChange} />
      );
    }

    if (props.inputType === "select") {
      return (
        <Select
          onValueChange={props.onValueChange}
          value={props.value}
          disabled={props.disabled}
        >
          <SelectTrigger className="outline-0 border-0 focus-visible:border-transparent focus-visible:ring-transparent w-full py-2 px-0">
            <SelectValue placeholder={props.placeholder ?? "Select option"} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((item) => (
              <SelectItem value={item.value} key={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (props.inputType === "multiSelect") {
      return (
        <MultiSelect
          options={props.options}
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
        />
      );
    }

    const inputProps =
      props.inputType === "number"
        ? {
            min: 0,
            defaultValue: 0,
            ...props.inputProps,
            onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "-") {
                event.preventDefault();
              }
              props.inputProps?.onKeyDown?.(event);
            },
            onInput: (event: React.FormEvent<HTMLInputElement>) => {
              const target = event.currentTarget;
              if (Number(target.value) < 0) {
                target.value = "0";
              }
              (props.inputProps?.onInput as ((event: React.FormEvent<HTMLInputElement>) => void) | undefined)?.(event);
            },
          }
        : props.inputProps;

    return (
      <input
        id={props.registration.name}
        {...props.registration}
        {...inputProps}
        type={props.inputType}
        className={`w-full outline-0 border-b-0 py-2 ${props.className ?? ""}`.trim()}
      />
    );
  };

  return (
    <div className={`flex flex-col ${wrapperClassName}`.trim()}>
      {props.inputType === "toggle" ? (
        <div className="flex items-center gap-4 py-2">
          {renderField()}
          <label className="font-inter text-brand font-semibold">
            {props.label}
          </label>
        </div>
      ) : props.inputType === "image" ? (
        <>
          <label className="font-inter text-brand font-semibold">
            {props.label}
          </label>
          <div>{renderField()}</div>
        </>
      ) : (
        <>
          <label
            htmlFor={
              props.inputType === "text" || props.inputType === "number"
                ? props.registration.name
                : undefined
            }
            className="font-inter text-brand font-semibold"
          >
            {props.label}
          </label>
          <div className="flex justify-between items-center gap-2 border-b mb-2">
            {renderField()}
          </div>
        </>
      )}
      {props.error && (
        <p className="error text-xs text-[#FF0000]">{props.error}</p>
      )}
    </div>
  );
}
