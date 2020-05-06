<?php

/**
 * Copyright (C) 2020. Drew Gauderman
 *
 * This source code is licensed under the MIT license found in the
 * README.md file in the root directory of this source tree.
 */


/**
 * Fired when the plugin is uninstalled.
 *
 * @since      1.0.0
 *
 * @package    wordpress_plugin
 */

 // Exit if accessed directly
if (! defined('ABSPATH')) {
    exit;
}

// If uninstall not called from WordPress, then exit.
if (! defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}
