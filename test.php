add_action('wp_enqueue_scripts', function() {
    if (!class_exists('\Elementor\Core\Files\CSS\Post')) {
        return;
    }

    // Array of template IDs
    $template_ids = [
        682,989  
    ];

    // Enqueue CSS files for each template ID
    foreach ($template_ids as $template_id) {
        $css_file = new \Elementor\Core\Files\CSS\Post($template_id);
        $css_file->enqueue();
    }
}, 500);
