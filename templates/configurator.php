<div id="co-configurator-loading">
    <p>Loading products...</p>
</div>
<div class="co-configurator-wrapper" id="co-configurator-wrapper">
    <div class="co-configurator-canvas-holder">
        <div id="co-configurator-canvas"></div>
        <div id="co-configurator-products"></div>
    </div>
    <div id="co-configurator-ui">
        <div id="co-configurator-ui-header">
            <div id="co-configurator-breadcrumbs"></div>
        </div>
        <div id="co-configurator-parameters"></div>
        <div id="co-configurator-submit" style="display: none;">
            <button type="button" title="Submit"
                    class="co-configurator-submit elementor-button elementor-size-sm elementor-animation-grow">
                Submit
            </button>
        </div>
    </div>
    <div id="co-configurator-message">
        <h2>Thank you for your interest</h2>
        <p>
            We will reply as soon as possible. <br/>
            <br/>

            You can save the configuration in PDF format for later use.<br/>
            <br/>
            <button id="co-configurator-download"
               class="co-configurator-download elementor-button elementor-size-sm">
                <span class="text">DOWNLOAD CONFIGURATION (PDF)</span>
                <span class="loading">
                    <img src="<?= CO_CONFIGURATOR_IMG ?>loading.svg" width="16" height="16" alt="loading">
                    GENERATING PDF...
                </span>
            </button>
        </p>
    </div>
</div>


<link rel="stylesheet" href="<?= CO_CONFIGURATOR_CSS ?>configurator.css?v=<?= time(); ?>">
<script>
    var coProductKey = "<?= $attributes['product']; ?>";
    var coInitialProduct = "<?= $attributes['type']; ?>";
    var coImageDir = "<?= CO_CONFIGURATOR_IMG ?>";
    var thankYouPage = "<?= get_permalink(7143) ?>";
    var coProductConfig = <?= json_encode($config) ?>;
    var coCategoryTooltips = <?= json_encode($categoryTooltips) ?>;
</script>
<script src="https://unpkg.com/@popperjs/core@2"></script>
<script src="https://unpkg.com/tippy.js@6"></script>
<script src="https://platform-assets.twikit.com/plugin-scripts/949/<?= $attributes['project'] ?>/plugin-script.js"></script>
<script src="<?= CO_CONFIGURATOR_JS ?>configurator.js?v=<?= time() ?>"></script>