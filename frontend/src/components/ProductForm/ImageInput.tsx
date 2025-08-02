import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import ConnectForm from "../ConnectForm";
import { ImageInputProps } from "./types";

const ImageInput: React.FC<ImageInputProps> = ({
  name = "referenceImage",
  value,
  error,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);
  const { setValue } = useFormContext();

  useEffect(() => {
    if (!image) return;

    const objectUrl = URL.createObjectURL(image);
    setValue(name, image, { shouldValidate: true });
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image, name]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setValue(name, null, { shouldValidate: true });
    setPreviewUrl(null);
  };

  const openImagePrompt = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      document.getElementById("image")?.click();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="text-mine-shaft mb-2 text-sm font-medium">
        Reference Image
      </div>
      {!previewUrl ? (
        <>
          <ConnectForm>
            {({ register }) => (
              <label
                {...register("referenceImage")}
                htmlFor="image"
                className={twMerge(
                  `border-oyster/30 bg-oyster/10 hover:bg-oyster/20 outline-oyster flex h-64 w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors duration-300 focus-visible:outline-2`,
                  `${error && "border-red-400"}`,
                )}
                tabIndex={0}
                role="button"
                onKeyDown={openImagePrompt}
              >
                <Upload className="text-oyster mx-auto mb-2 h-10 w-10" />
                <p className="text-mine-shaft/90 mb-2 text-sm">
                  Click to upload main product image
                </p>
                <span className="text-mine-shaft/50 text-xs">
                  PNG, JPG or WEBP (max. 5MB)
                </span>
              </label>
            )}
          </ConnectForm>
          <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
          <input
            onChange={handleImageChange}
            type="file"
            accept="image/*"
            className="hidden"
            id="image"
            name="image"
            aria-label="Upload product image"
          />
        </>
      ) : (
        <div
          tabIndex={0}
          className="group outline-oyster relative aspect-square max-w-md overflow-hidden rounded-md outline-offset-2 focus-visible:outline-2"
        >
          <button
            type="button"
            onClick={handleRemoveImage}
            className="outline-oyster invisible absolute top-3 right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white p-1.5 opacity-0 outline-offset-2 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 hover:bg-neutral-300 focus-visible:outline-2"
          >
            <X />
          </button>
          <img
            src={previewUrl}
            className="object-cover transition-all duration-300 group-hover:brightness-85"
          />
        </div>
      )}
    </div>
  );
};

export default ImageInput;
