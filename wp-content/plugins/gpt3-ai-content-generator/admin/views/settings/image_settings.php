<?php
if (!defined('ABSPATH')) exit; // Exit if accessed directly.

// Retrieve current Dall-E settings
$current_img_size = isset($settings_row['img_size']) ? $settings_row['img_size'] : '1024x1024';
$image_sizes = \WPAICG\WPAICG_Util::get_instance()->wpaicg_image_sizes;
$wpaicg_dalle_type = get_option('wpaicg_dalle_type', 'vivid');
$_wpaicg_image_style = get_option('_wpaicg_image_style', '');
$image_style_options = \WPAICG\WPAICG_Util::get_instance()->wpaicg_image_styles;

$wpaicg_art_file = WPAICG_PLUGIN_DIR . 'admin/data/art.json';
$wpaicg_painter_data = file_get_contents($wpaicg_art_file);
$wpaicg_painter_data = json_decode($wpaicg_painter_data, true);

$wpaicg_photo_file = WPAICG_PLUGIN_DIR . 'admin/data/photo.json';
$wpaicg_photo_data = file_get_contents($wpaicg_photo_file);
$wpaicg_photo_data = json_decode($wpaicg_photo_data, true);

// Retrieve existing custom image settings
$wpaicg_custom_image_settings = get_option('wpaicg_custom_image_settings', []);

// Replicate settings
$wpaicg_sd_api_key = get_option('wpaicg_sd_api_key','');
$masked_replicate_api_key = mask_api_key($wpaicg_sd_api_key);
$wpaicg_sd_api_version = get_option('wpaicg_sd_api_version','');
$replicate_models = get_option('wpaicg_replicate_models', array());
$wpaicg_default_replicate_model = get_option('wpaicg_default_replicate_model', '');

// Pexels settings
$wpaicg_pexels_api = get_option('wpaicg_pexels_api','');
$masked_pexels_api = mask_api_key($wpaicg_pexels_api);
$wpaicg_pexels_orientation = get_option('wpaicg_pexels_orientation','');
$wpaicg_pexels_size = get_option('wpaicg_pexels_size','');
$wpaicg_pexels_enable_prompt = get_option('wpaicg_pexels_enable_prompt',false);

// Pixabay settings
$wpaicg_pixabay_api = get_option('wpaicg_pixabay_api','');
$masked_pixabay_api = mask_api_key($wpaicg_pixabay_api);
$wpaicg_pixabay_language = get_option('wpaicg_pixabay_language','en');
$wpaicg_pixabay_type = get_option('wpaicg_pixabay_type','all');
$wpaicg_pixabay_orientation = get_option('wpaicg_pixabay_orientation','all');
$wpaicg_pixabay_order = get_option('wpaicg_pixabay_order','popular');
$wpaicg_pixabay_enable_prompt = get_option('wpaicg_pixabay_enable_prompt',false);

// Image options
$wpaicg_image_source = get_option('wpaicg_image_source', 'dalle3');
$wpaicg_featured_image_source = get_option('wpaicg_featured_image_source', 'dalle3');

$options = array(
    'none'         => esc_html__('None', 'gpt3-ai-content-generator'),
    'dalle3hd'     => esc_html__('DALL-E 3 HD', 'gpt3-ai-content-generator'), 
    'dalle3'       => esc_html__('DALL-E 3', 'gpt3-ai-content-generator'), // Default option if not set
    'dalle'        => esc_html__('DALL-E 2', 'gpt3-ai-content-generator'),
    'pexels'       => esc_html__('Pexels', 'gpt3-ai-content-generator'),
    'pixabay'      => esc_html__('Pixabay', 'gpt3-ai-content-generator'),
    'replicate'    => esc_html__('Replicate', 'gpt3-ai-content-generator'),
);

$dalle_variants = ['dalle3hd', 'dalle3', 'dalle']; // All DALL-E variants

// Check if any DALL-E variant is selected for image source
$is_dalle_image_selected = false;
foreach ($dalle_variants as $variant) {
    if (in_array($variant, (array)$wpaicg_image_source)) {
        $is_dalle_image_selected = true;
        break;
    }
}

