import { z } from "zod";













const TechnicalInspectionFormSchema = z.object({
  id: z.number(),
  truck_id: z.number(),
  smart_number: z.number({
    invalid_type_error: "شماره هوشمند را وارد کنید",
    required_error: "شماره هوشمند را وارد کنید",
  }),
  first_number: z.string(),
  second_number: z.string(),
  third_character: z.string(),
  fourth_number: z.string(),
  loader_type: z.string(),
  loader_type_id: z.string(),
  plate_type: z.number(),
  insurance_validity: z.string(),
  type: z.union([z.literal(1), z.literal(2)]),
  user_id: z.number(),
  company: z.object({}),
  company_id: z.number(),
  date_made: z.number().optional().nullish(),
  VIN: z.string().optional().nullish(),
  validity_technical_examination: z.string(),
  allowed_certificate: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional().nullish(),
  is_new: z.boolean(),
  loader: z.object({
    id: z.string(),
    loader_code: z.number(),
    name: z.string(),
  }),

  // NOTE none sendable controls
  loadingTypeSearch: z.string(),
});

export default TechnicalInspectionFormSchema;

export type TechnicalInspectionFormType = z.infer<
  typeof TechnicalInspectionFormSchema
>;
