import InspectionSchema from "./schemas/inspection-item.schema";
import Dexie, { EntityTable } from "dexie";








const dexieDB = new Dexie("Inspections") as Dexie & {
  Inspection: EntityTable<InspectionSchema>;
};

dexieDB.version(1).stores({
  Inspection: "inspectionId",
});

export default dexieDB;
