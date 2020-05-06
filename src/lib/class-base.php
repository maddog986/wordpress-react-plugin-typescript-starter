<?php
/**
 * Copyright (C) 2020. Drew Gauderman
 *
 * This source code is licensed under the MIT license found in the
 * README.md file in the root directory of this source tree.
 */

/**
 * wpsp_base. other classes extend this one.
 *
 * @author	Drew Gauderman <drew@dpg.host>
 * @since	v1.0.0
 * @global
 */
class wpsp_base
{
    /**
     * @since	v1.0.0
     * @var		string	$name
     * @access	protected
     */
    protected $name;

    /**
     * @since	v1.0.0
     * @var		string	$version
     * @access	protected
     */
    protected $version;

    /**
     * @since	v1.0.0
     * @var		string	$version
     * @access	protected
     */
    protected $plugin_url;

    /**
     * @since	v1.0.0
     * @var		string	$version
     * @access	protected
     */
    protected $plugin_path;

    /**
     * __construct
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Wednesday, October 24th, 2018.
     * @access	public
     * @param	string	$name   	Default: 'base_class'
     * @param	string	$version	Optional. Default: '1.0.0'
     * @return	void
     */
    public function __construct($name = 'base_class', $version = '1.0.0')
    {
        global $wp_filter;

        $this->name = $name;
        $this->version = $version;
        $this->plugin_url = plugin_dir_url(__DIR__);
        $this->plugin_path = plugin_dir_path(__DIR__);

        //debug mode enabled
        if ($this->is_debug()) {
            ini_set('display_errors', 1);
            ini_set('display_startup_errors', 1);
            error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED);

            // disable redirect for development
            remove_filter('template_redirect', 'redirect_canonical');
        }

        // for more simple classes that dont want to use __construct
        if (method_exists($this, 'init')) {
            $this->add('filter', 'init', [$this, 'init'], 10, 0);
        }

        $ignore = ['add', 'filter', 'action', 'remove_action', 'remove_filter', 'run', '__construct'];

