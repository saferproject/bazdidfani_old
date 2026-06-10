# OpenAPI + React

## Backend

This project uses `dedoc/scramble` as the OpenAPI source of truth.

- Interactive docs UI: `/docs/api`
- Raw OpenAPI document: `/docs/api.json`
- Export command: `composer docs:export`

Scramble builds the document from:

- `routes/*`
- controller method signatures
- `FormRequest` validation rules
- PHPDoc and Scramble attributes such as `#[Endpoint]`

## Recommended React stack

For React, a lightweight typed setup is:

1. `openapi-typescript`
2. `openapi-fetch`
3. `@tanstack/react-query` if you want caching and hooks

Install:

```bash
pnpm add openapi-fetch @tanstack/react-query
pnpm add -D openapi-typescript
```

Generate types:

```bash
pnpm openapi-typescript http://localhost:8000/docs/api.json -o src/api/schema.d.ts
```

## Client setup

Create `src/api/client.ts`:

```ts
import createClient from "openapi-fetch";
import type { paths } from "./schema";

export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});
```

## Usage

Requests and responses will be inferred from `paths`.

```ts
import { api } from "./client";

const login = async () => {
  const { data, error } = await api.POST("/api/auth/login", {
    body: {
      username: "09123456789",
      password: "1234",
    },
  });

  if (error) {
    throw error;
  }

  return data;
};
```

In the example above:

- `body` is autocompleted from the OpenAPI schema
- `data` is typed from the response schema
- invalid request fields become TypeScript errors

## Authenticated requests

If you store a Sanctum token in the frontend, attach it with a middleware wrapper:

```ts
import createClient from "openapi-fetch";
import type { paths } from "./schema";

export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});

api.use({
  async onRequest({ request }) {
    const token = localStorage.getItem("token");

    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }

    request.headers.set("Accept", "application/json");

    return request;
  },
});
```

## React Query example

```ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";

export function useStates(query?: string) {
  return useQuery({
    queryKey: ["states", query],
    queryFn: async () => {
      const { data, error } = await api.GET("/api/states", {
        params: {
          query: query ? { query } : undefined,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
```

## Regeneration workflow

When backend request rules or responses change:

1. Regenerate the backend OpenAPI document
2. Regenerate frontend TypeScript types
3. Commit the updated schema and generated types together
