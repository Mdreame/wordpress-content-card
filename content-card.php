<?php
/**
 * Plugin Name: Content Card
 * Description: 一个用于在文章中展示内容卡片的自定义区块。
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL2+
 * Text Domain: content-card
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 注册 Content Card 区块
 */
function content_card_register_block() {
    // 自动加载所有必要的资产（JS, CSS, block.json）
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'content_card_register_block' );

/**
 * 加载前端所需的样式
 * 注意：由于 register_block_type( __DIR__ . '/src' ) 会自动加载 style.css，
 * 但为了保证自定义的 CSS 样式（特别是背景图片路径）能正确加载，
 * 并且覆盖可能需要的全局样式，我们也可以通过 wp_enqueue_style 显式加载。
 * * 在此示例中，假设您将所有样式放在 src/style.css 中，
 * register_block_type 默认已处理。
 * * 如果您的 CSS 中使用了相对路径的图片，请确保路径正确。
 * 例如，对于您的 .allstarlight background-image，最好使用绝对 URL 或 data URI。
 */
function content_card_enqueue_styles() {
    // 假设您的 star.svg 在插件目录下的 assets/img/star.svg
    // 您需要将 style.css 中的相对路径调整为使用 plugins_url() 获取的绝对路径。
    // 在这里我们只加载一个包含所有自定义卡片样式的样式表
    wp_enqueue_style(
        'content-card-style',
        plugins_url( 'src/style.css', __FILE__ ),
        array(),
        '1.0.0'
    );
}
add_action( 'wp_enqueue_scripts', 'content_card_enqueue_styles' );
// 也为编辑器加载样式
add_action( 'admin_enqueue_scripts', 'content_card_enqueue_styles' );