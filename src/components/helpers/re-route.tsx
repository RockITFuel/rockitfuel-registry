import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";
import { isDev } from "solid-js/web";

export default function ReRoute({
  routes,
}: {
  routes: { from: string[]; to: string }[];
}) {
  const location = useLocation();
  const navigate = useNavigate();

  createEffect(() => {
    console.debug("[ReRoute] Routes:", routes);
    routes.forEach(({ from, to }) => {
      if (from.some((f) => location.pathname === f)) {
        if (isDev) {
          console.debug("[ReRoute] Matched reroute:", {
            from,
            currentPath: location.pathname,
            to,
            location,
          });
        }
        navigate(to);
      } else if (isDev) {
        console.debug("[ReRoute] No match for route:", {
          currentPath: location.pathname,
          from,
        });
      }
    });
  });
  return <></>;
}
