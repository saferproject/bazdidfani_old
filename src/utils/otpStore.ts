const DB_NAME = "bazdidfani_otp";
const STORE_NAME = "otp_sent";
const OTP_COOLDOWN_MS = 120_000;
const memoryTimestamps = new Map<string, number>();

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    let blocked = false;

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "phone" });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      if (blocked) {
        db.close();
        return;
      }
      db.onversionchange = () => db.close();
      resolve(db);
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => {
      blocked = true;
      reject(new Error("OTP storage is blocked by another connection"));
    };
  });
}

async function runStoreRequest<T>(
  mode: IDBTransactionMode,
  createRequest: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDB();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      let request: IDBRequest<T>;

      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(transaction.error ?? new Error("OTP storage transaction failed"));
      transaction.onabort = () => reject(transaction.error ?? new Error("OTP storage transaction aborted"));

      try {
        request = createRequest(transaction.objectStore(STORE_NAME));
      } catch (error) {
        reject(error);
        transaction.abort();
      }
    });
  } finally {
    db.close();
  }
}

function isRecentTimestamp(value: unknown): value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) return false;
  const age = Date.now() - value;
  return age >= 0 && age < OTP_COOLDOWN_MS;
}

export async function setOTPSentForPhone(phone: string): Promise<void> {
  const sentAt = Date.now();
  memoryTimestamps.set(phone, sentAt);

  try {
    await runStoreRequest("readwrite", (store) => store.put({ phone, sentAt }));
  } catch {
    // Resending must still have an in-page cooldown when browser storage fails.
  }

  setTimeout(() => {
    if (memoryTimestamps.get(phone) === sentAt) memoryTimestamps.delete(phone);

    void runStoreRequest("readwrite", (store) => {
      const request = store.get(phone);
      request.onsuccess = () => {
        // An older timer must not delete an OTP sent more recently in any tab.
        if (request.result?.sentAt === sentAt && !isRecentTimestamp(sentAt)) {
          store.delete(phone);
        }
      };
      return request;
    }).catch(() => {
      // Expiry is also checked on read; cleanup is best effort.
    });
  }, OTP_COOLDOWN_MS);
}

export async function getOTPSentTime(phone: string): Promise<number | null> {
  const cached = memoryTimestamps.get(phone);
  let latest = isRecentTimestamp(cached) ? cached : null;

  try {
    const record = await runStoreRequest("readonly", (store) => store.get(phone));
    if (isRecentTimestamp(record?.sentAt)) {
      latest = latest === null ? record.sentAt : Math.max(latest, record.sentAt);
    }
  } catch {
    // IndexedDB is optional; use the same cooldown for the current page.
  }

  if (latest === null) memoryTimestamps.delete(phone);
  else memoryTimestamps.set(phone, latest);
  return latest;
}
