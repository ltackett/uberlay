(function($){
    $.uberlay = function(el, options){

        // Setup
        // ====================================================================

        // To avoid scope issues, use 'plugin' instead of 'this'
        // to reference this class from internal events and functions.
        var plugin = this;
        
        // Access to jQuery and DOM versions of element
        plugin.$el = $(el);
        plugin.el = el;
        
        // Add a reverse reference to the DOM object
        plugin.$el.data("uberlay", plugin);

        // INIT
        // ====================================================================
        
        plugin.init = function(){
          plugin.options = $.extend({},$.uberlay.defaultOptions, options);
          plugin.$el.trigger("uberlay.init");

          // Main DIVs
          // ==================================================================

          plugin.uberlayDiv = $("<div class='uberlay'></div>").appendTo("body");
          plugin.uberlayBox = $("<div class='uberlay-box'></div>").appendTo(plugin.uberlayDiv);

          // Attach classes and IDs to uberlayBox
          // ==================================================================
          
          // Check data attrs for ID
          if (plugin.$el.data('uberlay-id')) {
            plugin.uberlayBox.attr('id', plugin.$el.data('uberlay-id'));
          } else {
            if (plugin.options.id) { plugin.uberlayBox.attr('id', plugin.options.id); }
          }

          // Check data attrs for Class
          if (plugin.$el.data('uberlay-class')) {
            plugin.uberlayBox.attr('id', plugin.$el.data('uberlay-class'));
          } else {
            plugin.uberlayBox.addClass(plugin.options.class);
          }

          // Main click handler
          // ==================================================================
          plugin.$el.on('click', function(e){
            e.preventDefault();

            // Empty .uberlay-box for any incoming data
            plugin.uberlayBox.empty();

            // Inject content into uberlayBox
            // ================================================================

            // If content is passed in via the options, inject now.
            if (plugin.options.content) {
              plugin.showUberlay();
              plugin.uberlayBox.html(plugin.options.content);
            }

            // Otherwise, inject content via AJAX request
            else {
              plugin.dataLoading();
              $.ajax({
                url: plugin.$el.attr('href'),
                success: function(data) {
                  // Fake a longer load with setTimeout
                  setTimeout(function(){
                    plugin.uberlayBox.html(data);
                    plugin.dataLoaded();
                  }, 500);
                }
              });
            }
          });

          // Hide overlay if underlayer is clicked
          // ==================================================================
          plugin.uberlayDiv.on('click', function(e) {
            if (e.currentTarget === e.target) {
              plugin.hideUberlay();
            }
          });
        };

        // Private Methods
        // ====================================================================

        plugin.showUberlay = function() {
          plugin.uberlayDiv.addClass('active')
          plugin.uberlayDiv.addClass("animate");
          plugin.$el.trigger("uberlay.open");
        };

        plugin.hideUberlay = function() {
          plugin.uberlayDiv.removeClass("animate");

          setTimeout(function() {
            plugin.uberlayDiv.removeClass("active");
            plugin.$el.trigger("uberlay.close");
          }, plugin.options.delay);
        };

        plugin.dataLoading = function() {
          plugin.showUberlay();
          plugin.uberlayDiv.addClass("loading");
          plugin.$el.trigger("uberlay.dataLoading");
        };

        plugin.dataLoaded = function() {
          plugin.uberlayDiv.removeClass("loading");
          plugin.uberlayDiv.addClass("loaded");
          plugin.$el.trigger("uberlay.dataLoaded");
        };
        
        // Run initializer
        plugin.init();
    };

    // Default Options
    // ========================================================================
    
    $.uberlay.defaultOptions = {
        delay:   300,
        content: false,
        id:      false,
        class:   "default-overlay"
    };

    // Register plugin
    // ========================================================================
    
    $.fn.uberlay = function(options){
        return this.each(function(){
            (new $.uberlay(this, options));
        });
    };

    // Getter
    // ========================================================================
    
    // This function breaks the chain, but returns
    // the uberlay if it has been attached to the object.
    $.fn.getuberlay = function(){
        this.data("uberlay");
    };
    
})(jQuery);