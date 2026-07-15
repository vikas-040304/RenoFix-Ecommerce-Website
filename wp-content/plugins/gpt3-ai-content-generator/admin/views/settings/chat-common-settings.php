<?php
if (!defined('ABSPATH')) exit; // Exit if accessed directly.

$current_google_api_key = get_option('wpaicg_google_api_key', '');
$current_elevenlabs_api_key = get_option('wpaicg_elevenlabs_api', '');
$current_elevenlabs_hide_api_errors = get_option('wpaicg_elevenlabs_hide_error', false);
$current_google_search_engine_id = get_option('wpaicg_google_search_engine_id', '');
$current_google_search_country = get_option('wpaicg_google_search_country', '');
$cse_countries = \WPAICG\WPAICG_Util::get_instance()->wpaicg_countries;
$current_google_search_language = get_option('wpaicg_google_search_language', '');
$cse_languages = \WPAICG\WPAICG_Util::get_instance()->search_languages;
$current_google_search_num = get_option('wpaicg_google_search_num', 10); // Default to 10
$current_banned_words = get_option('wpaicg_banned_words', '');
$current_banned_ips = get_option('wpaicg_banned_ips', '');
$current_user_uploads = get_option('wpaicg_user_uploads', 'filesystem');
$current_img_processing_method = get_option('wpaicg_img_processing_method', 'url');
$current_img_vision_quality = get_option('wpaicg_img_vision_quality', 'auto');
$current_delete_image = get_option('wpaicg_delete_image', 0);
$current_chat_token_purchase = get_option('wpaicg_chat_enable_sale', false);
$current_typewriter_effect = get_option('wpaicg_typewriter_effect', false);
$current_typewriter_speed = get_option('wpaicg_typewriter_speed', 1);
$current_dont_load_past_chats = get_option('wpaicg_autoload_chat_conversations', 0)
?>

<!--Common Chat Settings -->
<div class="aipower-category-container common-settings-container">
    <h3><?php echo esc_html__('Chat Settings', 'gpt3-ai-content-generator'); ?></h3>
    <div id="aipower-common-settings" class="aipower-common-settings">

        <!-- Conversations -->
        <div class="aipower-form-group">
            <label for="aipower-conversations-selection"><?php echo esc_html__('Conversations', 'gpt3-ai-content-generator'); ?></label>
            <button type="button" class="aipower-settings-icon" id="aipower_conversations_settings_icon" title="<?php echo esc_attr__('Conversations', 'gpt3-ai-content-generator'); ?>">
                <span class="dashicons dashicons-admin-generic"></span>
            </button>
        </div>
        <!-- Text to Speech -->
        <div class="aipower-form-group">
            <label for="aipower-text-to-speech-selection"><?php echo esc_html__('Text to Speech', 'gpt3-ai-content-generator'); ?></label>
            <button type="button" class="aipower-settings-icon" id="aipower_text_to_speech_settings_icon" title="<?php echo esc_attr__('Text to Speech', 'gpt3-ai-content-generator'); ?>">
                <span class="dashicons dashicons-admin-generic"></span>
            </button>
        </div>

        <!-- Internet Browsing -->
        <div class="aipower-form-group">
            <label for="aipower-internet-browsing-selection"><?php echo esc_html__('Internet Browsing', 'gpt3-ai-content-generator'); ?></label>
            <button type="button" class="aipower-settings-icon" id="aipower_common_internet_settings_icon" title="<?php echo esc_attr__('Internet Browsing', 'gpt3-ai-content-generator'); ?>">
                <span class="dashicons dashicons-admin-generic"></span>
            </button>
        </div>

        <!-- Security Settings -->
        <div class="aipower-form-group">
            <label for="aipower-bot-security-selection"><?php echo esc_html__('Security', 'gpt3-ai-content-generator'); ?></label>
            <button type="button" class="aipower-settings-icon" id="aipower_chat_security_settings_icon" title="<?php echo esc_attr__('Security', 'gpt3-ai-content-generator'); ?>">
                <span class="dashicons dashicons-admin-generic"></span>
            </button>
        </div>

        <!-- Image Settings -->
        <div class="aipower-form-group">
            <label for="aipower-image-upload-selection"><?php echo esc_html__('Images', 'gpt3-ai-content-generator'); ?></label>
            <button type="button" class="aipower-settings-icon" id="aipower_chat_image_settings_icon" title="<?php echo esc_attr__('Images', 'gpt3-ai-content-generator'); ?>">
                <span class="dashicons dashicons-admin-generic"></span>
            </button>
        </div>
    </div>
