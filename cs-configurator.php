<?php
/**
 * Plugin Name: CS Configurator
 * Plugin URI: https://dotbits.nl
 * Description: Show the CS Configurator on your website.
 * Version: 0.1
 * Text Domain: cs-configurator
 * Author: Gijs Jager
 * Author URI: https://dotbits.nl
 * @see https://docs.twikit.com/5.0/development
 */

define('CO_CONFIGURATOR_JS', plugin_dir_url(__FILE__) . 'assets/js/');
define('CO_CONFIGURATOR_CSS', plugin_dir_url(__FILE__) . 'assets/css/');
define('CO_CONFIGURATOR_IMG', plugin_dir_url(__FILE__) . 'assets/img/');
define('CO_CONFIGURATOR_PATH', plugin_dir_path(__FILE__));


include CO_CONFIGURATOR_PATH . 'includes/helpers.php';

/**
 * Add shortcut
 */
include CO_CONFIGURATOR_PATH . 'includes/render_template.php';
add_shortcode('cs_configurator', 'show_configurator');

function cs_configurator_add_head_script()
{
    if (is_page('configurator')) {
        ?>
        <script src="https://js.sentry-cdn.com/636bca206f7d6ad6c6a62da1616a122e.min.js"
                crossorigin="anonymous"></script>
        <script>
            if (typeof Sentry !== 'undefined') {
                Sentry.onLoad(function () {
                    Sentry.init();
                });
            }
        </script>
        <?php
    }
}

add_action('wp_head', 'cs_configurator_add_head_script');

/**
 * Add settings
 */
include CO_CONFIGURATOR_PATH . 'includes/settings.php';

