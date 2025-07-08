<?php
/**
 * @see https://docs.twikit.com/5.0/development
 */

function show_configurator($atts = []) {

    global $csConfiguratorCategories;

    // extract the settings from the options
    $items = [
        'lounger_medium' => 'Lounger Medium',
        'lounger_large' => 'Lounger Large',
        'crossover_medium' => 'Crossover Medium',
        'crossover_large' => 'Crossover Large',
        'hexadome_medium' => 'Hexadome Medium',
        'hexadome_large' => 'Hexadome Large',
    ];

    $config = [];
    foreach ($items as $key => $label) {
        $config[$key] = [
            'label' => $label,
            'price_from' => get_option("co_{$key}_price_from", ''),
            'total_persons_standing' => get_option("co_{$key}_total_persons_standing", ''),
            'total_persons_sitting' => get_option("co_{$key}_total_persons_sitting", ''),
        ];
    }

    $categoryTooltips = [];
    foreach ($csConfiguratorCategories as $key => $label) {
        $categoryTooltips[$key] = apply_filters('the_content', get_option("co_{$key}_info", []));
    }

    // support ID attribute
    $attributes = shortcode_atts([
        'project' => '',
        'product' => '',
        'type' => '',
    ], $atts);

    ob_start();
    include CO_CONFIGURATOR_PATH . 'templates/configurator.php';
    return ob_get_clean();
}