</div>
<!-- Hidden nonce field for AJAX security -->
<input type="hidden" id="ai-engine-nonce" value="<?php echo wp_create_nonce('wpaicg_save_ai_engine_nonce'); ?>" />
<!-- Text to Speech Modal -->
<div class="aipower-modal" id="aipower_text_to_speech_modal" style="display: none;">
    <div class="aipower-modal-content">
        <div class="aipower-modal-header">
            <h2><?php echo esc_html__('Text to Speech', 'gpt3-ai-content-generator'); ?></h2>
            <span class="aipower-close">&times;</span>
        </div>
        <div class="aipower-modal-body">
            <h3><?php echo esc_html__('Google Settings', 'gpt3-ai-content-generator'); ?></h3>
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- Google API Key -->
                <div class="aipower-form-group">
                    <p><?php echo esc_html__('To use Google Text to Speech, you need to provide a Google API Key. This api key is used both for Text to Speech and Internet Browsing feature.', 'gpt3-ai-content-generator'); ?></p>
                    <label for="aipower_google_common_api_key"><?php echo esc_html__('Google API Key', 'gpt3-ai-content-generator'); ?></label>
                    <input type="text" id="aipower_google_common_api_key" style="width:80%;" name="aipower_google_common_api_key" value="<?php echo esc_attr($current_google_api_key); ?>">
                    <a href="https://console.cloud.google.com/" target="_blank"><?php echo esc_html__('Get API Key', 'gpt3-ai-content-generator'); ?></a>
                </div>
            </div>
            <div class="aipower-form-group aipower-grouped-fields">
            <!-- Sync Google Voices Button -->
                <div class="aipower-form-group">
                    <button type="button" class="aipower-sync-google-voices-button" id="aipower_sync_google_voices_button" title="<?php echo esc_attr__('Sync Google Voices', 'gpt3-ai-content-generator'); ?>">
                        <span class="dashicons dashicons-update"></span> <?php echo esc_html__('Sync Google Voices', 'gpt3-ai-content-generator'); ?>
                    </button>
                </div>
            </div>
            <h3><?php echo esc_html__('ElevenLabs Settings', 'gpt3-ai-content-generator'); ?></h3>
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- ElevenLabs API Key -->
                <div class="aipower-form-group">
                    <p><?php echo esc_html__('To use ElevenLabs Text to Speech, you need to provide an ElevenLabs API Key.', 'gpt3-ai-content-generator'); ?></p>
                    <label for="aipower_elevenlabs_api_key"><?php echo esc_html__('ElevenLabs API Key', 'gpt3-ai-content-generator'); ?></label>
                    <input type="text" id="aipower_elevenlabs_api_key"  style="width:80%;" name="aipower_elevenlabs_api_key" value="<?php echo esc_attr($current_elevenlabs_api_key); ?>">
                    <a href="https://elevenlabs.io/" target="_blank"><?php echo esc_html__('Get API Key', 'gpt3-ai-content-generator'); ?></a>
                </div>
            </div>
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- Sync Voices Button -->
                <div class="aipower-form-group">
                    <button type="button" class="aipower-sync-voices-button" id="aipower_sync_voices_button" title="<?php echo esc_attr__('Sync ElevenLabs Voices', 'gpt3-ai-content-generator'); ?>">
                        <span class="dashicons dashicons-update"></span> <?php echo esc_html__('Sync ElevenLabs Voices', 'gpt3-ai-content-generator'); ?>
                    </button>
                </div>
                <!-- Sync Models Button -->
                <div class="aipower-form-group">
                    <button type="button" class="aipower-sync-models-button" id="aipower_sync_models_button" title="<?php echo esc_attr__('Sync ElevenLabs Models', 'gpt3-ai-content-generator'); ?>">
                        <span class="dashicons dashicons-update"></span> <?php echo esc_html__('Sync Models', 'gpt3-ai-content-generator'); ?>
                    </button>
                </div>
                <!-- Hide ElevenLabs API Errors in Chat -->
                <div class="aipower-form-group">
                    <label for="aipower_elevenlabs_hide_error"><?php echo esc_html__('Hide API Errors in Chat', 'gpt3-ai-content-generator'); ?></label>
                    <input type="checkbox" id="aipower_elevenlabs_hide_error" name="aipower_elevenlabs_hide_error" value="1" <?php checked(1, $current_elevenlabs_hide_api_errors); ?>>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Common Internet Browsing Modal -->
