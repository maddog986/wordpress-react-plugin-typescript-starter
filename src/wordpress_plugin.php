<?php

/**
 * Copyright (C) 2020. Drew Gauderman
 *
 * This source code is licensed under the MIT license found in the
 * README.md file in the root directory of this source tree.
 */

/**
 *
 * @link              https://dpg.host
 * @since             1.0.0
 * @package           wordpress_plugin
 * @author            Drew Gauderman <drew@dpg.host>
 * @copyright         2018-2020 Drew Gauderman.
 *
 * @wordpress-plugin
 * Plugin Name:       WPSRT Plugin
 * Plugin URI:        https://dpg.host
 * Description:       A WordPress Starter React Typescript Plugin
 * Version:           1.0.0
 * Author:            Drew Gauderman
 * Author URI:        https://dpg.host
 * Text Domain:       wordpress_plugin
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 */

// Exit if accessed directly
if (! defined('ABSPATH')) {
    exit;
}

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
add_action('plugins_loaded', function () {
    //include our plugin class
    require plugin_dir_path(__FILE__) . 'lib/class-plugin.php';

    new wordpress_plugin();
});
