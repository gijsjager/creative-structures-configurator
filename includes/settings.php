<?php
/**
 * Add settings
 */
function co_options_page()
{
    add_menu_page(
        'CS Twikit Configurator',
        'CS Twikit Configurator',
        'manage_options',
        'cs-configurator',
        function () {
            ?>
            <h1>Twikit configurator</h1>

            <?php if (isset($_GET['settings-updated']) && $_GET['settings-updated']): ?>
                <div id="message" class="updated notice is-dismissible">
                    <p>Settings saved.</p>
                </div>
            <?php endif; ?>

            <form method="post" action="options.php">
                <?php
                settings_fields('co_settings_group');
                do_settings_sections('cs-configurator');
                submit_button();
                ?>
            </form>


            <hr/>

            <h3>Shortcode widget</h3>

            <p>
                You can easily embed the configurator by inserting the shorttag in your content.<br/>
            </p>

            <code>
                [cs_configurator project="1234" product="1234"]
            </code>

            <p>
                <strong>project</strong><br/>
                The (project)-ID can be found in Twikit > Projects<br/>
                Check the address bar for the ID<br/>
                https://platform.twikit.com/projects/{ID}
                <br/><br/>
                <strong>product</strong><br/>
                The (product)-ID can be found in Twikit > Projects > Products > ID
            </p>

            <hr/>

            <h2>Start with a specific type</h2>

            <p>
                You can start the embed with a specific type by adding the correct type name in the shortcode
            </p>
            <code>
                [cs_configurator project="1234" product="1234" type="My Product"]
            </code>
            <br/><br/>
            <hr/>

            <h2>Links</h2>

            <ul>
                <li><a href="https://platform.twikit.com/" target="_blank">Twikit Platform</a></li>
                <li><a href="https://docs.twikit.com/5.0/development" target="_blank">Twikit Development</a></li>
                <li><a href="https://dotbits.nl" target="_blank">Author of this awesome plugin 🤖</a></li>
            </ul>

            <?php
        }
    );
}

add_action('admin_menu', 'co_options_page');


add_action('admin_init', function () {

    // Add settings per product type
    $items = [
        'lounger_medium' => 'Lounger Medium',
        'lounger_large' => 'Lounger Large',
        'crossover_medium' => 'Crossover Medium',
        'crossover_large' => 'Crossover Large',
        'hexadome_medium' => 'Hexadome Medium',
        'hexadome_large' => 'Hexadome Large',
    ];

    // Register a section first
    add_settings_section(
        'co_items_section',
        'Product Settings',
        function () {
            echo '<p>Set the price and total persons for each product type.</p>';
        },
        'cs-configurator'
    );

    foreach ($items as $key => $label) {
        register_setting('co_settings_group', "co_{$key}_price_from");
        register_setting('co_settings_group', "co_{$key}_total_persons_standing");
        register_setting('co_settings_group', "co_{$key}_total_persons_sitting");
        add_settings_field(
            "co_{$key}_fields",
            $label,
            function () use ($key, $label) {
                $price = esc_attr(get_option("co_{$key}_price_from", ''));
                $personsStanding = esc_attr(get_option("co_{$key}_total_persons_standing", ''));
                $personsSitting = esc_attr(get_option("co_{$key}_total_persons_sitting", ''));
                echo "<label>Price from: <input type='number' step='0.01' name='co_{$key}_price_from' value='{$price}' /></label><br/>";
                echo "<label>Total persons standing: <input type='number' name='co_{$key}_total_persons_standing' value='{$personsStanding}' /></label><br/>";
                echo "<label>Total persons sitting: <input type='number' name='co_{$key}_total_persons_sitting' value='{$personsSitting}' /></label>";
            },
            'cs-configurator',
            'co_items_section' // Use the section ID here
        );
    }

    add_settings_section(
        'co_categories_section',
        'Category Settings',
        function () {
            echo '<p>Set information about the categories.</p>';
        },
        'cs-configurator'
    );

    global $csConfiguratorCategories;
    foreach($csConfiguratorCategories as $key => $label) {
        register_setting('co_settings_group', "co_{$key}_info");
        add_settings_field(
            "co_{$key}_info",
            $label,
            function () use ($key, $label) {
                wp_editor(
                    get_option("co_{$key}_info", ''),
                    "co_{$key}_info",
                    [
                        'textarea_name' => "co_{$key}_info",
                        'textarea_rows' => 5,
                        'media_buttons' => true,
                    ]
                );

            },
            'cs-configurator',
            'co_categories_section' // Use the section ID here
        );
    }
});