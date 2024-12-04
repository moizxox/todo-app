function add_loader_html() {
    ?>
    <!-- Loader HTML -->
    <div class="loader-main">
  <div class="three-body">
    
  </div>
  </div>
    <?php
}
add_action('wp_body_open', 'add_loader_html');

function add_loader_styles_and_scripts() {
    ?>
    <style>
        .loader-main {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white; 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

 
 
  .hide-loader {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
    </style>
    <script>
        window.addEventListener("load", () => {
    const loader = document.querySelector(".loader-main");
    setTimeout(() => {
      loader.classList.add("hide-loader"); 
    }, 100); 
  });
    </script>
    <?php
}
add_action('wp_head', 'add_loader_styles_and_scripts');