export default interface InspectionData {
  id: number;
  code: string;
  status: number;
  type: number;
  created_at: string; // ISO date/time format
  company_name: string;
  driver_phone: string | null;
  driver_name: string | null;
  driver_national_code: string | null;
  plate_first_number: number;
  plate_second_number: number;
  plate_character: string;
  plate_fourth_number: number;
  self_statement: number;
  TechnicalInspection: number;
  truck_info: {
    title: string | null;
    insurance_validity: string; // ISO date/time format
    loader_code: number;
    loader_name: string;
    smart_number: number;
  };
  technical_manager: {
    id: number;
    national_code: string;
  };
  sabaf_code: string | null;
}
