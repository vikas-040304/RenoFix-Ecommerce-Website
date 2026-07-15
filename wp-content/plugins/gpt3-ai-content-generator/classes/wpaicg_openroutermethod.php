<?php
namespace WPAICG;
if ( ! defined( 'ABSPATH' ) ) exit;
if(!class_exists('\\WPAICG\\WPAICG_OpenRouterMethod')) {
    class WPAICG_OpenRouterMethod
    {
        private static  $instance = null ;

        public static function get_instance()
        {
            if ( is_null( self::$instance ) ) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        public function __construct()
        {
            add_action('wp_ajax_aipower_sync_openrouter_models', array($this, 'aipower_fetch_openrouter_models'));
            add_action('wp_ajax_wpaicg_check_openrouter_limits', array($this, 'wpaicg_check_openrouter_limits'));
        }

        function wpaicg_check_openrouter_limits() {
            check_ajax_referer('wpaicg_check_openrouter_limits', 'nonce');
            
            $api_key = get_option('wpaicg_openrouter_api_key'); 
            if (!$api_key) {
                wp_send_json_error('API key not set.');
            }
        
            $response = wp_remote_get('https://openrouter.ai/api/v1/auth/key', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $api_key,
                ]
            ]);
        
            if (is_wp_error($response)) {
                wp_send_json_error($response->get_error_message());
            }
        
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);
        
            // Check for error in the response body
            if (isset($data['error'])) {
                $error_message = isset($data['error']['message']) ? $data['error']['message'] : 'Unknown error occurred.';
                wp_send_json_error($error_message . ' (Code: ' . $data['error']['code'] . ')');
            } elseif (isset($data['data'])) {
                wp_send_json_success($data['data']);
            } else {
                wp_send_json_error('Unable to retrieve limits.');
            }
        }

        public function aipower_fetch_openrouter_models() {
            if (!isset($_POST['_wpnonce']) || !wp_verify_nonce($_POST['_wpnonce'], 'wpaicg_save_ai_engine_nonce')) {
                wp_send_json_error(array('message' => esc_html__('Nonce verification failed', 'gpt3-ai-content-generator')));
                return;
            }
        
            $response = wp_remote_request('https://openrouter.ai/api/v1/models');
        
            if (is_wp_error($response)) {
                wp_send_json_error('Failed to fetch models from OpenRouter');
                return; // Stop execution if the request failed
            }
        
            $models = json_decode(wp_remote_retrieve_body($response), true);
            if (is_null($models) || !isset($models['data'])) {
                wp_send_json_error('Invalid response from OpenRouter');
                return; // Stop execution if the response is invalid
            }
        
            // Remove the description field from each model
            $filtered_models = array_map(function($model) {
                unset($model['description']);
                return $model;
            }, $models['data']);

            // if wpaicg_openrouter_default_model is empty or not exist, set anthropic/claude-3.5-sonnet as default model
            if (get_option('wpaicg_openrouter_default_model', '') === '') {
                update_option('wpaicg_openrouter_default_model', 'anthropic/claude-3.5-sonnet');
            }
        
            // Retrieve the current default model
            $default_model = get_option('wpaicg_openrouter_default_model', 'anthropic/claude-3.5-sonnet');
        
            // Attempt to update the option with new models excluding the description field
            $update_result = update_option('wpaicg_openrouter_model_list', $filtered_models);
        
            if ($update_result) {
                // Group models by provider for the dropdown
                $grouped_models = [];
                foreach ($filtered_models as $model) {
                    $provider = explode('/', $model['id'])[0]; // Extract provider name from ID
                    if (!isset($grouped_models[$provider])) {
                        $grouped_models[$provider] = [];
                    }
                    $grouped_models[$provider][] = $model;
                }
        
                // Sort providers alphabetically
                ksort($grouped_models);
        
                // Return success with the grouped models and the default model for the frontend
                wp_send_json_success([
                    'models' => $grouped_models,
                    'default_model' => $default_model
                ]);
            } else {
                // If the update failed, try removing non-alphanumeric characters (except some common characters) and try again
                function remove_non_alphanumeric_except_common($text) {
                    return preg_replace('/[^a-zA-Z0-9:\/\-\(\)\. ]/', '', $text);
                }
        
                // Remove non-alphanumeric characters from relevant fields
                $filtered_models = array_map(function($model) {
                    $model['id'] = remove_non_alphanumeric_except_common($model['id']);
                    $model['name'] = remove_non_alphanumeric_except_common($model['name']);
                    return $model;
                }, $filtered_models);
        
                // Attempt to update the option again
                $update_result = update_option('wpaicg_openrouter_model_list', $filtered_models);
        
                if ($update_result) {
                    // Group models by provider again
                    $grouped_models = [];
                    foreach ($filtered_models as $model) {
                        $provider = explode('/', $model['id'])[0];
                        if (!isset($grouped_models[$provider])) {
                            $grouped_models[$provider] = [];
                        }
                        $grouped_models[$provider][] = $model;
                    }
        
                    ksort($grouped_models);
        
                    wp_send_json_success([
                        'models' => $grouped_models,
                        'default_model' => $default_model
                    ]);
                } else {
                    wp_send_json_error('Failed to update model list in the database');
                }
            }
        }
    }

    WPAICG_OpenRouterMethod::get_instance();
}
