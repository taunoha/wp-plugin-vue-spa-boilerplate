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

function ld_{plugin}_pre_get_posts($query)
{
  if( is_admin() ) {
    return;
  }

  if( !get_query_var('ld_{plugin}') ) {
    return;
  }

  if ($query->is_main_query())
  {
    $query->is_home = false;
    $query->is_archive = false;
    $query->is_page = true;
    $query->is_singular = true;

    // Prevent any post querying
    $query->set('posts_per_page', 0);
    $query->set('no_found_rows', true);
    
    // Clear objects to prevent additional queries
    $query->queried_object = null;
    $query->queried_object_id = null;
  } 
}
add_action('pre_get_posts', 'ld_{plugin}_pre_get_posts');

function ld_{plugin}_skip_query($posts, $query)
{
  if( is_admin() ) {
    return $posts;
  }
  
  if ($query->is_main_query() && get_query_var('ld_{plugin}'))
  {
    $dummy_post = new stdClass();
    $dummy_post->ID = '{plugin-shortcode}';
    $dummy_post->post_author = 0;
    $dummy_post->post_date = current_time('mysql');
    $dummy_post->post_date_gmt = current_time('mysql', 1);
    $dummy_post->post_content = '';
    $dummy_post->post_title = '{plugin-name}';
    $dummy_post->post_excerpt = '';
    $dummy_post->post_status = 'publish';
    $dummy_post->comment_status = 'closed';
    $dummy_post->ping_status = 'closed';
    $dummy_post->post_password = '';
    $dummy_post->post_name = '';
    $dummy_post->to_ping = '';
    $dummy_post->pinged = '';
    $dummy_post->post_modified = current_time('mysql');
    $dummy_post->post_modified_gmt = current_time('mysql', 1);
    $dummy_post->post_content_filtered = '';
    $dummy_post->post_parent = 0;
    $dummy_post->guid = '';
    $dummy_post->menu_order = 0;
    $dummy_post->post_type = 'page';
    $dummy_post->post_mime_type = '';
    $dummy_post->comment_count = 0;
    $dummy_post->filter = 'raw';

    return array($dummy_post);
  }

  return $posts;
}
add_filter('posts_pre_query', 'ld_{plugin}_skip_query', 10, 2);

function ld_{plugin}_prevent_404($handled)
{
  if (get_query_var('ld_{plugin}')) {
      return true;
  }
  return $handled;
}
add_filter('pre_handle_404', 'ld_{plugin}_prevent_404', 10, 2);

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
  
  if( !empty($hmrUrl) ) {
    wp_enqueue_script('{plugin-shortcode}', esc_url($hmrUrl), false, null, true);
  } else {
    $filemtime = filemtime(LD_{PLUGIN}_DIR . '/dist/{plugin-shortcode}.js'); 
    wp_enqueue_script('{plugin-shortcode}', LD_{PLUGIN}_URL . 'dist/{plugin-shortcode}.js', false, $filemtime, true);
    wp_enqueue_style('{plugin-shortcode}', LD_{PLUGIN}_URL . 'dist/{plugin-shortcode}.css', false, $filemtime, 'screen');
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
