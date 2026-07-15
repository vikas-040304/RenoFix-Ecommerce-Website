===AI Power: Complete AI Pack===
Contributors: senols
Tags: chatbot, ai, content writer, openai, chatgpt
Requires at least: 5.0.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.8.92
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
 
Chatbot, Content Writer, Auto Content Writer, Product Writer, Image Generator, Audio Converter, AI Training, Embeddings and more.
 
== Description ==

AI Power is an all-in-one AI solution for WordPress, featuring models like OpenAI's GPT-4 and GPT-3.5, along with Claude, Gemini, Azure, Grok, Mistral, LLaMA, Yi Chat, and Alpaca.

It uses o1-mini, o1-preview, GPT-3.5, GPT-4,  GPT-4o, GPT-4o-mini, GPT-4 Vision, Gemini 1.5 Flash, Anthropic (Claude 3 Sonnet, Opus etc.) and more to generate content, images, and forms with customizable options. It includes AI training, Chat widget, WooCommerce integration, Embeddings and more.

Please read documentation here: [https://docs.aipower.org/](https://docs.aipower.org/)

== Core Features ==
* Multiple AI providers (OpenAI, Microsoft Azure, Google and OpenRouter)
* Latest AI models (GPT-4, Claude, Gemini, Llama, Grok and more)
* Chatbot
* Content writer
* Bulk writer
- WooCommerce product writer
* Image Generator (DALL-E, Stable Diffusion 🚀🚀🚀, Flux and more)
* PDF Chat
* AI Assistant (Integrated with Gutenberg and Classic Editor)
* AI Training (Pinecone and Qdrant integrated)
* Fine tuning
* Audio Converter
* Embeddings
* AI Forms - Design your own forms and embed them into your website
* Playground
* SEO Optimizer
* Semantic search with Embeddings
* Pexels, Pixabay, Replicate integrated
* Scheduled Posts
* Speech-to-Post (Whisper)
* Text-to-Speech (ElevenLabs)
* Text-to-Speech (Google)
* Role Manager
* Token management
* Comment Replier
* Twitter bot

== Integrations ==

- OpenAI: Use GPT models, Whisper and text to speech for advanced AI capabilities.
- OpenRouter: All models on OpenRouter are accesible via our plugin.
- Azure OpenAI: If you dont have OpenAI API access, you can use Azure.
- Google: Gemini Pro, Gemini 1.0, Gemini 1.5 Flash and Gemini 1.5 Pro langauge models.
- Open Source LLMs: Mistral, LLaMA, Yi Chat, Alpaca.
- SEO Tools: Optimize your content with Yoast SEO, All In One SEO, Rank Math and The SEO Framework.
- Image Libraries: Enhance your visuals with Pexels and Pixabay integration.
- Image Generators: Create unique images using DALL-E and Stable Diffusion.
- Vector Databases: Build engaging content and implement long-term external memory for chatbots.
- E-commerce: Improve product descriptions with WooCommerce integration.
- Google Sheets: Streamline data management and organization.
- RSS Feeds: Stay updated with the latest content from your favorite sources.
- Text-to-Speech: Convert your text into lifelike speech with ElevenLabs, Google and OpenAI Text-to-Speech integrations.

== Installation ==
 
1. Upload `gpt3-ai-content-generator.zip` to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Setup OpenAI API key.
4. Setup temperature, max tokens, best of, frequenct penalty.
5. Go to content writer.
6. Enter title, for example: Tesla Electric cars.
7. Enter number of headings, for example: 7
8. Click generate.
9. Save.

== Screenshots ==

1. Settings
2. Classic Editor
3. Block Editor
4. Benchmark Results
 
Note: You can view non-Minified JS files [here](https://github.com/aipowerorg/Non-Minified-JS-Files).

== Changelog ==

= 1.8.92 =

This release includes several improvements.

= 1.8.91 =

- Updated third-party libraries.
- Added WordPress 6.7 compatibility
- Security fixes.

= 1.8.90 =

This release includes several improvements and security patches.

= 1.8.89 =

- New moderation model added: omni-moderation-latest
- Fixed issues with widget preview display.
- Fixed widget toggle functionality.
- Fixed chatbot duplication.

= 1.8.88 =

- Updated third-party libraries to the latest versions.
- Fixed an issue with OpenRouter streaming.
- Fixed console error occurrences.
- Removed unused functions for optimization.

= 1.8.87 =

- Lead Collection added for chat bot. You can now collect leads and view them under the Logs tab.

= 1.8.86 =

- Few tweaks to the new dashboard.
- Fixed log saving issue.
- Added token/cost details.
- Tweaked o1 model handling.

= 1.8.85 =

- Few tweaks to the new dashboard.
- Added Export, Import, and Duplicate options for chatbots.
- Fixed issue where instructions were sent with chat messages.

= 1.8.84 =

- New UI. This is a major update. Please make sure to clear your entire cache.

= 1.8.83 =

- New UI. This is a major update. Please make sure to clear your entire cache.

= 1.8.82 =

- New UI. This is a major update. Please make sure to clear your entire cache.
- Fixed AI Forms new line issue.

= 1.8.81 =

- Performance improvements in scheduled jobs.

= 1.8.80 =

- Improved memory management for the chatbot, allowing higher memory limits for longer conversation history.
- Fixed an issue where the bot occasionally failed to remember previous conversations.
- Now we are sending user queries via form submission instead of the URL, removing URL length limitations in the chat bot while using streaming.
- Fixed encoding issues for non-Latin languages like Ukrainian and Russian.
- Export logs now verify proper permissions for the uploads folder.
- Improved handling of the o1 model by bypassing unsupported parameters such as top_p, frequency and presence penalties, and streaming. Check o1 models limitations [here](https://docs.aipower.org/docs/ai-engine/openai/gpt-models#o1-models-beta).

= 1.8.79 =

- Added support for the o1-preview and o1-mini models. Please note that access to these models requires your organization to be at usage tier 5 or higher. See [usage tiers](https://platform.openai.com/docs/guides/rate-limits/usage-tiers) for more details. If you are accessing o1-preview or o1-mini via OpenRouter, make sure to disable streaming.
- Users can now enable or disable audio directly from the chat interface. More information [here](https://docs.aipower.org/docs/ChatGPT/advanced-setup/voice-chat).
- Fixed a spacing issue in AI Form outputs for consistent formatting.
- Updated chat logs to use current_time('timestamp') instead of time() for more accurate local time records.
- Added a "Limits" button to check OpenRouter usage and credits.

= 1.8.78 =

- Added new "Copy" and "Feedback" features for the chatbot. For more details, refer to the [documentation](https://docs.aipower.org/docs/ChatGPT/advanced-setup/feedback-collection)
- Optimized the log retrieval process in the Chat Log tab for better performance.
- Added the ability to block IP addresses directly from the log table.
- Fixed hyperlink, markdown and some formatting issues in the chat bot.
- Added an "Empty Log Table" option under Chat Settings - Performance tab to quickly clear the log table when it grows too large.
- Improved bulk user retrieval, now excluding subscribers for AutoGPT.
- SDK update.

**Note:** If you're using a caching plugin, please remember to clear your site cache to ensure that the changes take effect.

= 1.8.77 =

[New]

- Added support for new image models: Flux, SDXL, Kandinsky, and more for text-to-image generation across Content Writer, AutoGPT, and Image Generator modules.

For more details, refer to the [documentation](https://docs.aipower.org/docs/content-writer/express-mode/images#replicate)

[Improvements]

- Better markdown support for chat bot.
- Fixed broken links in chat response.

**Note:** If you're using a caching plugin, please remember to clear your site cache to ensure that the changes take effect.