// Check if any DALL-E variant is selected for featured image source
$is_dalle_featured_selected = false;
foreach ($dalle_variants as $variant) {
    if (in_array($variant, (array)$wpaicg_featured_image_source)) {
        $is_dalle_featured_selected = true;
        break;
    }
}
?>
<!-- Image Settings -->
<div class="aipower-category-container image-settings-container">
    <h3><?php echo esc_html__('Image Settings', 'gpt3-ai-content-generator'); ?></h3>
    <div id="aipower-image-settings" class="aipower-image-settings">
        <table class="aipower-image-settings-table">
            <thead>
                <tr>
                    <th><?php echo esc_html__('#', 'gpt3-ai-content-generator'); ?></th>
                    <th><?php echo esc_html__('Image', 'gpt3-ai-content-generator'); ?></th>
                    <th><?php echo esc_html__('Featured', 'gpt3-ai-content-generator'); ?></th>
                    <th><?php echo esc_html__('Conf', 'gpt3-ai-content-generator'); ?></th>
                </tr>
            </thead>
            <tbody>
                <!-- DALL-E 3 Provider Row -->
                <tr>
                    <td><?php echo esc_html__('DALL-E', 'gpt3-ai-content-generator'); ?></td>
                    <td>
                        <input type="checkbox" class="aipower-image-source" name="wpaicg_image_source[]" value="dalle3" <?php echo $is_dalle_image_selected ? 'checked' : ''; ?>>
                    </td>
                    <td>
                        <input type="checkbox" class="aipower-featured-image-source" name="wpaicg_featured_image_source[]" value="dalle3" <?php echo $is_dalle_featured_selected ? 'checked' : ''; ?>>
                    </td>
                    <td>
                        <span class="aipower-settings-icon" data-provider="dalle" title="<?php echo esc_attr__('DALL-E Settings', 'gpt3-ai-content-generator'); ?>">
                            <span class="dashicons dashicons-admin-generic"></span>
                        </span>
                    </td>
                </tr>

                <!-- Other Providers (Pexels, Pixabay, Replicate) -->
                <?php foreach (['replicate', 'pexels', 'pixabay'] as $value): ?>
                    <tr>
                        <td><?php echo esc_html(ucfirst($value), 'gpt3-ai-content-generator'); ?></td>
                        <td>
                            <input type="checkbox" class="aipower-image-source" name="wpaicg_image_source[]" value="<?php echo esc_attr($value); ?>" <?php echo in_array($value, (array)$wpaicg_image_source) ? 'checked' : ''; ?>>
                        </td>
                        <td>
                            <input type="checkbox" class="aipower-featured-image-source" name="wpaicg_featured_image_source[]" value="<?php echo esc_attr($value); ?>" <?php echo in_array($value, (array)$wpaicg_featured_image_source) ? 'checked' : ''; ?>>
                        </td>
                        <td>
                            <span class="aipower-settings-icon" data-provider="<?php echo esc_attr($value); ?>" title="<?php echo esc_attr(ucfirst($value) . ' Settings', 'gpt3-ai-content-generator'); ?>">
                                <span class="dashicons dashicons-admin-generic"></span>
                            </span>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
