import { routeTree } from "@/src/routeTree.gen"
import { getQueryClient } from "@/src/util/get-query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { NuqsAdapter } from "nuqs/adapters/react"
import { Toaster } from "sonner"

const router = createRouter({
  routeTree,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

export function App() {
  const query = getQueryClient()

  return (
    <NuqsAdapter>
      <QueryClientProvider client={query}>
        <RouterProvider router={router} />
        <Toaster richColors closeButton position="top-right" theme="light" />
      </QueryClientProvider>
    </NuqsAdapter>
  )
}
