import { z as zod } from "zod/v4";

const NewRequestSchema = zod
	.object({
		driver_national_code: zod.string().optional(),
		driver_phone_number: zod.string().optional(),
		driver_father_name: zod.string().optional(),
		driver_full_name: zod.string().optional(),
	})
	.superRefine((data, ctx) => {
		const hasNationalCode = data.driver_national_code && data.driver_national_code.trim() !== "";

		if (hasNationalCode) {
			if (!data.driver_phone_number || data.driver_phone_number.length !== 11) {
				ctx.addIssue({
					code: "custom",
					message: "Phone number is required and must be 11 digits",
					path: ["driver_phone_number"],
				});
			}

			if (!data.driver_father_name || data.driver_father_name.trim() === "") {
				ctx.addIssue({
					code: "custom",
					message: "Father name is required",
					path: ["driver_father_name"],
				});
			}

			if (!data.driver_full_name || data.driver_full_name.trim() === "") {
				ctx.addIssue({
					code: "custom",
					message: "Full name is required",
					path: ["driver_full_name"],
				});
			}
		}
	});

export default NewRequestSchema;