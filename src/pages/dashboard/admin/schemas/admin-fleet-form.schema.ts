import { z } from "zod";

const AdminFleetFormSchema = z.object({
	usage: z.union([z.literal("freighter"), z.literal("passenger")]),
	type_ownership: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
	smart_number: z.number({ invalid_type_error: "شماره هوشمند الزامی است", required_error: "شماره هوشمند الزامی است" }),
	first_number: z.string(),
	second_number: z.string(),
	third_character: z.string(),
	fourth_number: z.string(),
	Insurance_validity: z.string(),
	validity_technical_examination: z.string(),
	description: z.string().max(255, "طول توضیحات بیشتر از 255 حرف نمیتواند باشد").optional().nullable(),
	date_made: z.number(),
	VIN: z.string(),
	loader_type_id: z.string().uuid(),
	allowed_certificate: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	owner_phone_number: z
		.string()
		.length(11, "شماره همراه باید 11 رقم باشد")
		.regex(/^09\d{9}$/, "شماره موبایل باید فقط شامل اعداد باشد و با 09 شروع شود")
		.optional()
		.nullable(),
	loaderSearch: z.string().optional().nullable(),
});

export type AdminFleetFormType = z.infer<typeof AdminFleetFormSchema>;

export default AdminFleetFormSchema;