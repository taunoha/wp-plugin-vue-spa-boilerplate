import { createWebHistory, createRouter } from "vue-router";
import { getConfig } from "@wordpress/interactivity";
import { routes } from "vue-router/auto-routes";

const { baseURL } = getConfig("{plugin-shortcode}");

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

function ensureTrailingSlash(url) {
  const [path, query] = url.split("?");
  let newPath = path.endsWith("/") ? path : path + "/";

  if (query) {
    newPath += "?" + query;
  }

  return newPath;
}

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
    document.body.classList.remove(`{plugin-shortcode}-${from.name}`);
  }
  if (to.name) {
    document.body.classList.add(`{plugin-shortcode}-${to.name}`);
  }
});

export default router;
