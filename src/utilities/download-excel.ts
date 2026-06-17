import axios from "axios";

export default async function downloadExcelFile(url: string, token: string, filename: string) {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
  const objectUrl = URL.createObjectURL(response.data);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename + ".xlsx";
  a.click();
  URL.revokeObjectURL(objectUrl);
}