<div class="aipower-modal" id="aipower_common_internet_settings_modal" style="display: none;">
    <div class="aipower-modal-content">
        <div class="aipower-modal-header">
            <h2><?php echo esc_html__('Internet Browsing', 'gpt3-ai-content-generator'); ?></h2>
            <span class="aipower-close">&times;</span>
        </div>
        <div class="aipower-modal-body">
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- Google API Key -->
                <div class="aipower-form-group">
                    <p><?php echo esc_html__('To use Google Text to Speech, you need to provide a Google API Key. This api key is used both for Text to Speech and Internet Browsing feature.', 'gpt3-ai-content-generator'); ?></p>
                    <label for="aipower_google_common_api_key_for_internet"><?php echo esc_html__('Google API Key', 'gpt3-ai-content-generator'); ?></label>
                    <input type="text" id="aipower_google_common_api_key_for_internet" style="width:60%;" name="aipower_google_common_api_key_for_internet" value="<?php echo esc_attr($current_google_api_key); ?>">
                    <a href="https://console.cloud.google.com/" target="_blank"><?php echo esc_html__('Get API Key', 'gpt3-ai-content-generator'); ?></a>
                </div>
            </div>
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- Google Custom Search Engine ID -->
                <div class="aipower-form-group">
                    <p><?php echo esc_html__('To use Internet Browsing, you need to provide a Google Custom Search Engine ID.', 'gpt3-ai-content-generator'); ?></p>
                    <label for="aipower_google_custom_search_engine_id"><?php echo esc_html__('Google Custom Search Engine ID', 'gpt3-ai-content-generator'); ?></label>
                    <input type="text" id="aipower_google_custom_search_engine_id" style="width:60%;" name="aipower_google_custom_search_engine_id" value="<?php echo esc_attr($current_google_search_engine_id); ?>">
                    <a href="https://programmablesearchengine.google.com/" target="_blank"><?php echo esc_html__('Get Custom Search Engine ID', 'gpt3-ai-content-generator'); ?></a>
                </div>
            </div>
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- Region -->
                <div class="aipower-form-group">
                    <label for="aipower_google_cse_region"><?php echo esc_html__('Region', 'gpt3-ai-content-generator'); ?></label>
                    <select name="aipower_google_cse_region" id="aipower_google_cse_region">
                        <?php foreach ($cse_countries as $value => $label): ?>
                            <option value="<?php echo esc_attr($value); ?>" <?php selected($current_google_search_country, $value); ?>>
                                <?php echo esc_html($label); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <!-- Language -->
                <div class="aipower-form-group">
                    <label for="aipower_google_cse_language"><?php echo esc_html__('Language', 'gpt3-ai-content-generator'); ?></label>
                    <select name="aipower_google_cse_language" id="aipower_google_cse_language">
                        <?php foreach ($cse_languages as $value => $label): ?>
                            <option value="<?php echo esc_attr($value); ?>" <?php selected($current_google_search_language, $value); ?>>
                                <?php echo esc_html($label); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <!-- Search Results -->
                <div class="aipower-form-group">
                    <label for="aipower_google_cse_results"><?php echo esc_html__('Results', 'gpt3-ai-content-generator'); ?></label>
                    <select name="aipower_google_cse_results" id="aipower_google_cse_results">
                        <?php for ($i = 1; $i <= 10; $i++): ?>
                            <option value="<?php echo $i; ?>" <?php selected($current_google_search_num, $i); ?>>
                                <?php echo $i; ?>
                            </option>
                        <?php endfor; ?>
                    </select>
                </div>
            </div>
        </div>
    </div>
