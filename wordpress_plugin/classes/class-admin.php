<?php
/**
 * Copyright (C) 2020. Drew Gauderman
 *
 * This source code is licensed under the MIT license found in the
 * README.md file in the root directory of this source tree.
 */

new class('wordpress_plugin_admin', filemtime(__FILE__)) extends wordpress_plugin_base {
    /**
     * admin_menu.
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Monday, May 4th, 2020.
     * @access	public
     * @return	void
     */
    public function admin_menu()
    {
        add_menu_page(
            __('WPS Admin', $this->name),
            __('WPS Admin', $this->name),
            'manage_options',
            $this->name,
            [$this, 'menu_page'],
            ''
        );
    }

    /**
     * menu_page.
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Monday, May 4th, 2020.
     * @access	public
     * @return	void
     */
    public function menu_page()
    {
        echo "<div id=\"wordpress_plugin_react\"></div>";
    }

    /**
     * Loads all the css styles and javascript for admin backend.
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Saturday, October 27th, 2018.
     * @access	public
     * @return	void
     */
    public function admin_enqueue_scripts_styles($hookSuffix)
    {
        // only display the css or javascript for the custom post type pages
        if (!is_admin() || $hookSuffix !== "toplevel_page_$this->name") {
            return;
        }

        // bootstrap and our css file
        $this->wp_enqueue_style($this->name, 'plugin-private.min.css');

        // load javascript
        $this->wp_register_script($this->name, 'plugin-private.min.js');
    }
};
