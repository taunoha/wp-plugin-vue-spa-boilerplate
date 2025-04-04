import { createWebHistory, createRouter } from "vue-router";
import { getConfig } from "@wordpress/interactivity";
import { routes } from "vue-router/auto-routes";

const { baseURL } = getConfig("{plugin-shortcode}");

const sanitizeRoutePath = (path) => {
  if (!path) {
    return "";
  }

  let sanitized = path.endsWith('/') ? path.slice(0, -1) : path;
  sanitized = sanitized.replace(/\//g, '-');
  sanitized = sanitized.replace(/\[|\]/g, '');

  return sanitized;
}

const ensureTrailingSlash = (url) => {
  const [path, query] = url.split("?");
  let newPath = path.endsWith("/") ? path : path + "/";

  if (query) {
    newPath += "?" + query;
  }

  return newPath;
}

const localRoutes = [
  {
    name: "404",
    path: "/:catchAll(.*)",
    component: () => import("@/404.vue"),
  },
];

const router = createRouter({
  trailingSlash: true,
  history: createWebHistory(baseURL),
  routes: [...routes, ...localRoutes],
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

router.beforeEach((to, _, next) => {
  const path = ensureTrailingSlash(to.fullPath);
  if (to.fullPath !== path) {
    next(path);
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  if (from.name) {
    document.body.classList.remove(sanitizeRoutePath(`{plugin-shortcode}-${from.name}`));
  }
  if (to.name) {
    document.body.classList.add(sanitizeRoutePath(`{plugin-shortcode}-${to.name}`));
  }
});

export default router;
