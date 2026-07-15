<?php
if (!defined('ABSPATH')) exit; // Exit if accessed directly.
?>

<div class="aipower-form-group aipower-grouped-fields-bot">
    <div class="aipower-form-group">
        <div class="aipower-switch-container">
            <label class="aipower-switch-label" for="aipower-fullscreen"><?php echo esc_html__('Fullscreen', 'gpt3-ai-content-generator'); ?></label>
            <label class="aipower-switch">
                <input type="checkbox" id="aipower-fullscreen" name="aipower-fullscreen">
                <span class="aipower-slider"></span>
            </label>
        </div>
    </div>
    <div class="aipower-form-group">
        <div class="aipower-switch-container">
            <label class="aipower-switch-label" for="aipower-download"><?php echo esc_html__('Download', 'gpt3-ai-content-generator'); ?></label>
            <label class="aipower-switch">
                <input type="checkbox" id="aipower-download" name="aipower-download">
                <span class="aipower-slider"></span>
            </label>
        </div>
    </div>
    <div class="aipower-form-group">
        <div class="aipower-switch-container">
            <label class="aipower-switch-label" for="aipower-clear"><?php echo esc_html__('Clear', 'gpt3-ai-content-generator'); ?></label>
            <label class="aipower-switch">
                <input type="checkbox" id="aipower-clear" name="aipower-clear">
                <span class="aipower-slider"></span>
            </label>
        </div>
    </div>
    <div class="aipower-form-group">
        <div class="aipower-switch-container">
            <label class="aipower-switch-label" for="aipower-copy"><?php echo esc_html__('Copy', 'gpt3-ai-content-generator'); ?></label>
            <label class="aipower-switch">
                <input type="checkbox" id="aipower-copy" name="aipower-copy">
                <span class="aipower-slider"></span>
            </label>
        </div>
    </div>
    <div class="aipower-form-group">
        <div class="aipower-switch-container">
            <label class="aipower-switch-label" for="aipower-close-button"><?php echo esc_html__('Close', 'gpt3-ai-content-generator'); ?></label>
            <label class="aipower-switch">
                <input type="checkbox" id="aipower-close-button" name="aipower-close-button">
                <span class="aipower-slider"></span>
            </label>
        </div>
    </div>
</div>

<div class="aipower-form-group aipower-grouped-fields-bot">
    <div class="aipower-form-group">
        <label for="aipower-ai-name"><?php echo esc_html__('AI Name', 'gpt3-ai-content-generator'); ?></label>
        <input type="text" id="aipower-ai-name" name="aipower-ai-name"/>
    </div>
    <div class="aipower-form-group">
        <label for="aipower-user-name"><?php echo esc_html__('User Name', 'gpt3-ai-content-generator'); ?></label>
        <input type="text" id="aipower-user-name" name="aipower-user-name"/>
    </div>
</div>
<div class="aipower-form-group aipower-grouped-fields-bot">
    <div class="aipower-form-group">
        <label for="aipower-welcome-message"><?php echo esc_html__('Welcome Message', 'gpt3-ai-content-generator'); ?></label>
        <input type="text" id="aipower-welcome-message" name="aipower-welcome-message"/>
    </div>
</div>
<div class="aipower-form-group aipower-grouped-fields-bot">
    <div class="aipower-form-group">
        <label for="aipower-response-wait-message"><?php echo esc_html__('Response Wait Message', 'gpt3-ai-content-generator'); ?></label>
        <input type="text" id="aipower-response-wait-message" name="aipower-response-wait-message"/>
    </div>
    <div class="aipower-form-group">
        <label for="aipower-placeholder-message"><?php echo esc_html__('Placeholder', 'gpt3-ai-content-generator'); ?></label>
        <input type="text" id="aipower-placeholder-message" name="aipower-placeholder-message"/>
    </div>
</div>
<div class="aipower-form-group aipower-grouped-fields-bot">
    <div class="aipower-form-group">
        <label for="aipower-footer-note"><?php echo esc_html__('Footer Note', 'gpt3-ai-content-generator'); ?></label>
        <input type="text" id="aipower-footer-note" name="aipower-footer-note"/>
    </div>
</div>
<div class="aipower-form-group aipower-grouped-fields-bot">
    <!-- AI Avatar Selection -->
    <div class="aipower-form-group">
        <label for="aipower-widget-avatar-selection"><?php echo esc_html__('Use Avatar', 'gpt3-ai-content-generator'); ?></label>
        <div class="aipower-radio-group">
            <label for="aipower-use-avatar-no">
                <input type="radio" id="aipower-use-avatar-no" name="use_avatar" value="0" checked />
                <?php echo esc_html__('No', 'gpt3-ai-content-generator'); ?>
            </label>
            <label for="aipower-use-avatar-yes">
                <input type="radio" id="aipower-use-avatar-yes" name="use_avatar" value="1" />
                <?php echo esc_html__('Yes', 'gpt3-ai-content-generator'); ?>
            </label>
        </div>
    </div>
    <!-- Custom AI Avatar Upload -->
    <div class="aipower-form-group" style="display: none;" id="aipower-avatar-upload-group">
        <label for="aipower-avatar-upload"><?php echo esc_html__('AI Avatar', 'gpt3-ai-content-generator'); ?></label>
        <button type="button" class="button" id="aipower-avatar-upload-button"><?php echo esc_html__('Upload Avatar', 'gpt3-ai-content-generator'); ?></button>
        <input type="hidden" id="aipower-ai-avatar-id" name="ai_avatar_id" value="">
        <div id="aipower-avatar-preview" style="margin-top:10px;">
            <!-- Thumbnail will be displayed here when editing a custom avatar -->
        </div>
    </div>
    <!-- AI Icon Selection -->
    <div class="aipower-form-group">
        <label for="aipower-widget-icon-selection"><?php echo esc_html__('Widget Icon', 'gpt3-ai-content-generator'); ?></label>
        <div class="aipower-radio-group">
            <label for="aipower-ai-icon-default">
                <input type="radio" id="aipower-ai-icon-default" name="icon" value="default" checked />
                <?php echo esc_html__('Default', 'gpt3-ai-content-generator'); ?>
            </label>
            <label for="aipower-ai-icon-custom">
                <input type="radio" id="aipower-ai-icon-custom" name="icon" value="custom" />
                <?php echo esc_html__('Custom', 'gpt3-ai-content-generator'); ?>
            </label>
        </div>
    </div>
    <!-- Custom AI Icon Upload -->
    <div class="aipower-form-group">
        <label for="aipower-icon-upload"><?php echo esc_html__('Icon', 'gpt3-ai-content-generator'); ?></label>
        <button type="button" class="button" id="aipower-icon-upload-button"><?php echo esc_html__('Upload Icon', 'gpt3-ai-content-generator'); ?></button>
        <input type="hidden" id="aipower-icon-url" name="aipower-icon-url" value="">
        <div id="aipower-icon-preview" style="margin-top:10px;">
            <!-- Thumbnail will be displayed here when editing a custom icon -->
        </div>
    </div>
</div>