</div>
<!--Security Modal -->
<div class="aipower-modal" id="aipower_chat_security_modal" style="display: none;">
    <div class="aipower-modal-content">
        <div class="aipower-modal-header">
            <h2><?php echo esc_html__('Security', 'gpt3-ai-content-generator'); ?></h2>
            <span class="aipower-close">&times;</span>
        </div>
        <div class="aipower-modal-body">
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- Banned Words -->
                <div class="aipower-form-group">
                    <p><?php echo esc_html__('You can add banned words that will be filtered out from the chat. Enter words separated by commas.', 'gpt3-ai-content-generator'); ?></p>
                    <label for="aipower_chat_banned_words"><?php echo esc_html__('Banned Words', 'gpt3-ai-content-generator'); ?></label>
                    <input type="text" id="aipower_chat_banned_words" placeholder="<?php echo esc_attr__('e.g., badword1, badword2', 'gpt3-ai-content-generator'); ?>" name="aipower_chat_banned_words" value="<?php echo esc_attr($current_banned_words); ?>">
                </div>
            </div>
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- Banned IP Addresses -->
                <div class="aipower-form-group">
                    <p><?php echo esc_html__('You can add banned IP addresses that will be blocked from accessing the chat. Enter IP addresses separated by commas.', 'gpt3-ai-content-generator'); ?></p>
                    <label for="aipower_chat_banned_ips"><?php echo esc_html__('Banned IP Addresses', 'gpt3-ai-content-generator'); ?></label>
                    <input type="text" id="aipower_chat_banned_ips" placeholder="<?php echo esc_attr__('e.g., 123.456.789.0, 987.654.321.0', 'gpt3-ai-content-generator'); ?>" name="aipower_chat_banned_ips" value="<?php echo esc_attr($current_banned_ips); ?>">
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Chat Image Modal -->
<div class="aipower-modal" id="aipower_chat_image_modal" style="display: none;">
    <div class="aipower-modal-content">
        <div class="aipower-modal-header">
            <h2><?php echo esc_html__('Image Settings', 'gpt3-ai-content-generator'); ?></h2>
            <span class="aipower-close">&times;</span>
        </div>
        <div class="aipower-modal-body">
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- User Uploads -->
                <div class="aipower-form-group">
                    <label for="aipower_chat_image_user_uploads"><?php echo esc_html__('User Uploads', 'gpt3-ai-content-generator'); ?></label>
                    <select name="aipower_chat_image_user_uploads" id="aipower_chat_image_user_uploads">
                        <option value="filesystem" <?php selected($current_user_uploads, 'filesystem'); ?>><?php echo esc_html__('Filesystem', 'gpt3-ai-content-generator'); ?></option>
                        <option value="media_library" <?php selected($current_user_uploads, 'media_library'); ?>><?php echo esc_html__('Media Library', 'gpt3-ai-content-generator'); ?></option>
                    </select>
                </div>
                <!-- Method -->
                <div class="aipower-form-group">
                    <label for="aipower_chat_image_method"><?php echo esc_html__('Processing Method', 'gpt3-ai-content-generator'); ?></label>
                    <select name="aipower_chat_image_method" id="aipower_chat_image_method">
                        <option value="base64" <?php selected($current_img_processing_method, 'base64'); ?>><?php echo esc_html__('Base64', 'gpt3-ai-content-generator'); ?></option>
                        <option value="url" <?php selected($current_img_processing_method, 'url'); ?>><?php echo esc_html__('URL', 'gpt3-ai-content-generator'); ?></option>
                    </select>
                </div>
            </div>
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- Quality -->
                <div class="aipower-form-group">
                    <label for="aipower_chat_image_quality"><?php echo esc_html__('Quality', 'gpt3-ai-content-generator'); ?></label>
                    <select name="aipower_chat_image_quality" id="aipower_chat_image_quality">
                        <option value="auto" <?php selected($current_img_vision_quality, 'auto'); ?>><?php echo esc_html__('Auto', 'gpt3-ai-content-generator'); ?></option>
                        <option value="low" <?php selected($current_img_vision_quality, 'low'); ?>><?php echo esc_html__('Low', 'gpt3-ai-content-generator'); ?></option>
                        <option value="high" <?php selected($current_img_vision_quality, 'high'); ?>><?php echo esc_html__('High', 'gpt3-ai-content-generator'); ?></option>
                    </select>
                </div>
                <!-- Delete Images After Processing -->
                <div class="aipower-form-group">
                    <label for="aipower-delete-images-after-process"><?php echo esc_html__('Delete Images After Processing', 'gpt3-ai-content-generator'); ?></label>
                    <input type="checkbox" id="aipower-delete-images-after-process" name="aipower-delete-images-after-process" value="1" <?php checked($current_delete_image, 1); ?>>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Chat Conversations Modal -->
