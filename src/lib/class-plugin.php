<?php
/**
 * Copyright (C) 2020. Drew Gauderman
 *
 * This source code is licensed under the MIT license found in the
 * README.md file in the root directory of this source tree.
 */

 // base class
require_once('class-base.php');

/**
 * wordpress_plugin.
 *
 * @author	Drew Gauderman <drew@dpg.host>
 * @since	v1.0.0
 * @version	v1.0.0	Friday, May 1st, 2020.
 * @see		wpsp_base
 * @global
 */
class wordpress_plugin extends wpsp_base
{
    /**
     * __construct.
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Saturday, October 27th, 2018.
     * @access	private
     * @return	void
     */
    public function __construct()
    {
        parent::__construct('wordpress_plugin');

        // dynamically load classes from the "classes" folder.
        foreach (glob($this->plugin_path . "lib/classes/*.php") as $filename) {
            include($filename);
        }
    }

    /**
     * Loads all the frontend css styles & javascripts
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Saturday, October 27th, 2018.
     * @access	public
     * @return	void
     */
    public function wp_enqueue_scripts_styles()
    {
        // our CSS file
        $this->wp_enqueue_style($this->name, 'plugin-public.min.css');

        // our JavaScript file
        $this->wp_enqueue_script($this->name, 'plugin-public.min.js', ['jquery']);
    }
}
