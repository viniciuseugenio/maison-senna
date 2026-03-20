import { FetchError } from "@/api/client";
import { userQueryOptions } from "@/api/queries";
import { RouterContext } from "@/routes/__root";
import { redirect } from "@tanstack/react-router";

async function checkAuthStatus(
  context: RouterContext,
): Promise<{ authenticated: boolean }> {
  try {
    const data = await context.queryClient.fetchQuery(userQueryOptions);
    return { authenticated: data?.authenticated };
  } catch (error) {
    if (error instanceof FetchError) {
      console.debug("FetchError during auth check -> treat as unauthenticated");
      return { authenticated: false };
    }

    throw error;
  }
}

export async function requiredUnauthenticated(props: {
  context: RouterContext;
}) {
  const { authenticated } = await checkAuthStatus(props.context);
  if (authenticated) {
    throw redirect({ to: "/" });
  }
}

export async function requiredAuthenticated(props: { context: RouterContext }) {
  const { authenticated } = await checkAuthStatus(props.context);
  if (!authenticated) {
    throw redirect({ to: "/login", search: { next: location.pathname } });
  }
}