<!-- DALL-E Modal -->
<div id="aipower-dalle-modal" class="aipower-modal aipower-dalle-modal" style="display: none;">
    <div class="aipower-modal-content">
        <div class="aipower-modal-header">
            <h2><?php echo esc_html__('DALL-E Settings', 'gpt3-ai-content-generator'); ?></h2>
            <span class="aipower-close">&times;</span>
        </div>
        <div class="aipower-modal-body">
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- Image Source -->
                <div class="aipower-form-group">
                    <label for="aipower-dalle-variant"><?php echo esc_html__('Image Source', 'gpt3-ai-content-generator'); ?></label>
                    <select id="aipower-dalle-variant" name="wpaicg_image_source">
                        <option value="dalle3" <?php selected($wpaicg_image_source, 'dalle3'); ?>><?php echo esc_html__('DALL-E 3', 'gpt3-ai-content-generator'); ?></option>
                        <option value="dalle3hd" <?php selected($wpaicg_image_source, 'dalle3hd'); ?>><?php echo esc_html__('DALL-E 3 HD', 'gpt3-ai-content-generator'); ?></option>
                        <option value="dalle" <?php selected($wpaicg_image_source, 'dalle'); ?>><?php echo esc_html__('DALL-E 2', 'gpt3-ai-content-generator'); ?></option>
                        <option value="none" <?php selected($wpaicg_image_source, 'none'); ?>><?php echo esc_html__('None', 'gpt3-ai-content-generator'); ?></option>
                    </select>
                </div>

                <!-- Featured Image Source -->
                <div class="aipower-form-group">
                    <label for="aipower-dalle-featured-variant"><?php echo esc_html__('Featured Image Source', 'gpt3-ai-content-generator'); ?></label>
                    <select id="aipower-dalle-featured-variant" name="wpaicg_featured_image_source">
                        <option value="dalle3" <?php selected($wpaicg_featured_image_source, 'dalle3'); ?>><?php echo esc_html__('DALL-E 3', 'gpt3-ai-content-generator'); ?></option>
                        <option value="dalle3hd" <?php selected($wpaicg_featured_image_source, 'dalle3hd'); ?>><?php echo esc_html__('DALL-E 3 HD', 'gpt3-ai-content-generator'); ?></option>
                        <option value="dalle" <?php selected($wpaicg_featured_image_source, 'dalle'); ?>><?php echo esc_html__('DALL-E 2', 'gpt3-ai-content-generator'); ?></option>
                        <option value="none" <?php selected($wpaicg_featured_image_source, 'none'); ?>><?php echo esc_html__('None', 'gpt3-ai-content-generator'); ?></option>
                    </select>
                </div>

                <!--Size -->
                <div class="aipower-form-group">
                    <label for="aipower-img-size"><?php echo esc_html__('Size', 'gpt3-ai-content-generator'); ?></label>
                    <select class="aipower-select" id="aipower-img-size" name="wpaicg_img_size">
                        <?php foreach ($image_sizes as $code => $displayName): ?>
                            <option value="<?php echo esc_attr($code); ?>" <?php selected($code, $current_img_size); ?>>
                                <?php echo esc_html($displayName); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <!--Type -->
                <div class="aipower-form-group">
                    <label for="aipower-dalle-type"><?php echo esc_html__('Type', 'gpt3-ai-content-generator'); ?></label>
                    <select class="aipower-select" id="aipower-dalle-type" name="wpaicg_dalle_type">
                        <option value="vivid" <?php selected($wpaicg_dalle_type, 'vivid'); ?>><?php echo esc_html__('Vivid', 'gpt3-ai-content-generator'); ?></option>
                        <option value="natural" <?php selected($wpaicg_dalle_type, 'natural'); ?>><?php echo esc_html__('Natural', 'gpt3-ai-content-generator'); ?></option>
                    </select>
                </div>

                <!--Image Style -->
                <div class="aipower-form-group">
                    <label for="aipower-image-style"><?php echo esc_html__('Style', 'gpt3-ai-content-generator'); ?></label>
                    <select class="aipower-select" id="aipower-image-style" name="_wpaicg_image_style">
                        <?php 
                        foreach ($image_style_options as $value => $label) {
                            $selected = esc_html($_wpaicg_image_style) == $value ? ' selected' : '';
                            echo "<option value=\"" . esc_attr($value) . "\"{$selected}>" . esc_html($label) . "</option>";
                        }
                        ?>
                    </select>
                </div>

                <!-- Artist -->
                <div class="aipower-form-group">
                    <label for="aipower-artist"><?php echo esc_html__('Artist', 'gpt3-ai-content-generator'); ?></label>
                    <select class="aipower-select" name="wpaicg_custom_image_settings[artist]" id="aipower-artist">
                        <?php
                        foreach ($wpaicg_painter_data['painters'] as $key => $value) {
                            $selected = (isset($wpaicg_custom_image_settings['artist']) && $wpaicg_custom_image_settings['artist'] == $value) || (!isset($wpaicg_custom_image_settings['artist']) && $value == 'None') ? ' selected' : '';
                            echo '<option value="' . esc_attr($value) . '"' . $selected . '>' . esc_html($value) . '</option>';
                        }
                        ?>
                    </select>
                </div>

                <!-- Photography Style -->
                <div class="aipower-form-group">
                    <label for="aipower-photography-style"><?php echo esc_html__('Photography', 'gpt3-ai-content-generator'); ?></label>
                    <select class="aipower-select" name="wpaicg_custom_image_settings[photography_style]" id="aipower-photography-style">
                        <?php
                        foreach ($wpaicg_photo_data['photography_style'] as $key => $value) {
                            $selected = (isset($wpaicg_custom_image_settings['photography_style']) && $wpaicg_custom_image_settings['photography_style'] == $value) || (!isset($wpaicg_custom_image_settings['photography_style']) && $value == 'None') ? ' selected' : '';
                            echo '<option value="' . esc_attr($value) . '"' . $selected . '>' . esc_html($value) . '</option>';
                        }
                        ?>
                    </select>
                </div>

                <!-- Lighting -->
                <div class="aipower-form-group">
                    <label for="aipower-lighting"><?php echo esc_html__('Lighting', 'gpt3-ai-content-generator'); ?></label>
                    <select class="aipower-select" name="wpaicg_custom_image_settings[lighting]" id="aipower-lighting">
                        <?php
                        foreach ($wpaicg_photo_data['lighting'] as $key => $value) {
                            $selected = (isset($wpaicg_custom_image_settings['lighting']) && $wpaicg_custom_image_settings['lighting'] == $value) || (!isset($wpaicg_custom_image_settings['lighting']) && $value == 'None') ? ' selected' : '';
                            echo '<option value="' . esc_attr($value) . '"' . $selected . '>' . esc_html($value) . '</option>';
                        }
                        ?>
                    </select>
                </div>

                <!-- Subject -->
                <div class="aipower-form-group">
                    <label for="aipower-subject"><?php echo esc_html__('Subject', 'gpt3-ai-content-generator'); ?></label>
                    <select class="aipower-select" name="wpaicg_custom_image_settings[subject]" id="aipower-subject">
                        <?php
                        foreach ($wpaicg_photo_data['subject'] as $key => $value) {
                            $selected = (isset($wpaicg_custom_image_settings['subject']) && $wpaicg_custom_image_settings['subject'] == $value) || (!isset($wpaicg_custom_image_settings['subject']) && $value == 'None') ? ' selected' : '';
                            echo '<option value="' . esc_attr($value) . '"' . $selected . '>' . esc_html($value) . '</option>';
                        }
                        ?>
                    </select>
                </div>

                <!-- Camera Settings -->
                <div class="aipower-form-group">
                    <label for="aipower-camera-settings"><?php echo esc_html__('Camera', 'gpt3-ai-content-generator'); ?></label>
                    <select class="aipower-select" name="wpaicg_custom_image_settings[camera_settings]" id="aipower-camera-settings">
                        <?php
                        foreach ($wpaicg_photo_data['camera_settings'] as $key => $value) {
                            $selected = (isset($wpaicg_custom_image_settings['camera_settings']) && $wpaicg_custom_image_settings['camera_settings'] == $value) || (!isset($wpaicg_custom_image_settings['camera_settings']) && $value == 'None') ? ' selected' : '';
                            echo '<option value="' . esc_attr($value) . '"' . $selected . '>' . esc_html($value) . '</option>';
                        }
                        ?>
                    </select>
                </div>

                <!-- Composition -->
                <div class="aipower-form-group">
                    <label for="aipower-composition"><?php echo esc_html__('Composition', 'gpt3-ai-content-generator'); ?></label>
                    <select class="aipower-select" name="wpaicg_custom_image_settings[composition]" id="aipower-composition">
                        <?php
                        foreach ($wpaicg_photo_data['composition'] as $key => $value) {
                            $selected = (isset($wpaicg_custom_image_settings['composition']) && $wpaicg_custom_image_settings['composition'] == $value) || (!isset($wpaicg_custom_image_settings['composition']) && $value == 'None') ? ' selected' : '';
                            echo '<option value="' . esc_attr($value) . '"' . $selected . '>' . esc_html($value) . '</option>';
                        }
                        ?>
                    </select>
                </div>

                <!-- Resolution -->
                <div class="aipower-form-group">
                    <label for="aipower-resolution"><?php echo esc_html__('Resolution', 'gpt3-ai-content-generator'); ?></label>
                    <select class="aipower-select" name="wpaicg_custom_image_settings[resolution]" id="aipower-resolution">
                        <?php
                        foreach ($wpaicg_photo_data['resolution'] as $key => $value) {
                            $selected = (isset($wpaicg_custom_image_settings['resolution']) && $wpaicg_custom_image_settings['resolution'] == $value) || (!isset($wpaicg_custom_image_settings['resolution']) && $value == 'None') ? ' selected' : '';
                            echo '<option value="' . esc_attr($value) . '"' . $selected . '>' . esc_html($value) . '</option>';
                        }
                        ?>
                    </select>
                </div>

                <!-- Color -->
                <div class="aipower-form-group">
                    <label for="aipower-color"><?php echo esc_html__('Color', 'gpt3-ai-content-generator'); ?></label>
                    <select class="aipower-select" name="wpaicg_custom_image_settings[color]" id="aipower-color">
                        <?php
                        foreach ($wpaicg_photo_data['color'] as $key => $value) {
                            $selected = (isset($wpaicg_custom_image_settings['color']) && $wpaicg_custom_image_settings['color'] == $value) || (!isset($wpaicg_custom_image_settings['color']) && $value == 'None') ? ' selected' : '';
                            echo '<option value="' . esc_attr($value) . '"' . $selected . '>' . esc_html($value) . '</option>';
                        }
                        ?>
                    </select>
                </div>

                <!-- Special Effects -->
                <div class="aipower-form-group">
                    <label for="aipower-special-effects"><?php echo esc_html__('Special Effects', 'gpt3-ai-content-generator'); ?></label>
                    <select class="aipower-select" name="wpaicg_custom_image_settings[special_effects]" id="aipower-special-effects">
                        <?php
                        foreach ($wpaicg_photo_data['special_effects'] as $key => $value) {
                            $selected = (isset($wpaicg_custom_image_settings['special_effects']) && $wpaicg_custom_image_settings['special_effects'] == $value) || (!isset($wpaicg_custom_image_settings['special_effects']) && $value == 'None') ? ' selected' : '';
                            echo '<option value="' . esc_attr($value) . '"' . $selected . '>' . esc_html($value) . '</option>';
                        }
                        ?>
                    </select>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Pexels Modal -->