<div class="aipower-modal" id="aipower_chat_conversations_modal" style="display: none;">
    <div class="aipower-modal-content" style="width: 20%;">
        <div class="aipower-modal-header">
            <h2><?php echo esc_html__('Conversations Settings', 'gpt3-ai-content-generator'); ?></h2>
            <span class="aipower-close">&times;</span>
        </div>
        <div class="aipower-modal-body">
            <div class="aipower-form-group aipower-grouped-fields">
                <!-- Dont Load Past Chats -->
                <div class="aipower-form-group">
                    <label for="aipower_chat_dont_load_past_chats"><?php echo esc_html__('Don\'t Load Past Chats', 'gpt3-ai-content-generator'); ?></label>
                    <input type="checkbox" id="aipower_chat_dont_load_past_chats" name="aipower_chat_dont_load_past_chats" value="1" <?php checked(1, $current_dont_load_past_chats); ?>>
                </div>
                <!-- Token Purchase -->
                <div class="aipower-form-group">
                    <label for="aipower_enable_token_purchase"><?php echo esc_html__('Enable Token Purchase', 'gpt3-ai-content-generator'); ?></label>
                    <input type="checkbox" id="aipower_enable_token_purchase" name="aipower_enable_token_purchase" value="1" <?php checked(1, $current_chat_token_purchase); ?>>
                </div>
                <!-- TypeWriter Effect -->
                <div class="aipower-form-group">
                    <label for="aipower_chat_typewriter_effect"><?php echo esc_html__('Enable Typewriter Effect', 'gpt3-ai-content-generator'); ?></label>
                    <input type="checkbox" id="aipower_chat_typewriter_effect" name="aipower_chat_typewriter_effect" value="1" <?php checked(1, $current_typewriter_effect); ?>>
                </div>
                <!-- TypeWriter Speed -->
                <div class="aipower-form-group">
                    <label for="aipower_chat_typewriter_speed"><?php echo esc_html__('Typewriter Speed', 'gpt3-ai-content-generator'); ?></label>
                    <select name="aipower_chat_typewriter_speed" id="aipower_chat_typewriter_speed">
                        <?php for ($i = 1; $i <= 10; $i++): ?>
                            <option value="<?php echo $i; ?>" <?php selected($current_typewriter_speed, $i); ?>>
                                <?php echo $i; ?>
                            </option>
                        <?php endfor; ?>
                    </select>
                </div>
            </div>
        </div>
    </div>
</div>