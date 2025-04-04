# A starter plugin to build Single-Page Vue Applications

This WordPress plugin starter provides a modern development environment for building Single-Page Applications (SPAs) with Vue.js. It includes a complete setup with Vue 3, Vue Router, Vite, ESLint, and auto-imports to help you build powerful SPAs on top of WordPress with a great developer experience.

## Use Case Example

This starter is particularly useful when building complex interactive applications that need to maintain state and provide smooth navigation without full page reloads. For example:

**Member Directory Application**: 
- Create a searchable member directory where users can:
  - Browse through member listings with instant filtering
  - View detailed member profiles without page refreshes
  - Navigate between different views (grid/list/map) seamlessly
  - Maintain search/filter states while navigating
  - Handle complex member interactions (messaging, following, etc.)

The SPA approach here provides a fluid, app-like experience while still leveraging WordPress's user management, authentication, and content management capabilities. The Vue Router integration allows for clean URLs (e.g., `/members/search/`, `/members/profile/123/`) while maintaining browser history and deep-linking support.

## Before you start

> [!NOTE]
> Prerequisites
> * Familiarity with the command line
> * Install [Node.js](https://nodejs.org/en) version 22.0 (LTS) or higher LTS

### 👉  `npm install`
* Install the dependencies in the local node_modules folder.

### 👉  `npm run rename`
* Rename placeholder strings in files
* The script will ask you for:
  * Plugin name (e.g. "Member Directory")
  * Application path (e.g. "/members", "/partner/self-service")

The path will be used to initialize the application: ``example.com/members/`` or ``example.com/partner/self-service/``

## Get Started

To get started, create a new file in your theme folder ``page-{plugin-shortcode}.php`` with the minimal content of:

```php
<?php

get_header();
echo do_shortcode('[{plugin-shortcode}]');
get_footer();
```

### Structure
```
└─ wp-content
   │
   ├─ plugins
   │  │
   │  └─ {your-plugin-folder}
   │     ├─ src
   │     │  └─ App.vue
   │     ├─ package.json
   │     └─ ld-{plugin-shortcode}.php
   │
   └─ themes
      │
      └─ {your-theme-folder}
         └─ page-{plugin-shortcode}.php
```

### Permalinks and Rewrite Rules

This plugin implements custom rewrite rules to handle SPA routing. These rules are automatically registered when the plugin is activated. However, if you experience any 404 errors or routing issues:

1. Go to WP Admin > Settings > Permalinks
2. Simply click "Save Changes" to flush the rewrite rules cache

This step ensures WordPress properly recognizes the plugin's custom URL structure.

## Development

### 👉  `npm run dev`
* Use to compile and run the code in development mode.
* Watches for any changes and reports back any errors in your code.
* Automatically enables HMR
  
### 👉  `npm run lint`
* Check your source code for programmatic and stylistic errors, and format your code.
* Formats your source code

### 👉  `npm run build`
- Check your source code for programmatic and stylistic errors, and format your code.
- Builds production code inside `dist` folder.
- Will extract translatable strings from your code and generate the `languages/messages.php` file.

## ❗️ Deploy

The `dist` folder will be overridden each time you run `npm run build` or `npm run dev`. Do not commit this folder to version control. If you use any CI/CD pipeline, make sure to trigger the build process as part of your deployment workflow.
  
## 🌶️ Auto-imports

I have set up auto-imports for components, composables, Vue.js APIs, and your utilities inside the ``utils`` folder. This includes:

- All components in your ``components`` folder
- All composables in your ``composables`` folder
- All utilities in your ``utils`` folder 
- Core Vue.js APIs (ref, computed, watch, etc.)
- VueUse composables (useStorage, useMouse, useWindowSize, etc.)
- Vue Router utilities (useRoute, useRouter, etc.)

You can use these in your application without explicitly importing them. For example:

```
components
├─ Icon
│  └─ Arrow.vue
└─ Error
|  └──Boundary.vue
```

You can use these components in your templates as:
```html
<ErrorBoundary />
<IconArrow />
```

Contrary to a classic global declaration, it will preserve typings, IDE completions, and hints and only include what is used in your code.

## File-Based Routing

This project uses Vue Router with a file-based routing approach. Every Vue file inside the `src/pages/` directory creates a corresponding URL (or route) that displays the contents of the file. For example, `src/pages/about.vue` will be accessible at `/about`. The router configuration is automatically generated based on the file structure, and Vue Router's dynamic imports ensure code-splitting to ship the minimum amount of JavaScript for each requested route.

```
pages/
├─ about/
│  └─ [id].vue
│  └─ index.vue
└─ index.vue
```

## 🌶️ Hot Module Replacement (HMR)

Hot Module Replacement (HMR) is a development feature that automatically updates your application in real-time as you modify your code. When you run `npm run dev`, HMR will:

- Instantly reflect JavaScript and CSS changes in your browser without a full page reload
- Preserve the application state during updates
- Significantly speed up your development workflow

HMR is automatically enabled in development mode (`npm run dev`) and disabled in production builds. You don't need any additional configuration to use this feature.

## &lt;ErrorBoundary&gt; component

This component handles errors in its default slot. It prevents the error from bubbling up to the top level and renders the #error slot instead.
It uses Vue's [`onErrorCaptured`](https://vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured) hook under the hood.

```html
<script setup>
function handleErrorLog(err) {
  console.log(err);
}
</script>
<template>
  <ErrorBoundary @error="handleErrorLog">
    <!-- --- -->
    <template #error="{ error, clearError }">
      <p>{{ error }}</p>
      <button @click="clearError">Try Again</button>
    </template>
  </ErrorBoundary>
</template>
```

## i18n

To make strings translatable, use the `__("Translatable string")` function in your SFC files.

```html
<script setup>
const message = __("This is a message from i18n!");
</script>

<template>
  <article>
    <h1>{{ __("Hello, World!") }}</h1>
    <p>{{ message }}</p>
    <p>{{ _n("%d person", "%d people", 2) }}</p>
    <p>{{ _nx("%d person", "%d people", 2, "different context") }}</p>
    <p>{{ _x("This is a message from i18n!", "different context") }}</p>
  </article>
</template>
```

### Translation Plugin Compatibility

This plugin is compatible with popular WordPress translation plugins like WPML, Polylang, or TranslatePress. The translation functions (`__()`, `_n()`, `_x()`, etc.) integrate with WordPress's translation ecosystem, allowing you to:

- Extract translatable strings using the plugins' string scanning features
- Manage translations through the plugins' translation interfaces
- Use the plugins' language switching functionality
- Maintain translations across different language versions of your site