        //register the class functions as possible call actions
        foreach (get_class_methods($this) as $method_name) {
            if (in_array($method_name, $ignore)) {
                continue;
            }

            $reflection = new ReflectionMethod(get_class($this), $method_name);
            $args = $reflection->getNumberOfParameters();

            foreach ($wp_filter as $name => $value) {
                if (strpos($method_name, $name) !== false) {
                    $this->action($name, $method_name, 10, $args);

                    break;
                }
            }

            $this->action($method_name, $method_name, 10, $args);
        }
    }

    /**
     * Add a new action to the collection to be registered with WordPress.
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Sunday, October 21st, 2018.
     * @access	public
     * @param	string 	$hook         	The name of the WordPress action that is being registered.
     * @param	mixed  	$callback     	The name of the function definition on the $component.
     * @param	integer	$priority     	Optional. The priority at which the function should be fired. Default is 10.
     * @param	integer	$accepted_args	Optional. The number of arguments that should be passed to the $callback. Default is 1.
     * @return	void
     */
    public function action($hook = '', $callback, $priority = 10, $accepted_args = 1)
    {
        $this->add('action', $hook, $callback, $priority, $accepted_args);
    }

    /**
     * filter
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Monday, October 22nd, 2018.
     * @access	public
     * @param	string 	$hook         	Default: ''
     * @param	mixed  	$callback		string of function name, or function
     * @param	integer	$priority     	Default: 10
     * @param	integer	$accepted_args	Default: 1
     * @return	void
     */
    public function filter($hook = '', $callback, $priority = 10, $accepted_args = 1)
    {
        $this->add('filter', $hook, $callback, $priority, $accepted_args);
    }

    /**
     * add_shortcode
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Monday, October 22nd, 2018.
     * @access	public
     * @param	string	$tag
     * @param	mixed 	$callback
     * @return	void
     */
    public function add_shortcode($tag = '', $callback)
    {
        $this->add('shortcode', $tag, $callback);
    }

    /**
     * remove_action
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Monday, October 22nd, 2018.
     * @access	public
     * @param	string	$tag
     * @param	mixed 	$callback
     * @return	void
     */
    public function remove_action($tag = '', $callback, $priority = 10)
    {
        $this->add('remove_action', $tag, $callback, $priority);
    }

    /**
     * remove_filter
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Monday, October 22nd, 2018.
     * @access	public
     * @param	string	$tag     	Default: ''
     * @param	mixed 	$callback
     * @return	void
     */
    public function remove_filter($tag = '', $callback, $priority = 10)
    {
        $this->add('remove_filter', $tag, $callback, $priority);
    }

    /**
     * add
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Monday, October 22nd, 2018.
     * @access	protected
     * @param	string	$type
     * @param	string	$hook
     * @param	mixed 	$callback
     * @param	number	$priority     	Optional. Default: 10
     * @param	number	$accepted_args	Optional. Default: 1
     * @return	void
     */
    protected function add($type = '', $hook = '', $callback, $priority = 10, $accepted_args = 1)
    {
        $action = [
            'type' => $type,
            'hook' => $hook,
            'callback' => $callback,
            'priority' => $priority,
            'accepted_args' => $accepted_args
        ];

        if (!in_array($type, ['remove_filter', 'remove_action']) && is_string($callback) && method_exists($this, $callback)) {
            $callback = [$this, $callback];
        }

        switch ($type) {
                //register filter or action
            case 'filter':
            case 'action':
                add_filter($hook, $callback, $priority, $accepted_args);
                break;

                //register shortcode
            case 'shortcode':
                add_shortcode($hook, $callback);
                break;

                //remove filter or action
            case 'remove_filter':
            case 'remove_action':
                remove_filter($hook, $callback, $priority);
                break;
        }
    }

    /**
     * Returns true if Debugging is Enabled.
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @access	protected
     * @return	mixed
     */
    protected function is_debug()
    {
        return ($_SERVER['REMOTE_ADDR'] == '172.32.0.1');
    }

    /**
     * get_template
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Wednesday, October 24th, 2018.
     * @access	protected
     * @param	string	$fileName	Optional. Default: ''
     * @param	mixed 	$arg     	Optional. Default: null
     * @return	void
     */
    protected function get_template($fileName = '', $arg = null)
    {
        include($this->plugin_path . "template-parts/$fileName.php");
    }

    /**
     * get_asset_img_path
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Monday, October 22nd, 2018.
     * @access	protected
     * @param	string	$fileName
     * @return	string
     */
    protected function get_asset_img_path($fileName = '')
    {
        return $this->plugin_path . "assets/img/$fileName";
    }

    /**
     * get_asset_css_url
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Monday, October 22nd, 2018.
     * @access	protected
     * @param	string	$fileName
     * @return	string
     */
    protected function get_asset_css_url($fileName = '')
    {
        return $this->plugin_url . "assets/css/$fileName";
    }

    /**
     * get_asset_css_version.
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.30
     * @version	v1.0.0	Tuesday, January 8th, 2019.
     * @access	protected
     * @param	string	$fileName	Default: ''
     * @return	mixed
     */
    protected function get_asset_css_version($fileName = '')
    {
        return @filemtime($this->plugin_path . "assets/css/$fileName");
    }

    /**
     * get_asset_js_version.
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.30
     * @version	v1.0.0	Tuesday, January 8th, 2019.
     * @access	protected
     * @param	string	$fileName	Default: ''
     * @return	mixed
     */
    protected function get_asset_js_version($fileName = '')
    {
        return @filemtime($this->plugin_path . "assets/js/$fileName");
    }

    /**
     * get_asset_js_url
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Monday, October 22nd, 2018.
     * @access	protected
     * @param	string	$fileName
     * @return	string
     */
    protected function get_asset_js_url($fileName = '')
    {
        return $this->plugin_url . "assets/js/$fileName";
    }

    /**
     * set_transient
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Wednesday, October 31st, 2018.
     * @access	public
     * @param	string	$name 	Default: ''
     * @param	mixed 	$value
     * @return	void
     */
    public function set_transient($name = '', $value)
    {
        set_transient($this->name . $name, ['version' => $this->version, 'value' => $value]);
    }

    /**
     * get_transient
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Wednesday, October 31st, 2018.
     * @access	public
     * @param	string	$name 	Default: ''
     * @param	mixed 	$value
     * @return	mixed
     */
    public function get_transient($name = '')
    {
        $trans = get_transient($this->name . $name);

        //received an update, so need to purge the trans
        if ((!empty($trans) && $trans['version'] != $this->version) || isset($_GET['cookieclear'])) {
            delete_transient($this->name . $name);
            return; //not getting anything
        }

        return $trans['value'] ?? null;
    }

    /**
     * delete_transient
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Wednesday, October 31st, 2018.
     * @access	public
     * @param	string	$name	Default: ''
     * @return	void
     */
    public function delete_transient($name = '')
    {
        delete_transient($this->name . $name);
    }

    /**
     * base64url_encode
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Friday, November 2nd, 2018.
     * @access	public
     * @param	string	$data
     * @return	string
     */
    public function base64url_encode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * base64url_decode
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Friday, November 2nd, 2018.
     * @access	public
     * @param	string	$data
     * @return	string
     */
    public function base64url_decode($data)
    {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }

    /**
     * register_nav_menus.
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Wednesday, April 29th, 2020.
     * @access	public
     * @param	array	$data	Default: []
     * @return	void
     */
    public function register_nav_menus($data = [])
    {
        $this->action('after_setup_theme', function () use ($data) {
            register_nav_menus($data);
        });
    }

    /**
     * wp_enqueue_style.
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Wednesday, April 29th, 2020.
     * @access	public
     * @param	mixed	$file
     * @return	void
     */
    public function wp_enqueue_style($name, $file)
    {
        wp_enqueue_style($name, $this->get_asset_css_url($file), [], $this->get_asset_css_version($file));
    }

    /**
     * wp_enqueue_script.
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Wednesday, April 29th, 2020.
     * @access	public
     * @param	mixed	$name
     * @param	mixed	$file
     * @param	array	$depends	Default: []
     * @return	void
     */
    public function wp_enqueue_script($name, $file, $depends = [])
    {
        wp_deregister_script($name);
        wp_enqueue_script($name, $this->get_asset_js_url($file), $depends, $this->get_asset_js_version($file), true);
        wp_enqueue_script($name);
    }

    /**
     * wp_register_script.
     *
     * @author	Drew Gauderman <drew@dpg.host>
     * @since	v1.0.0
     * @version	v1.0.0	Friday, May 1st, 2020.
     * @access	public
     * @param	string	$name
     * @param	string	$file
     * @param	array	$depends 	Default: []
     * @return	void
     */
    public function wp_register_script($name, $file, $depends = [], $localize = false, $localizeArray = [])
    {
        // make sure its deregistered
        wp_deregister_script($name);

        // load javascript
        wp_register_script($name, $this->get_asset_js_url($file), $depends, $this->get_asset_js_version($file), true);

        if ($localize) {
            wp_localize_script($this->name, $localize, $localizeArray);
        }

        // Enqueue our script
        wp_enqueue_script($this->name);
    }

    /**
     * gets the current post type in the WordPress Admin
     *
     * @author  Brad Vincent
     * @author	Domenic Fiore
     * @since	v1.0.0
     * @see     https://gist.github.com/bradvin/1980309
     * @see     https://gist.github.com/DomenicF/3ebcf7d53ce3182854716c4d8f1ab2e2
     * @return	string
     */
    public function get_current_post_type()
    {
        global $post, $typenow, $current_screen;

        //we have a post so we can just get the post type from that
        if ($post && $post->post_type) {
            return $post->post_type;
        }

        //check the global $typenow - set in admin.php
        elseif ($typenow) {
            return $typenow;
        }

        //check the global $current_screen object - set in sceen.php
        elseif ($current_screen && $current_screen->post_type) {
            return $current_screen->post_type;
        }

        //check the post_type querystring
        elseif (isset($_REQUEST['post_type'])) {
            return sanitize_key($_REQUEST['post_type']);
        }

        //lastly check if post ID is in query string
        elseif (isset($_REQUEST['post'])) {
            return get_post_type($_REQUEST['post']);
        }

        //we do not know the post type!
        return null;
    }
}
