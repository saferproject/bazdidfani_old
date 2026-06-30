const DB_NAME = "bazdidfani_otp";
const STORE_NAME = "otp_sent";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "phone" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function setOTPSentForPhone(phone: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put({ phone, sentAt: Date.now() });
  await new Promise<void>((res) => {
    tx.oncomplete = () => res();
  });
  db.close();

  setTimeout(async () => {
    try {
      const db2 = await openDB();
      const tx2 = db2.transaction(STORE_NAME, "readwrite");
      tx2.objectStore(STORE_NAME).delete(phone);
      await new Promise<void>((res) => {
        tx2.oncomplete = () => res();
      });
      db2.close();
    } catch {
      // cleanup failure is non-critical
    }
  }, 120_000);
}

export async function getOTPSentTime(
  phone: string,
): Promise<number | null> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(phone);
    request.onsuccess = () => {
      db.close();
      const record = request.result;
      if (record && Date.now() - record.sentAt < 120_000) {
        resolve(record.sentAt as number);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => {
      db.close();
      resolve(null);
    };
  });
}
