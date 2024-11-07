import { createHead } from "@unhead/vue";
import { getConfig } from "@wordpress/interactivity";
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import { setLocaleData } from "@/utils/i18n";

import "./assets/scss/main.scss";

const { translations } = getConfig("{plugin-shortcode}");

setLocaleData(translations);

const app = createApp(App);
const head = createHead();

app.use(router);
app.use(head);

app.mount("#{plugin-shortcode}");
