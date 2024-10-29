<?php

/**
 * Plugin Name: {plugin-name}
 * Description: 
 * Author: 
 * Version: 1.0
 */

defined('ABSPATH') or die();

define('LD_{PLUGIN}_DIR', dirname(__FILE__));
define('LD_{PLUGIN}_URL', plugin_dir_url(__FILE__));
define('LD_{PLUGIN}_BASE', '{plugin-path}');

function ld_{plugin}_rewrite_rules()
{
  $base = wp_unslash(LD_{PLUGIN}_BASE);
  add_rewrite_rule($base . '/?$', 'index.php?ld_{plugin}=app', 'top');
  add_rewrite_rule($base . '/(.+?)/?$', 'index.php?ld_{plugin}=app', 'top');
}
add_action('init', 'ld_{plugin}_rewrite_rules');

function ld_{plugin}_query_vars($qvars)
{
  $qvars[] = 'ld_{plugin}';
  return $qvars;
}
add_filter('query_vars', 'ld_{plugin}_query_vars');

function ld_{plugin}_body_classes($classes)
{
  if (get_query_var('ld_{plugin}')) {
    $classes[] = 'has-{plugin-shortcode}-app';
  }

  return $classes;
}
add_filter('body_class', 'ld_{plugin}_body_classes');

function ld_{plugin}_template_include($template)
{
  if (get_query_var('ld_{plugin}')) {
    $new_template = locate_template(array('page-{plugin-shortcode}.php'));

    if (!empty($new_template)) {
      return $new_template;
    }
  }
  return $template;
}
add_filter('template_include', 'ld_{plugin}_template_include', 99);

function ld_{plugin}_script_attribute($tag, $handle, $src)
{
  if ('{plugin-shortcode}' !== $handle) {
    return $tag;
  }

  $tag = '<script type="module" src="' . esc_url($src) . '"></script>';

  return $tag;
}
add_filter('script_loader_tag', 'ld_{plugin}_script_attribute', 10, 3);

function ld_{plugin}_shortcode($atts)
{
  if (is_admin()) {
    return;
  }

  $attributes = shortcode_atts(array(), $atts);
  $hmrUrl = "";

  wp_enqueue_style('{plugin-shortcode}', LD_{PLUGIN}_URL . 'dist/{plugin-shortcode}.css', false, filemtime(LD_{PLUGIN}_DIR . '/dist/{plugin-shortcode}.js'), 'screen');
  
  if( !empty($hmrUrl) ) {
    wp_enqueue_script('{plugin-shortcode}', esc_url($hmrUrl), false, null, true);
  } else {
    wp_enqueue_script('{plugin-shortcode}', LD_{PLUGIN}_URL . 'dist/{plugin-shortcode}.js', false, filemtime(LD_{PLUGIN}_DIR . '/dist/{plugin-shortcode}.js'), true);
  }

  ob_start();
  load_template(LD_{PLUGIN}_DIR . '/blocks/default.php', false, $attributes);
  return ob_get_clean();
}
add_shortcode('{plugin-shortcode}', 'ld_{plugin}_shortcode');

function ld_{plugin}_get_base_url()
{
  $base = wp_unslash(LD_{PLUGIN}_BASE);
  $baseURL = trailingslashit(parse_url(trailingslashit(home_url()), PHP_URL_PATH));
  
  return rtrim($baseURL, '/') . '/' . $base . '/';
}

function ld_{plugin}_activate()
{
  flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'ld_{plugin}_activate');
