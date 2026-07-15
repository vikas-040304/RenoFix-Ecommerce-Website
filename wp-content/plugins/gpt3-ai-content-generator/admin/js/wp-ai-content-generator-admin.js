(function( $ ) {
	'use strict';

    // -------------------- NAVIGATION: Tab Navigation Logic --------------------
    $(".aipower-tab-btn").on('click', function () {
        $(".aipower-tab-btn").removeClass("active");
        $(".aipower-tab-pane").removeClass("active");
    
        $(this).addClass("active");
        $("#" + $(this).data("tab")).addClass("active");
    });
    
    $(".aipower-nav-link").on('click', function (e) {
        if ($(this).attr('href') === '#') {
            e.preventDefault(); // Prevent default link behavior only if href="#" (no navigation)
        }
    
        $(".aipower-nav-link").removeClass("active");
        $(this).addClass("active");
    });

    // -------------------- UI FEEDBACK: Spinner and Message Display Functions --------------------
    function showSpinner() {
        $('#aipower-spinner').show();
        $('#aipower-message').removeClass('error success').addClass('aipower-autosaving').text('Autosaving...').fadeIn();
    }
    
    function showSuccess(message) {
        $('#aipower-spinner').hide();
        $('#aipower-message').removeClass('error').addClass('success').text(message).fadeIn();
        setTimeout(function () {
            $('#aipower-message').fadeOut();
        }, 3000);
    }

    function showError(message) {
        $('#aipower-spinner').hide();
        $('#aipower-message').removeClass('success').addClass('error').text(message).fadeIn();
    }

    // -------------------- UI LOGIC: Show Provider-Specific Container --------------------
    function showProviderContainer(engine) {
        $('.aipower-provider-container').hide();

        // Show or hide the Safety Settings icon based on the selected engine
        if (engine === 'Google') {
            $('#aipower-safety-settings-icon').show();  // Show the icon if Google is selected
        } else {
            $('#aipower-safety-settings-icon').hide();  // Hide the icon if not Google
            $('#aipower_safety_settings_modal').hide(); // Also hide the modal if it's open
        }

        switch (engine) {
            case 'OpenAI':
                $('#aipower-openai-container').show();
                break;
            case 'OpenRouter':
                $('#aipower-openrouter-container').show();
                break;
            case 'Google':
                $('#aipower-google-container').show();
                break;
            case 'Azure':
                $('#aipower-azure-container').show();
                break;
        }
    }

    var initialEngine = $('#aipower-ai-engine-dropdown').val();
    showProviderContainer(initialEngine);

    // -------------------- LOGIC: Handle AI Engine Selection Change --------------------
    $('#aipower-ai-engine-dropdown').on('change', function () {
        var selectedEngine = $(this).val();
        var nonce = $('#ai-engine-nonce').val();

        showProviderContainer(selectedEngine);
        showSpinner();

        $.post(ajaxurl, {
            action: 'aipower_save_ai_engine',
            engine: selectedEngine,
            _wpnonce: nonce
        }, function (response) {
            if (response.success) {
                showSuccess(response.data.message);
            } else {
                showError(response.data.message || 'An error occurred while updating the AI engine.');
            }
        }).fail(function () {
            showError('Failed to connect to the server. Please try again.');
        });
    });

    // -------------------- LOGIC: Save API Key --------------------
    function saveApiKey(engine, apiKey) {
        var nonce = $('#ai-engine-nonce').val();
        showSpinner();

        $.post(ajaxurl, {
            action: 'aipower_save_api_key',
            engine: engine,
            api_key: apiKey,  // Send the full, unmasked API key
            _wpnonce: nonce
        }, function (response) {
            if (response.success) {
                showSuccess(response.data.message);
            } else {
                showError(response.data.message || 'An error occurred while updating the API key.');
            }
        }).fail(function () {
            showError('Failed to connect to the server. Please try again.');
        });
    }

    // -------------------- EVENTS: Handle Focus and Blur for API Keys --------------------
    ['OpenAI', 'OpenRouter', 'Google', 'Azure', 'Replicate', 'Pexels', 'Pixabay'].forEach(function (engine) {
        var apiKeyField = $('#' + engine + '-api-key');
        var fullApiKey = apiKeyField.data('full-api-key') || apiKeyField.val(); // Store the full API key

        // Focus: Reveal the full API key if it's currently masked
        apiKeyField.on('focus', function () {
            if ($(this).val() === maskApiKey(fullApiKey)) { 
                $(this).val(fullApiKey); // Show full key if masked
            }
        });

        // Blur: Re-mask the key if no changes are made
        apiKeyField.on('blur', function () {
            if ($(this).val() === fullApiKey) {
                $(this).val(maskApiKey(fullApiKey)); // Re-mask if unchanged
            } else {
                fullApiKey = $(this).val();  // Update full API key if user changed it
                saveApiKey(engine.charAt(0).toUpperCase() + engine.slice(1), fullApiKey); // Save new key
            }
        });
    });

    // Helper function to mask API key
    function maskApiKey(apiKey) {
        return apiKey.length > 4 ? apiKey.replace(/.(?=.{4})/g, '*') : apiKey;
    }

    // -------------------- LOGIC: Save Azure Fields (API Key, Endpoint, Deployment, Embeddings) --------------------
    var azureFields = {
        'Azure-api-key': 'wpaicg_azure_api_key',
        'Azure-endpoint': 'wpaicg_azure_endpoint',
        'Azure-deployment': 'wpaicg_azure_deployment',
        'Azure-embeddings': 'wpaicg_azure_embeddings'
    };

    // Store the initial value of the field on focus and compare it on blur
    $.each(azureFields, function(fieldId, optionName) {
        var initialValue;

        $('#' + fieldId).on('focus', function () {
            initialValue = $(this).val(); // Store the initial value when the field gains focus
        });

        $('#' + fieldId).on('blur', function () {
            var newValue = $(this).val();
            if (initialValue !== newValue) {
                saveAzureField(fieldId, optionName); // Save only if the value has changed
            }
        });
    });

    // -------------------- LOGIC: Save Azure Fields (API Key, Endpoint, Deployment, Embeddings) --------------------
    function saveAzureField(fieldId, optionName) {
        var fieldValue = $('#' + fieldId).val();
        var nonce = $('#ai-engine-nonce').val();
        showSpinner();

        $.post(ajaxurl, {
            action: 'aipower_save_azure_field',
            option_name: optionName,
            option_value: fieldValue,
            _wpnonce: nonce
        }, function (response) {
            if (response.success) {
                showSuccess(response.data.message);
            } else {
                showError(response.data.message || 'An error occurred while saving the Azure field.');
            }
        }).fail(function () {
            showError('Failed to connect to the server. Please try again.');
        });
    }

    // -------------------- LOGIC: Handle OpenAI Engine Selection Change --------------------
    // Handle OpenAI model selection change
    $('#aipower-openai-model-dropdown').on('change', function () {
        var selectedModel = $(this).val();
        var nonce = $('#ai-engine-nonce').val();
        
        showSpinner();
        
        $.post(ajaxurl, {
            action: 'aipower_save_openai_model',
            model: selectedModel,
            _wpnonce: nonce
        }, function (response) {
            if (response.success) {
                showSuccess(response.data.message);
            } else {
                showError(response.data.message || 'An error occurred while saving the model.');
            }
        }).fail(function () {
            showError('Failed to connect to the server. Please try again.');
        });
    });

    // -------------------- LOGIC: Handle OpenRouter Engine Selection Change --------------------
    // Handle OpenRouter model selection change
    $('#aipower-openrouter-model-dropdown').on('change', function () {
        var selectedModel = $(this).val();
        var nonce = $('#ai-engine-nonce').val();
        
        showSpinner();
        
        $.post(ajaxurl, {
            action: 'aipower_save_openrouter_model',
            model: selectedModel,
            _wpnonce: nonce
        }, function (response) {
            if (response.success) {
                showSuccess(response.data.message);
            } else {
                showError(response.data.message || 'An error occurred while saving the model.');
            }
        }).fail(function () {
            showError('Failed to connect to the server. Please try again.');
        });
    });

    // -------------------- LOGIC: Handle Google Model Selection Change --------------------
    $('#aipower-google-model-dropdown').on('change', function () {
        var selectedModel = $(this).val();
        var nonce = $('#ai-engine-nonce').val();

        showSpinner();

        $.post(ajaxurl, {
            action: 'aipower_save_google_model',
            model: selectedModel,
            _wpnonce: nonce
        }, function (response) {
            if (response.success) {
                showSuccess(response.data.message);
            } else {
                showError(response.data.message || 'An error occurred while saving the model.');
            }
        }).fail(function () {
            showError('Failed to connect to the server. Please try again.');
        });
    });

    // -------------------- LOGIC: Handle OpenRouter Model Sync --------------------
    $('#syncOpenRouter, #aipower_sync_openrouter_models_bot').on('click', function() {
        var btn = $(this);
        var icon = btn.find('.dashicons');
        var nonce = $('#ai-engine-nonce').val();
        var targetDropdownSelector = btn.data('target'); // Get the target from data-target

        if (!targetDropdownSelector) {
            // If no data-target is specified, you can set a default or exit
            console.error('No target dropdown specified for syncing.');
            return;
        }

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'aipower_sync_openrouter_models',
                _wpnonce: nonce
            },
            beforeSend: function() {
                icon.addClass('aipower-rotating'); // Apply the rotating class
            },
            success: function(response) {
                icon.removeClass('aipower-rotating'); // Remove the rotating class
                if (response.success) {
                    // Get the default model if exists
                    var defaultModel = response.data.default_model;
            
                    // Check if the target selector is the specific dropdown that needs a reload
                    if (targetDropdownSelector === '#aipower-openrouter-model-dropdown') {
                        // For the specific dropdown: Show success message and reload the page
                        showSuccess('Models synced successfully. Reloading the page...');
                        location.reload(); // Reload the current page
                    } else {
                        // Update the model dropdown with new models
                        var $modelDropdown = $(targetDropdownSelector);
                        $modelDropdown.empty(); // Clear the existing options
            
                        $.each(response.data.models, function(provider, models) {
                            var optgroup = $('<optgroup>').attr('label', provider);
                            $.each(models, function(index, model) {
                                var $option = $('<option>').val(model.id).text(model.name);
                                if (model.id === defaultModel) {
                                    $option.attr('selected', 'selected'); // Keep the default model selected
                                }
                                optgroup.append($option);
                            });
                            $modelDropdown.append(optgroup);
                        });
            
                        // Show success message
                        showSuccess('Models synced successfully.');
                    }
                } else {
                    showError(response.data || 'An error occurred.');
                }
            },            
            error: function(jqXHR, textStatus, errorThrown) {
                icon.removeClass('aipower-rotating'); // Remove the rotating class on error
                showError('Error: ' + errorThrown);
            }
        });
    });
    
    // -------------------- LOGIC: Handle OpenAI Model Sync --------------------
    $('#syncOpenAI, #aipower_sync_openai_models_bot').on('click', function() {
        var btn = $(this);
        var icon = btn.find('.dashicons');
        var nonce = $('#ai-engine-nonce').val();

        // Retrieve the target selector from data-target attribute
        var targetSelector = btn.data('target');
        var $modelDropdown = targetSelector ? $(targetSelector) : btn.closest('.aipower-form-group').find('select');

        // Capture the currently selected model
        var currentSelectedModel = $modelDropdown.val();

        $.ajax({
            url: ajaxurl, // Ensure this is correctly defined in your WordPress setup
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'aipower_fetch_openai_models',
                _wpnonce: nonce
            },
            beforeSend: function() {
                icon.addClass('aipower-rotating'); // Add rotating animation
            },
            success: function(response) {
                icon.removeClass('aipower-rotating'); // Remove rotating animation
                if (response.success) {
                    // Check if the target selector is Page 1's dropdown
                    if (targetSelector === '#aipower-openai-model-dropdown') {
                        // For Page 1: Show success message and reload the page
                        showSuccess('Models synced successfully. Reloading the page...');
                        location.reload(); // Reload the current page
                    } else {
                        // For Page 2: Update the dropdown without reloading
                        $modelDropdown.empty();

                        // Populate GPT-3.5 Models
                        var gpt35Group = $('<optgroup>').attr('label', 'GPT-3.5 Models');
                        $.each(response.data.gpt35_models, function(key, label) {
                            gpt35Group.append($('<option>').val(key).text(label));
                        });
                        $modelDropdown.append(gpt35Group);

                        // Populate GPT-4 Models
                        var gpt4Group = $('<optgroup>').attr('label', 'GPT-4 Models');
                        $.each(response.data.gpt4_models, function(key, label) {
                            gpt4Group.append($('<option>').val(key).text(label));
                        });
                        $modelDropdown.append(gpt4Group);

                        // Populate Custom Models if available
                        if (response.data.custom_models && response.data.custom_models.length > 0) {
                            var customGroup = $('<optgroup>').attr('label', 'Custom Models');
                            $.each(response.data.custom_models, function(index, model) {
                                customGroup.append($('<option>').val(model).text(model));
                            });
                            $modelDropdown.append(customGroup);
                        }

                        // Retrieve the default selected model from data attribute
                        var defaultSelectedModel = $modelDropdown.data('default');

                        // Set back the selected model if it exists, otherwise fallback to default
                        if ($modelDropdown.find("option[value='" + currentSelectedModel + "']").length > 0) {
                            $modelDropdown.val(currentSelectedModel);
                        } else if (defaultSelectedModel) {
                            $modelDropdown.val(defaultSelectedModel);
                        } else {
                            // Optionally, set to the first available model
                            $modelDropdown.prop('selectedIndex', 0);
                        }

                        // Display a success message
                        showSuccess('Models synced successfully.');
                    }
                } else {
                    // Extract and display the error message
                    var errorMessage = 'An error occurred.';
                    if (response.data && response.data.message) {
                        errorMessage = response.data.message;
                    }
                    showError(errorMessage);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                icon.removeClass('aipower-rotating'); // Remove rotating animation
                // Extract and display the error message if available
                var errorMessage = 'Error: ' + errorThrown;
                if (jqXHR.responseJSON && jqXHR.responseJSON.data && jqXHR.responseJSON.data.message) {
                    errorMessage = jqXHR.responseJSON.data.message;
                }
                showError(errorMessage);
            }
        });
    });

    // -------------------- LOGIC: Handle Google Model Sync --------------------
    $('#syncGoogle, #aipower_sync_google_models_bot').on('click', function() {
        var btn = $(this);
        var icon = btn.find('.dashicons');
        var nonce = $('#ai-engine-nonce').val();

        // Retrieve the target selector from data-target attribute
        var targetSelector = btn.data('target');
        var $modelDropdown = targetSelector ? $(targetSelector) : btn.closest('.aipower-form-group').find('select');

        // Capture the currently selected model
        var currentSelectedModel = $modelDropdown.val();

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'aipower_sync_google_models',
                _wpnonce: nonce
            },
            beforeSend: function() {
                icon.addClass('aipower-rotating'); // Add rotating animation
            },
            success: function(response) {
                icon.removeClass('aipower-rotating'); // Remove rotating animation
                if (response.success) {
                    // Check if the target selector is Page 1's dropdown
                    if (targetSelector === '#aipower-google-model-dropdown') {
                        // For Page 1: Show success message and reload the page
                        showSuccess('Google models synced successfully. Reloading the page...');
                        location.reload(); // Reload the current page
                    } else {
                        // For Page 2: Update the dropdown without reloading
                        $modelDropdown.empty(); // Clear the existing options

                        // Define words that disable the option
                        var disabledWords = ['vision']; // Add specific words that disable the option

                        $.each(response.data.models, function(index, model) {
                            var shouldBeDisabled = false;

                            // Check if the model should be disabled
                            for (var i = 0; i < disabledWords.length; i++) {
                                if (model.indexOf(disabledWords[i]) !== -1) {
                                    shouldBeDisabled = true;
                                    break; // Disable the option if any word is found
                                }
                            }

                            // Create display name
                            var displayName = model.replace(/-/g, ' ').replace(/\b\w/g, function(l){ return l.toUpperCase(); });

                            var $option = $('<option>').val(model).text(displayName);

                            if (shouldBeDisabled) {
                                $option.prop('disabled', true);
                            }

                            $modelDropdown.append($option);
                        });

                        // Set back the selected model if it exists, otherwise leave as is
                        if ($modelDropdown.find("option[value='" + currentSelectedModel + "']").length > 0) {
                            $modelDropdown.val(currentSelectedModel);
                        }

                        // Show success message
                        showSuccess('Google models synced successfully.');
                    }
                } else {
                    // Extract the error message properly
                    var errorMessage = 'An error occurred.';
                    if (response.data && response.data.message) {
                        errorMessage = response.data.message;
                    }
                    showError(errorMessage);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                icon.removeClass('aipower-rotating'); // Remove rotating animation
                // Try to extract error message from the response if available
                var errorMessage = 'Error: ' + errorThrown;
                if (jqXHR.responseJSON && jqXHR.responseJSON.data && jqXHR.responseJSON.data.message) {
                    errorMessage = jqXHR.responseJSON.data.message;
                }
                showError(errorMessage);
            }
        });
    });


    // -------------------- LOGIC: Save Advanced Settings --------------------
    $('#aipower_advanced_settings_modal input').on('change', function () {
        var optionName = $(this).attr('name');
        var optionValue = $(this).val();
        var nonce = $('#ai-engine-nonce').val(); // Make sure this nonce is in your HTML

        showSpinner(); // Show the spinner when saving

        // Send the AJAX request to save the setting
        $.post(ajaxurl, {
            action: 'aipower_save_advanced_setting',
            option_name: optionName,
            option_value: optionValue,
            _wpnonce: nonce
        }, function (response) {
            if (response.success) {
                showSuccess(response.data.message); // Show success message
            } else {
                showError(response.data.message || 'An error occurred while saving the setting.');
            }
        }).fail(function () {
            showError('Failed to connect to the server. Please try again.');
        });
    });
    // Apply Modal Logic to Advanced Settings Modal
    setupModalLogic('#aipower_advanced_settings_modal', '#aipower-advanced-settings-icon');

    // -------------------- LOGIC: Save Google Safety Settings --------------------
    $('#aipower_safety_settings_modal select').on('change', function () {
        var settings = {};
        $('#aipower_safety_settings_modal select').each(function () {
            var category = $(this).attr('id');
            var threshold = $(this).val();
            settings[category] = threshold;
        });
        var nonce = $('#ai-engine-nonce').val();

        showSpinner(); // Show the spinner when saving

        $.post(ajaxurl, {
            action: 'aipower_save_google_safety_settings',
            settings: settings,
            _wpnonce: nonce
        }, function (response) {
            if (response.success) {
                showSuccess(response.data.message); // Show success message
            } else {
                showError(response.data.message || 'An error occurred while saving the safety settings.');
            }
        }).fail(function () {
            showError('Failed to connect to the server. Please try again.');
        });
    });

    // Apply Modal Logic to Safety Settings Modal
    setupModalLogic('#aipower_safety_settings_modal', '#aipower-safety-settings-icon');

    // -------------------- NAVIGATION: Sub-Tab Navigation Logic --------------------
    // Generate sub-tabs dynamically
    $('.aipower-tab-pane').each(function () {
        var $tabPane = $(this);
        var $subTabsContainer = $tabPane.find('.aipower-sub-tabs');
        var $subTabPanes = $tabPane.find('.aipower-sub-tab-pane');

        if ($subTabPanes.length > 0) {
            $subTabPanes.each(function (index) {
                var $subTabPane = $(this);
                var tabId = $subTabPane.attr('id');
                var tabName = $subTabPane.data('tab-name');

                var activeClass = '';
                if ($subTabPane.hasClass('active')) {
                    activeClass = 'active';
                }

                // Append separator as a separate span
                if (index > 0) {
                    $subTabsContainer.append('<span class="separator"> | </span>');
                }

                var $link = $('<a href="#" class="aipower-sub-tab-link ' + activeClass + '" data-sub-tab="' + tabId + '">' + tabName + '</a>');
                $subTabsContainer.append($link);
            });
        }
    });

    // Sub-tab click handler
    $(".aipower-sub-tabs").on('click', '.aipower-sub-tab-link', function (e) {
        if ($(this).hasClass('active')) {
            e.preventDefault();
            return; // Do nothing if the link is active
        }

        e.preventDefault();

        var parentTabPane = $(this).closest('.aipower-tab-pane');

        // Remove 'active' class from all links and panes
        parentTabPane.find(".aipower-sub-tab-link").removeClass("active");
        parentTabPane.find(".aipower-sub-tab-pane").removeClass("active");

        // Add 'active' class to the clicked link and corresponding pane
        $(this).addClass("active");
        parentTabPane.find("#" + $(this).data("sub-tab")).addClass("active");
    });


    // -------------------- LOGIC: Uncheck 'Generate Title from Keywords' if 'Include Original Title in the Prompt' is checked --------------------
    $('#_wpaicg_gen_title_from_keywords').on('change', function () {
        var isChecked = $(this).is(':checked');

        // Enable or disable 'Include Original Title in the Prompt' based on 'Generate Title from Keywords' checkbox
        if (!isChecked) {
            $('#_wpaicg_original_title_in_prompt').prop('checked', false).prop('disabled', true).val('0');
        } else {
            $('#_wpaicg_original_title_in_prompt').prop('disabled', false).val('1');
        }
    });

    // On page load, if 'Generate Title from Keywords' is unchecked, disable and uncheck the 'Include Original Title in the Prompt' checkbox and set its value to false
    if (!$('#_wpaicg_gen_title_from_keywords').is(':checked')) {
        $('#_wpaicg_original_title_in_prompt').prop('disabled', true).prop('checked', false).val('0');
    }

    // -------------------- LOGIC: Save Content, SEO and Image Settings --------------------
    // Assuming the nonce is correctly output in a hidden input with ID 'ai-engine-nonce'
    const nonce = $('#ai-engine-nonce').val();
    const ajaxAction = 'aipower_save_content_settings'; // Existing AJAX action

    /**
     * Save setting via AJAX.
     * @param {string} field 
     * @param {string} value 
     */
    const saveSetting = (field, value) => {
        showSpinner();

        $.post(ajaxurl, {
            action: ajaxAction,
            field,
            value,
            _wpnonce: nonce
        })
        .done(response => {
            if (response.success) {
                showSuccess(response.data.message);
            } else {
                showError(response.data.message || 'An error occurred while saving the setting.');
            }
        })
        .fail(() => {
            showError('Failed to connect to the server. Please try again.');
        });
    };

    /**
     * Configuration for fields and their dependencies.
     */
    const fieldsConfig = [
        // Existing Content Settings
        { field: 'wpai_language', selector: '#aipower-language-dropdown' },
        { field: 'wpai_writing_style', selector: '#aipower-writing-style-dropdown' },
        { field: 'wpai_writing_tone', selector: '#aipower-writing-tone-dropdown' },
        { field: 'wpai_number_of_heading', selector: '#aipower-number-of-heading-dropdown' },
        { field: 'wpai_heading_tag', selector: '#aipower-heading-tag-dropdown' },
        { field: 'wpai_add_tagline', selector: '#aipower-add-tagline' },
        { field: 'wpai_modify_headings', selector: '#aipower-modify-headings' },
        { field: 'wpai_add_keywords_bold', selector: '#aipower-add-keywords-bold' },
        { field: 'wpai_add_faq', selector: '#aipower-add-faq' },
        { field: 'wpaicg_toc', selector: '#aipower_toc', toggleGroups: ['#aipower_toc_settings'] },
        { field: 'wpaicg_toc_title', selector: '#aipower_toc_title' },
        { field: 'wpaicg_toc_title_tag', selector: '#aipower_toc_title_tag' },
        { field: 'wpai_add_intro', selector: '#aipower_add_intro', toggleGroups: ['#aipower_intro_settings'] },
        { field: 'wpaicg_intro_title_tag', selector: '#aipower_intro_title_tag' },
        { field: 'wpaicg_hide_introduction', selector: '#aipower_hide_introduction' },
        { field: 'wpai_add_conclusion', selector: '#aipower_add_conclusion', toggleGroups: ['#aipower_conclusion_settings'] },
        { field: 'wpaicg_hide_conclusion', selector: '#wpaicg_hide_conclusion' },
        { field: 'wpaicg_conclusion_title_tag', selector: '#wpaicg_conclusion_title_tag' },
        { field: 'wpaicg_content_custom_prompt_enable', selector: '#aipower_custom_prompt_enable', toggleGroups: ['#aipower_custom_prompt_box'] },
        { field: 'wpaicg_content_custom_prompt', selector: '#aipower_custom_prompt' },
        { field: '_wpaicg_seo_meta_desc', selector: '#_wpaicg_seo_meta_desc' },
        { field: '_wpaicg_seo_meta_tag', selector: '#_wpaicg_seo_meta_tag' },
        { field: '_yoast_wpseo_metadesc', selector: '#_yoast_wpseo_metadesc' },
        { field: '_aioseo_description', selector: '#_aioseo_description' },
        { field: 'rank_math_description', selector: '#rank_math_description' },
        { field: '_wpaicg_genesis_description', selector: '#_wpaicg_genesis_description' },
        { field: '_wpaicg_gen_title_from_keywords', selector: '#_wpaicg_gen_title_from_keywords' },
        { field: '_wpaicg_original_title_in_prompt', selector: '#_wpaicg_original_title_in_prompt' },
        { field: '_wpaicg_focus_keyword_in_url', selector: '#_wpaicg_focus_keyword_in_url' },
        { field: '_wpaicg_sentiment_in_title', selector: '#_wpaicg_sentiment_in_title' },
        { field: '_wpaicg_power_word_in_title', selector: '#_wpaicg_power_word_in_title' },
        { field: '_wpaicg_shorten_url', selector: '#_wpaicg_shorten_url' },
        { field: 'wpai_cta_pos', selector: '#aipower-cta-position-dropdown' },
        { field: 'img_size', selector: '#aipower-img-size' },
        { field: 'wpaicg_dalle_type', selector: '#aipower-dalle-type' },
        { field: '_wpaicg_image_style', selector: '#aipower-image-style' },
        { field: 'wpaicg_custom_image_settings[artist]', selector: '#aipower-artist' },
        { field: 'wpaicg_custom_image_settings[photography_style]', selector: '#aipower-photography-style' },
        { field: 'wpaicg_custom_image_settings[lighting]', selector: '#aipower-lighting' },
        { field: 'wpaicg_custom_image_settings[subject]', selector: '#aipower-subject' },
        { field: 'wpaicg_custom_image_settings[camera_settings]', selector: '#aipower-camera-settings' },
        { field: 'wpaicg_custom_image_settings[composition]', selector: '#aipower-composition' },
        { field: 'wpaicg_custom_image_settings[resolution]', selector: '#aipower-resolution' },
        { field: 'wpaicg_custom_image_settings[color]', selector: '#aipower-color' },
        { field: 'wpaicg_custom_image_settings[special_effects]', selector: '#aipower-special-effects' },
        { field: 'wpaicg_sd_api_key', selector: '#aipower-replicate-api-key' },
        { field: 'wpaicg_default_replicate_model', selector: '#aipower-replicate-model' },
        { field: 'wpaicg_sd_api_version', selector: '#aipower-replicate-version' },
        { field: 'wpaicg_pexels_api', selector: '#aipower-pexels-api-key' },
        { field: 'wpaicg_pexels_orientation', selector: '#aipower-pexels-orientation' },
        { field: 'wpaicg_pexels_size', selector: '#aipower-pexels-size' },
        { field: 'wpaicg_pexels_enable_prompt', selector: '#aipower-pexels-enable-prompt' },
        { field: 'wpaicg_pixabay_api', selector: '#aipower-pixabay-api-key' },
        { field: 'wpaicg_pixabay_language', selector: '#aipower-pixabay-language' },
        { field: 'wpaicg_pixabay_type', selector: '#aipower-pixabay-type' },
        { field: 'wpaicg_pixabay_orientation', selector: '#aipower-pixabay-orientation' },
        { field: 'wpaicg_pixabay_order', selector: '#aipower-pixabay-order' },
        { field: 'wpaicg_pixabay_enable_prompt', selector: '#aipower-pixabay-enable-prompt' },
        { field: 'wpaicg_image_source', selector: 'input.aipower-image-source:checkbox' },
        { field: 'wpaicg_featured_image_source', selector: 'input.aipower-featured-image-source:checkbox' },
        { field: 'wpaicg_image_source', selector: '#aipower-dalle-variant' },
        { field: 'wpaicg_featured_image_source', selector: '#aipower-dalle-featured-variant' },
        { field: 'wpaicg_woo_generate_title', selector: '#aipower_woo_generate_title' },
        { field: 'wpaicg_woo_generate_description', selector: '#aipower_woo_generate_description' },
        { field: 'wpaicg_woo_generate_short', selector: '#aipower_woo_generate_short' },
        { field: 'wpaicg_woo_generate_tags', selector: '#aipower_woo_generate_tags' },
        { field: 'wpaicg_woo_meta_description', selector: '#aipower_woo_meta_description' },
        { field: '_wpaicg_shorten_woo_url', selector: '#aipower_shorten_woo_url' },
        { field: 'wpaicg_generate_woo_focus_keyword', selector: '#aipower_generate_woo_focus_keyword' },
        { field: 'wpaicg_enforce_woo_keyword_in_url', selector: '#aipower_enforce_woo_keyword_in_url' },
        { field: 'wpaicg_woo_custom_prompt', selector: '#aipower_woo_custom_prompt_enable', toggleGroups: ['#aipower_woo_custom_prompt_box'] },
        { field: 'wpaicg_woo_custom_prompt_title', selector: '#aipower_woo_custom_prompt_title' },
        { field: 'wpaicg_woo_custom_prompt_short', selector: '#aipower_custom_prompt_short' },
        { field: 'wpaicg_woo_custom_prompt_description', selector: '#aipower_custom_prompt_desc' },
        { field: 'wpaicg_woo_custom_prompt_keywords', selector: '#aipower_custom_prompt_tags' },
        { field: 'wpaicg_woo_custom_prompt_meta', selector: '#aipower_custom_prompt_meta' },
        { field: 'wpaicg_woo_custom_prompt_focus_keyword', selector: '#aipower_custom_prompt_focus_keyword' },
        { field: 'wpaicg_comment_prompt', selector: '#aipower_comment_prompt' },
        { field: 'wpaicg_search_font_size', selector: '#aipower_search_font_size' },
        { field: 'wpaicg_search_placeholder', selector: '#aipower_search_placeholder' },
        { field: 'wpaicg_search_font_color', selector: '#aipower_search_font_color' },
        { field: 'wpaicg_search_border_color', selector: '#aipower_search_border_color' },
        { field: 'wpaicg_search_bg_color', selector: '#aipower_search_bg_color' },
        { field: 'wpaicg_search_width', selector: '#aipower_search_width' },
        { field: 'wpaicg_search_height', selector: '#aipower_search_height' },
        { field: 'wpaicg_search_no_result', selector: '#aipower_search_no_result' },
        { field: 'wpaicg_search_result_font_size', selector: '#aipower_search_result_font_size' },
        { field: 'wpaicg_search_result_font_color', selector: '#aipower_search_result_font_color' },
        { field: 'wpaicg_search_result_bg_color', selector: '#aipower_search_result_bg_color' },
        { field: 'wpaicg_search_loading_color', selector: '#aipower_search_loading_color' },
        { field: 'wpaicg_order_status_token', selector: '#aipower_token_sale_status' },
        { field: 'wpaicg_editor_change_action', selector: '#aipower_editor_change_action' },
        { field: 'wpaicg_google_api_key', selector: '#aipower_google_common_api_key' },
        { field: 'wpaicg_google_api_key', selector: '#aipower_google_common_api_key_for_internet' },
        { field: 'wpaicg_elevenlabs_api', selector: '#aipower_elevenlabs_api_key' },
        { field: 'wpaicg_google_search_engine_id', selector: '#aipower_google_custom_search_engine_id' },
        { field: 'wpaicg_google_search_country', selector: '#aipower_google_cse_region' },
        { field: 'wpaicg_google_search_language', selector: '#aipower_google_cse_language' },
        { field: 'wpaicg_google_search_num', selector: '#aipower_google_cse_results' },
        { field: 'wpaicg_banned_words', selector: '#aipower_chat_banned_words' },
        { field: 'wpaicg_banned_ips', selector: '#aipower_chat_banned_ips' },
        { field: 'wpaicg_user_uploads', selector: '#aipower_chat_image_user_uploads' },
        { field: 'wpaicg_img_processing_method', selector: '#aipower_chat_image_method' },
        { field: 'wpaicg_img_vision_quality', selector: '#aipower_chat_image_quality' },
        { field: 'wpaicg_delete_image', selector: '#aipower-delete-images-after-process' },
        { field: 'wpaicg_chat_enable_sale', selector: '#aipower_enable_token_purchase' },
        { field: 'wpaicg_elevenlabs_hide_error', selector: '#aipower_elevenlabs_hide_error' },
        { field: 'wpaicg_typewriter_effect', selector: '#aipower_chat_typewriter_effect' },
        { field: 'wpaicg_typewriter_speed', selector: '#aipower_chat_typewriter_speed' },
        { field: 'wpaicg_autoload_chat_conversations', selector: '#aipower_chat_dont_load_past_chats' },

    ];

    /**
     * Attach event listeners based on fields configuration.
     */
    fieldsConfig.forEach(({ field, selector, toggleGroups }) => {
        const $elements = $(selector);
        if ($elements.length === 0) return; // Skip if element doesn't exist
    
        const isCheckbox = $elements.is(':checkbox');
    
        $elements.on('change', function () {
            const value = isCheckbox ? ($(this).is(':checked') ? '1' : '0') : $(this).val();
            saveSetting(field, value);
    
            // Handle toggle groups if defined
            if (toggleGroups && toggleGroups.length) {
                const condition = isCheckbox ? $(this).is(':checked') : true;
                toggleVisibility(toggleGroups, condition);
            }
        });
    });
    

    /**
     * Toggle visibility of specified groups based on condition.
     * @param {Array<string>} selectors 
     * @param {boolean} condition 
     */
    const toggleVisibility = (selectors, condition) => {
        selectors.forEach(selector => {
            $(selector).toggle(condition);
        });
    };

    /**
     * Initialize visibility for toggle groups.
     */
    const initializeVisibility = () => {
        fieldsConfig.forEach(({ selector, toggleGroups }) => {
            if (toggleGroups && toggleGroups.length) {
                const $trigger = $(selector);
                const condition = $trigger.is(':checkbox') ? $trigger.is(':checked') : !!$trigger.val();
                toggleVisibility(toggleGroups, condition);
            }
        });
    };

    // For image source checkboxes
    $('.aipower-image-source').on('change', function() {
        if ($(this).is(':checked')) {
            // Uncheck all other checkboxes in the same group
            $('.aipower-image-source').not(this).prop('checked', false);
            saveSetting('wpaicg_image_source', $(this).val());
        } else {
            // If unchecked, pass 'none' as the value
            saveSetting('wpaicg_image_source', 'none');
        }
    });

    // For featured image source checkboxes
    $('.aipower-featured-image-source').on('change', function() {
        if ($(this).is(':checked')) {
            // Uncheck all other checkboxes in the same group
            $('.aipower-featured-image-source').not(this).prop('checked', false);
            saveSetting('wpaicg_featured_image_source', $(this).val());
        } else {
            // If unchecked, pass 'none' as the value
            saveSetting('wpaicg_featured_image_source', 'none');
        }
    });
    
    // Initial visibility setup
    initializeVisibility();
    
    // -------------------- LOGIC: Reset Custom Prompt --------------------
    $('#reset_custom_prompt').on('click', function () {
        const defaultPrompt = $('#aipower_custom_prompt').data('default');
        $('#aipower_custom_prompt').val(defaultPrompt).trigger('change'); // Trigger change event to autosave
    });

    // -------------------- LOGIC: Reset Comment Replier Prompt --------------------
    $('#reset_comment_prompt').on('click', function () {
        const defaultCommentPrompt = $('#aipower_comment_prompt').data('default-prompt');
        $('#aipower_comment_prompt').val(defaultCommentPrompt).trigger('change'); // Trigger change event to autosave
    });
    
    // -------------------- LOGIC: Handle Replicate Model Sync --------------------
    $('.aipower_sync_replicate_models').on('click', function() {
        var btn = $(this);
        var icon = btn.find('.dashicons');
        var nonce = $('#ai-engine-nonce').val(); // Reuse the nonce from the new setup
        var currentSelectedModel = $('#aipower-replicate-model').val(); // Capture the currently selected model

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'wpaicg_fetch_replicate_models', // Updated action name
                _wpnonce: nonce // Use the nonce from the new setup
            },
            beforeSend: function() {
                icon.addClass('aipower-rotating'); // Add rotating class to show the spinner
            },
            success: function(res) {
                icon.removeClass('aipower-rotating'); // Remove rotating class after success

                if (res.status === 'success') {
                    // Populate the dropdown grouped by owner
                    var $modelDropdown = $('#aipower-replicate-model'); // Use the new ID
                    $modelDropdown.empty(); // Clear the dropdown

                    $.each(res.models, function(owner, models) {
                        // Add optgroup for the owner
                        var optgroup = $('<optgroup>').attr('label', owner);

                        // Add each model under the owner
                        $.each(models, function(index, model) {
                            var option = $('<option>', {
                                value: model.name,
                                text: model.name + ' (' + model.run_count + ' runs)',
                                'data-version': model.latest_version // Attach the version as a data attribute
                            });

                            optgroup.append(option);
                        });

                        $modelDropdown.append(optgroup);
                    });

                    // Re-select the previously selected model after sync if it exists
                    if ($modelDropdown.find("option[value='" + currentSelectedModel + "']").length > 0) {
                        $modelDropdown.val(currentSelectedModel); // Re-select the previously selected model
                    }

                    // Trigger change event to update the version field with the default model's version
                    $modelDropdown.trigger('change');

                    // Show success message
                    showSuccess('Replicate models synced successfully.');
                } else {
                    showError(res.msg || 'An error occurred.');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                icon.removeClass('aipower-rotating'); // Remove rotating class on error
                showError('Error: ' + errorThrown);
            }
        });
    });

    // -------------------- LOGIC: Append Version to the Version Field on Model Selection --------------------
    $('#aipower-replicate-model').on('change', function() {
        var selectedVersion = $(this).find(':selected').data('version'); // Get the version from the selected option
        $('#aipower-replicate-version').val(selectedVersion).trigger('change'); // Set the version field with the selected version and trigger change event
    });

    // -------------------- LOGIC: Handle Image Tab Switching --------------------
    // Function to handle tab switching
    $('.aipower-image-tab-btn').on('click', function() {
        var tabName = $(this).data('tab');

        // Hide all tab content
        $('.aipower-image-tab-pane').hide();

        // Remove active class from all tab buttons
        $('.aipower-image-tab-btn').removeClass('active');

        // Show the clicked tab content and add active class to the clicked button
        $('#' + tabName).show();
        $(this).addClass('active');
    });

    // Show default tab (DALL-E) by default
    $('#dalle-tab').show();

    // Generalized Modal Logic Function
    function setupModalLogic(modalSelector, settingsIconSelector, checkboxSelector) {
        const modal = $(modalSelector);
        const settingsIcon = $(settingsIconSelector);
        const modalClose = modal.find('.aipower-close');
        const checkbox = $(checkboxSelector);

        // Enable/Disable settings icon based on checkbox state
        checkbox.on('change', function () {
            const isChecked = $(this).is(':checked');
            settingsIcon.prop('disabled', !isChecked);  // Enable or disable the settings icon
        });

        // Open Modal when Settings Icon is clicked
        settingsIcon.on('click', function () {
            if (!$(this).prop('disabled')) {
                modal.fadeIn(200);
            }
        });

        // Close Modal when 'x' is clicked
        modalClose.on('click', function () {
            modal.fadeOut(200);
        });

        // Close Modal when clicking outside the modal content
        $(window).on('click', function (event) {
            if ($(event.target).is(modal)) {
                modal.fadeOut(200);
            }
        });

        // Optional: Close modal with the Esc key
        $(document).on('keydown', function (event) {
            if (event.key === "Escape" && modal.is(':visible')) {
                modal.fadeOut(200);
            }
        });
    }

    // Apply Modal Logic to ToC, Introduction, and Conclusion
    setupModalLogic('#aipower_toc_modal', '#aipower_toc_settings_icon', '#aipower_toc');
    setupModalLogic('#aipower_intro_modal', '#aipower_intro_settings_icon', '#aipower_add_intro');
    setupModalLogic('#aipower_conclusion_modal', '#aipower_conclusion_settings_icon', '#aipower_add_conclusion');
    setupModalLogic('#aipower_custom_prompt_modal', '#aipower_custom_prompt_settings_icon', '#aipower_custom_prompt_enable');
    setupModalLogic('#aipower_writing_settings_modal', '#aipower_writing_settings_icon', '#aipower_writing_settings_enable');
    setupModalLogic('#aipower_woo_custom_prompt_modal', '#aipower_woo_custom_prompt_settings_icon', '#aipower_woo_custom_prompt_enable');
    setupModalLogic('#aipower_comment_replier_modal', '#aipower_comment_replier_settings_icon');
    setupModalLogic('#aipower_semantic_search_modal', '#aipower_semantic_search_settings_icon', '#aipower_semantic_search_enable');
    setupModalLogic('#aipower_token_sale_modal', '#aipower_token_sale_settings_icon', '#aipower_token_sale_enable');
    setupModalLogic('#aipower_ai_assistant_modal', '#aipower_ai_assistant_settings_icon', '#aipower_ai_assistant_enable');
    setupModalLogic('#aipower_text_to_speech_modal', '#aipower_text_to_speech_settings_icon', '#aipower_text_to_speech_settings_icon');
    setupModalLogic('#aipower_common_internet_settings_modal', '#aipower_common_internet_settings_icon', '#aipower_common_internet_settings_icon');
    setupModalLogic('#aipower_chat_security_modal', '#aipower_chat_security_settings_icon', '#aipower_chat_security_settings_icon');
    setupModalLogic('#aipower_chat_image_modal', '#aipower_chat_image_settings_icon', '#aipower_chat_image_settings_icon');
    setupModalLogic('#aipower_chat_conversations_modal', '#aipower_conversations_settings_icon', '#aipower_conversations_settings_icon');

    // Initially update the state of the settings icon based on the checkbox status at page load
    $('#aipower_toc_settings_icon').prop('disabled', !$('#aipower_toc').is(':checked'));
    $('#aipower_intro_settings_icon').prop('disabled', !$('#aipower_add_intro').is(':checked'));
    $('#aipower_conclusion_settings_icon').prop('disabled', !$('#aipower_add_conclusion').is(':checked'));
    $('#aipower_custom_prompt_settings_icon').prop('disabled', !$('#aipower_custom_prompt_enable').is(':checked'));
    $('#aipower_woo_custom_prompt_settings_icon').prop('disabled', !$('#aipower_woo_custom_prompt_enable').is(':checked'));

    // -------------------- LOGIC: Handle Image Source Selection --------------------
    // Open modal when the configuration icon is clicked
    $('.aipower-settings-icon').on('click', function () {
        const provider = $(this).data('provider');

        // Check if provider is defined and handle only if it exists
        if (provider) {
            // Open the corresponding modal based on provider
            switch (provider) {
                case 'dalle':
                    $('#aipower-dalle-modal').show();
                    break;
                case 'replicate':
                    $('#aipower-replicate-modal').show();
                    break;
                case 'pexels':
                    $('#aipower-pexels-modal').show();
                    break;
                case 'pixabay':
                    $('#aipower-pixabay-modal').show();
                    break;
            }
        }
    });

    // Handle DALL-E image source selection
    $('#aipower-dalle-variant').on('change', function() {
        var selectedValue = $(this).val();
        // If 'none' is selected, uncheck the checkbox in the main table
        if (selectedValue === 'none') {
            $('input[name="wpaicg_image_source[]"][value="dalle3"]').prop('checked', false);
        } else {
            // If a DALL-E variant is selected, check the checkbox in the main table
            $('input[name="wpaicg_image_source[]"][value="dalle3"]').prop('checked', true);
        }
    });

    // Handle DALL-E featured image source selection
    $('#aipower-dalle-featured-variant').on('change', function() {
        var selectedValue = $(this).val();
        // If 'none' is selected, uncheck the checkbox in the main table
        if (selectedValue === 'none') {
            $('input[name="wpaicg_featured_image_source[]"][value="dalle3"]').prop('checked', false);
        } else {
            // If a DALL-E variant is selected, check the checkbox in the main table
            $('input[name="wpaicg_featured_image_source[]"][value="dalle3"]').prop('checked', true);
        }
    });

    // Close modal when the close button is clicked
    $('.aipower-close').on('click', function () {
        $(this).closest('.aipower-modal').hide();
    });

    // Close modal if user clicks outside the modal content
    $(window).on('click', function (e) {
        if ($(e.target).hasClass('aipower-modal')) {
            $('.aipower-modal').hide();
        }
    });

    // -------------------- LOGIC: Handle collapsible sections in woocommerce custom prompts --------------------
    $('.aipower-collapsible-toggle').on('click', function() {
        // Close all other open sections
        $('.aipower-collapsible-section').not($(this).parent()).removeClass('active');
        $('.aipower-collapsible-content').not($(this).next()).slideUp(200);

        // Toggle the clicked section
        $(this).next('.aipower-collapsible-content').slideToggle(200);
        $(this).parent('.aipower-collapsible-section').toggleClass('active');
    });

    // -------------------- LOGIC: Handle Copy to clipboard for woocommerce shortcodes --------------------
    $('.aipower-woocommerce-shortcode').on('click', function() {
        var $this = $(this);
        var textToCopy = $this.data('aipower-clipboard-text');
        navigator.clipboard.writeText(textToCopy).then(function() {
            // Create and show tooltip
            var $tooltip = $('<span class="aipower-tooltip">Copied!</span>');
            $this.append($tooltip);
            
            // Fade out and remove the tooltip
            $tooltip.fadeIn(200).delay(1000).fadeOut(200, function() {
                $(this).remove();
            });
        });
    });

    // -------------------- LOGIC: Handle WooCommerce Custom Prompt Templates --------------------
    // Define saveSetting function globally within this block
    const saveWooSetting = (field, value) => {
        // Show a spinner or some feedback (assume showSpinner is defined elsewhere)
        showSpinner();
        
        // Make the AJAX request to save the setting
        $.post(ajaxurl, {
            action: 'aipower_save_content_settings', // The existing AJAX action
            field,
            value,
            _wpnonce: $('#ai-engine-nonce').val() // Get nonce value
        })
        .done(response => {
            if (response.success) {
                // Show success message (assume showSuccess is defined elsewhere)
                showSuccess(response.data.message);
            } else {
                // Show error message if any (assume showError is defined elsewhere)
                showError(response.data.message || 'An error occurred while saving the setting.');
            }
        })
        .fail(() => {
            // Show a generic error message
            showError('Failed to connect to the server. Please try again.');
        });
    };

    // Function to handle dropdown change and update textarea
    function updateTextarea(dropdownId, textareaId, field) {
        $(dropdownId).on('change', function() {
            var selectedValue = $(this).val();
            var textarea = $(textareaId);
    
            // Clear the textarea content
            textarea.val('');
    
            // Append the selected value if it's not empty
            if (selectedValue) {
                textarea.val(selectedValue);

                // Trigger autosave after appending the value
                saveWooSetting(field, textarea.val());
            }
        });
    }
    
    // Bind dropdowns with their respective textareas and autosave fields
    updateTextarea('#aipower_woocommerce_title_dropdown', '#aipower_woo_custom_prompt_title', 'wpaicg_woo_custom_prompt_title');
    updateTextarea('#aipower_woocommerce_short_dropdown', '#aipower_custom_prompt_short', 'wpaicg_woo_custom_prompt_short');
    updateTextarea('#aipower_woocommerce_desc_dropdown', '#aipower_custom_prompt_desc', 'wpaicg_woo_custom_prompt_description');
    updateTextarea('#aipower_woocommerce_meta_dropdown', '#aipower_custom_prompt_meta', 'wpaicg_woo_custom_prompt_meta');
    updateTextarea('#aipower_woocommerce_tags_dropdown', '#aipower_custom_prompt_tags', 'wpaicg_woo_custom_prompt_keywords');
    updateTextarea('#aipower_woocommerce_focus_keyword_dropdown', '#aipower_custom_prompt_focus_keyword', 'wpaicg_woo_custom_prompt_focus_keyword');

    // -------------------- LOGIC: Handle Saving of Editor Button Menus for AI Assistant --------------------
    const ajaxWooAction = 'aipower_save_content_settings';

    // Parse the editor button menus from the hidden input
    let editorButtonMenus = $('#wpaicg-editor-button-menus').val();
    editorButtonMenus = editorButtonMenus ? JSON.parse(editorButtonMenus) : [];

    // Save setting via AJAX
    const saveEditorSetting = (field, value) => {
        showSpinner(); // Show spinner when saving
        $.post(ajaxurl, {
            action: ajaxWooAction,
            field,
            value,
            _wpnonce: nonce
        })
        .done(response => {
            if (response.success) {
                showSuccess(response.data.message); // Show success message
            } else {
                showError('An error occurred while saving the setting.');
            }
        })
        .fail(() => {
            showError('Failed to connect to the server. Please try again.');
        });
    };

    // Function to repopulate the dropdown with the updated menu list
    const refreshDropdown = () => {
        menuDropdown.empty(); // Clear current dropdown options
        editorButtonMenus.forEach((menu, index) => {
            menuDropdown.append(new Option(menu.name, index));
        });

        if (editorButtonMenus.length === 0) {
            menuDropdown.prop('disabled', true); // Disable dropdown if no items
            deleteButton.hide(); // Hide delete button if no menus left
            $('#assistant-menu-name, #assistant-menu-prompt').val('').prop('disabled', true); // Disable fields when no menus
        } else {
            menuDropdown.prop('disabled', false);
            menuDropdown.val(0).trigger('change'); // Select the first menu
            deleteButton.show(); // Show delete button if there are menus
            $('#assistant-menu-name, #assistant-menu-prompt').prop('disabled', false); // Enable fields when there are menus
        }
    };

    // Get the next "New Menu" number
    const getNextMenuNumber = () => {
        let maxNumber = 0;
        editorButtonMenus.forEach(menu => {
            const match = menu.name.match(/New Menu (\d+)/);
            if (match) {
                const number = parseInt(match[1], 10);
                if (number > maxNumber) {
                    maxNumber = number;
                }
            }
        });
        return maxNumber + 1; // Return the next available number
    };

    // Populate the menu dropdown
    const menuDropdown = $('#aipower-assistant-menu-select');
    const deleteButton = $('#aipower-delete-selected-menu');
    refreshDropdown();

    // Track whether the input has been changed
    let isChanged = false;

    // Function to load the selected menu details into the fields
    const loadSelectedMenuDetails = () => {
        const selectedMenuIndex = menuDropdown.val();
        const selectedMenu = editorButtonMenus[selectedMenuIndex];

        if (selectedMenu) {
            $('#assistant-menu-name').val(selectedMenu.name);
            $('#assistant-menu-prompt').val(selectedMenu.prompt);
            // Store initial values to track changes
            $('#assistant-menu-name').data('initial-value', selectedMenu.name);
            $('#assistant-menu-prompt').data('initial-value', selectedMenu.prompt);
        } else {
            $('#assistant-menu-name, #assistant-menu-prompt').val('').prop('disabled', true); // Disable fields if no menu selected
        }
    };

    // Load the selected menu details when a new menu is selected
    menuDropdown.on('change', loadSelectedMenuDetails);

    // Track changes when user types into the fields
    $('#assistant-menu-name, #assistant-menu-prompt').on('input', function () {
        isChanged = true; // Set isChanged to true when user types
    });

    // Save only if changes are made and field is not disabled
    const handleBlurSave = function () {
        const field = $(this);
        const initialValue = field.data('initial-value');
        const currentValue = field.val();

        // Only save if the value has changed (user has typed) and the field is enabled
        if (isChanged && currentValue !== initialValue && !field.prop('disabled')) {
            const selectedMenuIndex = $('#aipower-assistant-menu-select').val();
            editorButtonMenus[selectedMenuIndex][field.attr('id').replace('assistant-menu-', '')] = currentValue;

            // Save the updated menu
            saveEditorSetting('wpaicg_editor_button_menus', JSON.stringify(editorButtonMenus));
        }

        // Reset change tracking after save
        isChanged = false;
    };

    // Attach blur event to menu name and prompt fields
    $('#assistant-menu-name, #assistant-menu-prompt').on('blur', handleBlurSave);

    // Add new menu item with incremented name
    $('#aipower-add-new-menu').on('click', function () {
        const newMenuNumber = getNextMenuNumber(); // Get the next available number
        const newMenu = {
            name: `New Menu ${newMenuNumber}`, // Use the new number for the menu name
            prompt: ''
        };
        editorButtonMenus.push(newMenu);
        refreshDropdown();
        menuDropdown.val(editorButtonMenus.length - 1).trigger('change'); // Select the new menu
        saveEditorSetting('wpaicg_editor_button_menus', JSON.stringify(editorButtonMenus));
        $('#assistant-menu-name, #assistant-menu-prompt').prop('disabled', false); // Enable fields when a new menu is added
    });

    // Show confirmation message next to the delete button
    $('#aipower-delete-selected-menu').on('click', function () {
        $('#aipower-confirm-delete').show();
    });

    // Handle the confirmation of deletion when "Yes, Delete" is clicked
    $('#aipower-confirm-yes-delete').on('click', function () {
        const selectedMenuIndex = menuDropdown.val();

        if (selectedMenuIndex !== null) {
            editorButtonMenus.splice(selectedMenuIndex, 1); // Remove the selected menu
            refreshDropdown(); // Refresh the dropdown to reflect the deletion

            // Save the updated menu list
            saveEditorSetting('wpaicg_editor_button_menus', JSON.stringify(editorButtonMenus));

            $('#aipower-confirm-delete').hide(); // Hide the confirmation message after deletion
        }
    });

    // Hide confirmation if user clicks outside delete button or confirmation area
    $(document).on('click', function (event) {
        if (!$(event.target).closest('#aipower-delete-selected-menu, #aipower-confirm-delete').length) {
            $('#aipower-confirm-delete').hide(); // Hide the confirmation message
        }
    });

    // Function to update module navigation based on module settings
    function updateModuleNavigation(moduleSettings) {
        // Hide all navigation links
        $('.aipower-top-navigation li').hide();
        // Show navigation links for enabled modules
        $.each(moduleSettings, function(moduleKey, isEnabled) {
            if (isEnabled) {
                $('.aipower-top-navigation li[data-module="' + moduleKey + '"]').show();
            }
        });
    
        // Handle the 'chat_bot' module separately for the tab
        if (moduleSettings['chat_bot']) {
            $('.aipower-tab-btn[data-tab="chatbot"]').show();
        } else {
            $('.aipower-tab-btn[data-tab="chatbot"]').hide();
        }
    }
    

	// Check if moduleSettings is defined before initializing the navigation
	if (typeof moduleSettings !== 'undefined') {
		updateModuleNavigation(moduleSettings);
	}

    // Handle Module Settings checkbox changes
    $('[id^="module-"]').on('change', function() {
        var moduleKey = $(this).attr('id').replace('module-', '');
        var isEnabled = $(this).is(':checked');
        var nonce = $('#ai-engine-nonce').val();

        // Disable all checkboxes to prevent multiple changes
        $('[id^="module-"]').prop('disabled', true);

        // Show spinner
        showSpinner();

        // Send AJAX request to update module settings
        $.post(ajaxurl, {
            action: 'aipower_update_module_settings',
            module_key: moduleKey,
            enabled: isEnabled ? 1 : 0,
            _wpnonce: nonce
        }, function(response) {
            if (response.success) {
                // Update the moduleSettings variable with the updated settings
                moduleSettings = response.data.module_settings;

                // Update the module navigation and tabs based on updated settings
                updateModuleNavigation(moduleSettings);

                showSuccess(response.data.message);
            } else {
                showError(response.data.message || 'An error occurred while updating module settings.');
                // Revert the checkbox to its previous state
                $('[id="module-' + moduleKey + '"]').prop('checked', !isEnabled);
            }

            // Re-enable all checkboxes after the request completes
            $('[id^="module-"]').prop('disabled', false);
        }).fail(function() {
            showError('Failed to connect to the server. Please try again.');
            // Revert the checkbox to its previous state
            $('[id="module-' + moduleKey + '"]').prop('checked', !isEnabled);
            // Re-enable all checkboxes
            $('[id^="module-"]').prop('disabled', false);
        });
    });

    // -------------------- LOGIC: Sync ElevenLabs Voices --------------------
    $('#aipower_sync_voices_button').on('click', function () {
        var button = $(this);
        var icon = button.find('.dashicons');
        var nonce = $('#ai-engine-nonce').val();
        // Disable the button to prevent multiple clicks
        button.prop('disabled', true);
        icon.addClass('aipower-rotating'); // Add a rotating animation class if defined in CSS

        $.ajax({
            url: ajaxurl, // WordPress AJAX URL
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'wpaicg_sync_voices', // The AJAX action to trigger the backend function
                nonce: nonce // The nonce value to verify the request
            },
            success: function (response) {
                icon.removeClass('aipower-rotating'); // Stop the rotating animation
                button.prop('disabled', false); // Re-enable the button

                if (response.status === 'success') {
                    showSuccess(response.message); // Display success message
                } else {
                    showError(response.message || 'An error occurred while syncing voices.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                icon.removeClass('aipower-rotating'); // Stop the rotating animation
                button.prop('disabled', false); // Re-enable the button
                showError('Error: ' + errorThrown); // Display error message
            }
        });
    });
    // -------------------- LOGIC: Sync ElevenLabs Models --------------------
    $('#aipower_sync_models_button').on('click', function () {
        var button = $(this);
        var icon = button.find('.dashicons');
        var nonce = $('#ai-engine-nonce').val();

        // Disable the button to prevent multiple clicks
        button.prop('disabled', true);
        icon.addClass('aipower-rotating'); // Add a rotating animation class if defined in CSS

        $.ajax({
            url: ajaxurl, // WordPress AJAX URL
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'wpaicg_sync_models', // The AJAX action to trigger the backend function
                nonce: nonce // Pass the nonce for security
            },
            success: function (response) {
                icon.removeClass('aipower-rotating'); // Stop the rotating animation
                button.prop('disabled', false); // Re-enable the button

                if (response.status === 'success') {
                    showSuccess(response.message); // Display success message
                } else {
                    showError(response.message || 'An error occurred while syncing models.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                icon.removeClass('aipower-rotating'); // Stop the rotating animation
                button.prop('disabled', false); // Re-enable the button
                showError('Error: ' + errorThrown); // Display error message
            }
        });
    });

    // -------------------- LOGIC: Sync Google Voices --------------------
    $('#aipower_sync_google_voices_button').on('click', function () {
        var button = $(this);
        var icon = button.find('.dashicons');
        var nonce = $('#ai-engine-nonce').val();

        // Disable the button to prevent multiple clicks
        button.prop('disabled', true);
        icon.addClass('aipower-rotating'); // Add a rotating animation class if defined in CSS

        $.ajax({
            url: ajaxurl, // WordPress AJAX URL
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'wpaicg_sync_google_voices', // The AJAX action to trigger the backend function
                nonce: nonce // Pass the nonce for security
            },
            success: function (response) {
                icon.removeClass('aipower-rotating'); // Stop the rotating animation
                button.prop('disabled', false); // Re-enable the button

                if (response.status === 'success') {
                    showSuccess(response.msg); // Display success message (backend uses 'msg')
                } else {
                    showError(response.msg || 'An error occurred while syncing Google voices.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                icon.removeClass('aipower-rotating'); // Stop the rotating animation
                button.prop('disabled', false); // Re-enable the button
                showError('Error: ' + errorThrown); // Display error message
            }
        });
    });
    // Handle toggle switch for default site-wide widget
    $(document).on('click', '.aipower-toggle-switch', function () {
        var $switch = $(this);
        var currentStatus = $switch.data('status'); // 'active' or ''
        var newStatus = currentStatus === 'active' ? '' : 'active';
        var nonce = $('#ai-engine-nonce').val();

        // Optional: Show spinner or some feedback
        showSpinner();

        // AJAX request to update the widget status
        $.post(ajaxurl, {
            action: 'aipower_toggle_default_widget_status',
            status: newStatus,
            _wpnonce: nonce
        }, function (response) {
            if (response.success) {
                // Update the switch's data-status attribute
                $switch.data('status', newStatus);
                
                // Toggle the active class for color change
                if (newStatus === 'active') {
                    $switch.removeClass('inactive').addClass('active');
                } else {
                    $switch.removeClass('active').addClass('inactive');
                }

                showSuccess(response.data.message);
            } else {
                showError(response.data.message || 'Failed to update widget status.');
            }
        }).fail(function () {
            showError('Failed to connect to the server. Please try again.');
        });
    });

	$( document ).on("click", "#wpcgai_load_draft_settings", function(event) {
		event.preventDefault();
		var wpai_preview_title = $("#wpai_preview_title").val();
		$(".editor-post-title").text(wpai_preview_title); 
		$("input#title").val(wpai_preview_title);  		
		
			jQuery('.editor-post-title').focus();
			
			setTimeout(function(){ 
				$("input#save-post").click();  
				$(".editor-post-save-draft").click(); 
				setTimeout(function(){
					if($('#editor').hasClass('block-editor__container')){
					   //location.reload(true); 
					   var post_id___ = $('#post_ID').val();
						var con__ = $("#wpcgai_preview_box").val()
						var data__ = {
							'action' : 'wpaicg_set_post_content_',
							'content':con__,
							'post_id':post_id___
						}
						$.post(ajaxurl, data__, function(response__) {

							location.reload(true);

						});
					}
					
				}, 1000); 
			}, 500);  
  
	});

})( jQuery );
