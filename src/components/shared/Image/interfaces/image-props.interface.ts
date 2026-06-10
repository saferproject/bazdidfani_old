import ImageOrientations from "../../dialogs/ImageMagnifierDialog/types/image-orientations";

export default interface ImageProps {
	image: string;
	alt: string;
	width?: "w-4" | "w-6" | "w-8" | "w-10" | "w-12" | "w-16" | "w-24" | "w-32";
	height?: "h-4" | "h-6" | "h-8" | "h-10" | "h-12" | "h-16" | "h-24" | "h-32";
	borderRadius?:
		| "rounded-xs"
		| "rounded-sm"
		| "rounded-md"
		| "rounded-lg"
		| "rounded-xl"
		| "rounded-2xl"
		| "rounded-3xl"
		| "rounded-full"
		| "";
	stopPropagation?: boolean;
	orientation?: ImageOrientations;
	placeholder?: React.ReactNode;
}
