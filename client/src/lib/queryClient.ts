import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  _method: string,
  _url: string,
  _data?: unknown | undefined,
): Promise<Response> {
  console.warn("API calls have been removed. Returning mock success.");
  // Simulate a successful response with empty JSON
  return Promise.resolve(new Response(JSON.stringify({}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  }));
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  (_options) => // Options are no longer relevant
  async ({ queryKey }) => {
    console.warn(`API call to ${queryKey[0]} removed. Returning empty array/null.`);
    // Return an empty array for list-like resources, or null for single resources
    // This is a generic mock, specific components might need more tailored static data.
    if ((queryKey[0] as string).endsWith('s')) { // a simple heuristic for collections
      return Promise.resolve([]);
    }
    return Promise.resolve(null);
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
