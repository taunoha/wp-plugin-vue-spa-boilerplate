<?php

defined('ABSPATH') or die();

wp_interactivity_config('{plugin-shortcode}', array(
  'baseURL' => ld_{plugin}_get_base_url(),
  'translations' => require(LD_{PLUGIN}_DIR . '/languages/messages.php'),
  'attributes' => $args,
));

?>
<div id="{plugin-shortcode}" v-cloak></div>