<div id="aipower-pexels-modal" class="aipower-modal" style="display: none;">
    <div class="aipower-modal-content">
        <div class="aipower-modal-header">
            <h2><?php echo esc_html__('Pexels Settings', 'gpt3-ai-content-generator'); ?></h2>
            <span class="aipower-close">&times;</span>
        </div>
        <div class="aipower-modal-body">
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- Pexels API Key -->
                <div class="aipower-form-group aipower-api-key-group">
                    <label for="aipower-pexels-api-key">
                        <?php echo esc_html__('API Key', 'gpt3-ai-content-generator'); ?>
                        <a href="https://www.pexels.com/api/new/" target="_blank" class="aipower-get-api-link">
                            <?php echo esc_html__('Get Your Key', 'gpt3-ai-content-generator'); ?>
                        </a>
                    </label>
                    <input value="<?php echo esc_html($masked_pexels_api); ?>" type="text" name="wpaicg_pexels_api" id="aipower-pexels-api-key" data-full-api-key="<?php echo esc_attr($wpaicg_pexels_api); ?>">
                </div>

                <!-- Orientation Dropdown -->
                <div class="aipower-form-group">
                    <label for="aipower-pexels-orientation"><?php echo esc_html__('Orientation', 'gpt3-ai-content-generator'); ?></label>
                    <select id="aipower-pexels-orientation" name="wpaicg_pexels_orientation">
                        <option value=""><?php echo esc_html__('None', 'gpt3-ai-content-generator'); ?></option>
                        <option <?php selected($wpaicg_pexels_orientation, 'landscape'); ?> value="landscape"><?php echo esc_html__('Landscape', 'gpt3-ai-content-generator'); ?></option>
                        <option <?php selected($wpaicg_pexels_orientation, 'portrait'); ?> value="portrait"><?php echo esc_html__('Portrait', 'gpt3-ai-content-generator'); ?></option>
                        <option <?php selected($wpaicg_pexels_orientation, 'square'); ?> value="square"><?php echo esc_html__('Square', 'gpt3-ai-content-generator'); ?></option>
                    </select>
                </div>

                <!-- Size Dropdown -->
                <div class="aipower-form-group">
                    <label for="aipower-pexels-size"><?php echo esc_html__('Size', 'gpt3-ai-content-generator'); ?></label>
                    <select id="aipower-pexels-size" name="wpaicg_pexels_size">
                        <option value=""><?php echo esc_html__('None', 'gpt3-ai-content-generator'); ?></option>
                        <option <?php selected($wpaicg_pexels_size, 'large'); ?> value="large"><?php echo esc_html__('Large', 'gpt3-ai-content-generator'); ?></option>
                        <option <?php selected($wpaicg_pexels_size, 'medium'); ?> value="medium"><?php echo esc_html__('Medium', 'gpt3-ai-content-generator'); ?></option>
                        <option <?php selected($wpaicg_pexels_size, 'small'); ?> value="small"><?php echo esc_html__('Small', 'gpt3-ai-content-generator'); ?></option>
                    </select>
                </div>

                <!-- Use Keyword Checkbox -->
                <div class="aipower-form-group">
                    <label for="aipower-pexels-enable-prompt"><?php echo esc_html__('Use Keyword', 'gpt3-ai-content-generator'); ?></label>
                    <input type="checkbox" id="aipower-pexels-enable-prompt" name="wpaicg_pexels_enable_prompt" value="1" <?php checked(1, $wpaicg_pexels_enable_prompt); ?> />
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Replicate Modal -->
<div id="aipower-replicate-modal" class="aipower-modal" style="display: none;">
    <div class="aipower-modal-content">
        <div class="aipower-modal-header">
            <h2><?php echo esc_html__('Replicate Settings', 'gpt3-ai-content-generator'); ?></h2>
            <span class="aipower-close">&times;</span>
        </div>
        <div class="aipower-modal-body">
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- Replicate API Key -->
                <div class="aipower-form-group aipower-api-key-group">
                    <label for="aipower-replicate-api-key">
                        <?php echo esc_html__('API Key', 'gpt3-ai-content-generator'); ?>
                        <a href="https://replicate.com/account/api-tokens" target="_blank" class="aipower-get-api-link">
                            <?php echo esc_html__('Get Your Key', 'gpt3-ai-content-generator'); ?>
                        </a>
                    </label>
                    <input value="<?php echo esc_html($masked_replicate_api_key); ?>" type="text" name="wpaicg_sd_api_key" id="aipower-replicate-api-key" data-full-api-key="<?php echo esc_attr($wpaicg_sd_api_key); ?>">
                </div>

                <!-- Replicate Model Dropdown -->
                <div class="aipower-form-group aipower-model-group">
                    <label for="aipower-replicate-model"><?php echo esc_html__('Model', 'gpt3-ai-content-generator'); ?></label>
                    <div class="aipower-model-wrapper">
                        <select id="aipower-replicate-model" name="wpaicg_default_replicate_model">
                            <?php 
                            if (!empty($replicate_models)) {
                                foreach ($replicate_models as $owner => $models_group) {
                                    echo '<optgroup label="' . esc_html($owner) . '">';
                                    foreach ($models_group as $model) {
                                        $model_name = $model['name'];
                                        $model_version = isset($model['latest_version']) ? $model['latest_version'] : '';
                                        $selected = ($model_name === $wpaicg_default_replicate_model) ? 'selected' : '';
                                        echo '<option value="' . esc_attr($model_name) . '" data-version="' . esc_attr($model_version) . '" ' . esc_attr($selected) . '>';
                                        echo esc_html($model_name . ' (' . $model['run_count'] . ' runs)');
                                        echo '</option>';
                                    }
                                    echo '</optgroup>';
                                }
                            }
                            ?>
                        </select>
                        <span id="syncReplicateModelsButton" class="aipower-settings-icon aipower_sync_replicate_models" title="<?php echo esc_attr__('Sync Replicate Models', 'gpt3-ai-content-generator'); ?>">
                            <span class="dashicons dashicons-update"></span>
                        </span>
                    </div>
                </div>

                <!-- Replicate Version -->
                <div class="aipower-form-group">
                    <label for="aipower-replicate-version"><?php echo esc_html__('Version', 'gpt3-ai-content-generator'); ?></label>
                    <input value="<?php echo esc_html($wpaicg_sd_api_version); ?>" type="text" name="wpaicg_sd_api_version" id="aipower-replicate-version">
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Pixabay Modal -->
<div id="aipower-pixabay-modal" class="aipower-modal" style="display: none;">
    <div class="aipower-modal-content">
        <div class="aipower-modal-header">
            <h2><?php echo esc_html__('Pixabay Settings', 'gpt3-ai-content-generator'); ?></h2>
            <span class="aipower-close">&times;</span>
        </div>
        <div class="aipower-modal-body">
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- Pixabay API Key -->
                <div class="aipower-form-group aipower-api-key-group">
                    <label for="aipower-pixabay-api-key">
                        <?php echo esc_html__('API Key', 'gpt3-ai-content-generator'); ?>
                        <a href="https://pixabay.com/api/docs/" target="_blank" class="aipower-get-api-link">
                            <?php echo esc_html__('Get Your Key', 'gpt3-ai-content-generator'); ?>
                        </a>
                    </label>
                    <input value="<?php echo esc_html($masked_pixabay_api); ?>" type="text" name="wpaicg_pixabay_api" id="aipower-pixabay-api-key" data-full-api-key="<?php echo esc_attr($wpaicg_pixabay_api); ?>">
                </div>

                <!-- Pixabay Language Dropdown -->
                <div class="aipower-form-group">
                    <label for="aipower-pixabay-language"><?php echo esc_html__('Language', 'gpt3-ai-content-generator'); ?></label>
                    <select id="aipower-pixabay-language" name="wpaicg_pixabay_language">
                        <?php foreach (\WPAICG\WPAICG_Generator::get_instance()->pixabay_languages as $key => $pixabay_language): ?>
                            <option value="<?php echo esc_attr($key); ?>" <?php selected($wpaicg_pixabay_language, $key); ?>>
                                <?php echo esc_html($pixabay_language); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <!-- Pixabay Type Dropdown -->
                <div class="aipower-form-group">
                    <label for="aipower-pixabay-type"><?php echo esc_html__('Type', 'gpt3-ai-content-generator'); ?></label>
                    <select id="aipower-pixabay-type" name="wpaicg_pixabay_type">
                        <option value="all" <?php selected($wpaicg_pixabay_type, 'all'); ?>><?php echo esc_html__('All', 'gpt3-ai-content-generator'); ?></option>
                        <option value="photo" <?php selected($wpaicg_pixabay_type, 'photo'); ?>><?php echo esc_html__('Photo', 'gpt3-ai-content-generator'); ?></option>
                        <option value="illustration" <?php selected($wpaicg_pixabay_type, 'illustration'); ?>><?php echo esc_html__('Illustration', 'gpt3-ai-content-generator'); ?></option>
                        <option value="vector" <?php selected($wpaicg_pixabay_type, 'vector'); ?>><?php echo esc_html__('Vector', 'gpt3-ai-content-generator'); ?></option>
                    </select>
                </div>

                <!-- Pixabay Orientation Dropdown -->
                <div class="aipower-form-group">
                    <label for="aipower-pixabay-orientation"><?php echo esc_html__('Orientation', 'gpt3-ai-content-generator'); ?></label>
                    <select id="aipower-pixabay-orientation" name="wpaicg_pixabay_orientation">
                        <option value="all" <?php selected($wpaicg_pixabay_orientation, 'all'); ?>><?php echo esc_html__('All', 'gpt3-ai-content-generator'); ?></option>
                        <option value="horizontal" <?php selected($wpaicg_pixabay_orientation, 'horizontal'); ?>><?php echo esc_html__('Horizontal', 'gpt3-ai-content-generator'); ?></option>
                        <option value="vertical" <?php selected($wpaicg_pixabay_orientation, 'vertical'); ?>><?php echo esc_html__('Vertical', 'gpt3-ai-content-generator'); ?></option>
                    </select>
                </div>

                <!-- Pixabay Order Dropdown -->
                <div class="aipower-form-group">
                    <label for="aipower-pixabay-order"><?php echo esc_html__('Order', 'gpt3-ai-content-generator'); ?></label>
                    <select id="aipower-pixabay-order" name="wpaicg_pixabay_order">
                        <option value="popular" <?php selected($wpaicg_pixabay_order, 'popular'); ?>><?php echo esc_html__('Popular', 'gpt3-ai-content-generator'); ?></option>
                        <option value="latest" <?php selected($wpaicg_pixabay_order, 'latest'); ?>><?php echo esc_html__('Latest', 'gpt3-ai-content-generator'); ?></option>
                    </select>
                </div>

                <!-- Pixabay Use Keyword Checkbox -->
                <div class="aipower-form-group">
                    <label for="aipower-pixabay-enable-prompt"><?php echo esc_html__('Use Keyword', 'gpt3-ai-content-generator'); ?></label>
                    <input type="checkbox" id="aipower-pixabay-enable-prompt" name="wpaicg_pixabay_enable_prompt" value="1" <?php checked(1, $wpaicg_pixabay_enable_prompt); ?> />
                </div>
            </div>
        </div>
    </div>
</div>