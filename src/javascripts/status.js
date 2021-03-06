var Status = {
  CornerThickness: 12,
  SpinnerImage: '/images/status_spinner.gif',
  SpinnerImageWidth: 32,
  SpinnerImageHeight: 33,
  BackgroundImage: '/images/status_background.png',
  TopLeftImage: '/images/status_top_left.png',
  TopRightImage: '/images/status_top_right.png',
  BottomLeftImage: '/images/status_bottom_left.png',
  BottomRightImage: '/images/status_bottom_right.png',
  MessageFontFamily: '"Trebuchet MS", Verdana, Arial, Helvetica, sans-serif',
  MessageFontSize: '14px',
  MessageColor: '#e5e5e5',
  Modal: false,
  ModalOverlayColor: 'white',
  ModalOverlayOpacity: 0.4
};

Status.window = function() {
  if (!this.statusWindow) this.statusWindow = new Status.Window();
  return this.statusWindow;
}

Status.BackgroundImages = function() {
  return $A([
    Status.SpinnerImage,
    Status.BackgroundImage,
    Status.TopLeftImage,
    Status.TopRightImage,
    Status.BottomLeftImage,
    Status.BottomRightImage
  ]);
}

Status.preloadImages = function() {
  if (!Status.imagesPreloaded) {
    Status.BackgroundImages().each(function(src) {
      var image = new Image();
      image.src = src;
    });
    Status.preloadedImages = true;
  }
}

Status.FormBehavior = Behavior.create({
  initialize: function() {
    var attr = this.element.attributes['onsubmit_status']
    if (attr) this.status = attr.value; 
    if (this.status) this.element.observe('submit', function() { showStatus(this.status) }.bind(this));
  }
});

Status.LinkBehavior = Behavior.create({
  initialize: function() {
    var attr = this.element.attributes['onclick_status']
    if (attr) this.status = attr.value; 
    if (this.status) this.element.observe('click', function() { showStatus(this.status) }.bind(this));
  }
});

Status.Window = Class.create({
  initialize: function() {
    Status.preloadImages();
    this.buildWindow();
  },
  
  buildWindow: function() {
    this.element = $table({'class': 'status_window', style: 'display: none; position: absolute; border-collapse: collapse; padding: 0px; margin: 0px; z-index: 10000'});
    var tbody = $tbody();
    this.element.insert(tbody)
    
    var top_row = $tr();
    top_row.insert($td({style: 'background: url(' + Status.TopLeftImage + '); height: ' + Status.CornerThickness + 'px; width: ' + Status.CornerThickness + 'px; padding: 0px'}));
    top_row.insert($td({style: 'background: url(' + Status.BackgroundImage + '); height: ' + Status.CornerThickness + 'px; padding: 0px'}))
    top_row.insert($td({style: 'background: url(' + Status.TopRightImage + '); height: ' + Status.CornerThickness + 'px; width: ' + Status.CornerThickness + 'px; padding: 0px'}));
    tbody.insert(top_row);
    
    var content_row = $tr();
    content_row.insert($td({style: 'background: url(' + Status.BackgroundImage + '); width: ' + Status.CornerThickness + 'px; padding: 0px'}, ''));
    this.content = $td({'class': 'status_content', style: 'background: url(' + Status.BackgroundImage + '); padding: 0px ' + Status.CornerThickness + 'px'});
    content_row.insert(this.content);
    content_row.insert($td({style: 'background: url(' + Status.BackgroundImage + '); width: ' + Status.CornerThickness + 'px; padding: 0px'}, ''));
    tbody.insert(content_row);
    
    var bottom_row = $tr();
    bottom_row.insert($td({style: 'background: url(' + Status.BottomLeftImage + '); height: ' + Status.CornerThickness + 'px; width: ' + Status.CornerThickness + 'px; padding: 0px'}));
    bottom_row.insert($td({style: 'background: url(' + Status.BackgroundImage + '); height: ' + Status.CornerThickness + 'px; padding: 0px'}))
    bottom_row.insert($td({style: 'background: url(' + Status.BottomRightImage + '); height: ' + Status.CornerThickness + 'px; width: ' + Status.CornerThickness + 'px; padding: 0px'}));
    tbody.insert(bottom_row);
    
    this.spinner = $img({src: Status.SpinnerImage, width: Status.SpinnerImageWidth, height: Status.SpinnerImageHeight, alt: ''});
    this.status = $div({'class': 'status_message', style: 'color: ' + Status.MessageColor + '; font-family: ' + Status.MessageFontFamily + '; font-size: ' + Status.MessageFontSize});
    
    var table = $table({border: 0, cellpadding: 0, cellspacing: 0, style: 'table-layout: auto'},
      $tbody(
        $tr(
          $td({style: 'width: ' + Status.SpinnerImageWidth + 'px'}, this.spinner),
          $td({style: 'padding-left: ' + Status.CornerThickness + 'px'}, this.status)
        )
      )
    );
    this.content.insert(table);
    
    var body = $$('body').first();
    body.insert(this.element);
  },
  
  setStatus: function(value) {
    this.status.update(value)
  },
  
  getStatus: function() {
    return this.status.innerHTML();
  },
  
  show: function(modal) {
    this.centerWindowInView();
    if (modal || Status.Modal) this._showModalOverlay();
    this.element.show();
  },
  
  hide: function() {
    this._hideModalOverlay();
    this.element.hide();
  },
  
  toggle: function() {
    if (this.visible()) {
      this.hide();
    } else {
      this.show();
    }
  },
  
  visible: function() {
    return this.element.visible();
  },
  
  centerWindowInView: function() {
    var offsets = document.viewport.getScrollOffsets();
    this.element.setStyle({
      left: parseInt(offsets.left + (document.viewport.getWidth() - this.element.getWidth()) / 2) + 'px',
      top: parseInt(offsets.top + (document.viewport.getHeight() - this.element.getHeight()) / 2.2) + 'px'
    });
  },
  
  _showModalOverlay: function() {
    if (!this.overlay) {
      this.overlay = $div({style: 'position: absolute; background-color: ' + Status.ModalOverlayColor + '; top: 0px; left: 0px; z-index: 100;'});
      this.overlay.setStyle('position: fixed');
      this.overlay.setOpacity(Status.ModalOverlayOpacity);
      document.body.insert(this.overlay);
    }
    this.overlay.setStyle('height: ' + document.viewport.getHeight() + 'px; width: ' + document.viewport.getWidth() + 'px;');
    this.overlay.show();
  },
  
  _hideModalOverlay: function() {
    if (this.overlay) this.overlay.hide();
  }
});

Event.observe(document, 'dom:loaded', function() {
  Status.preloadImages();
});

// Sets the status to string
function setStatus(string) {
  Status.window().setStatus(string);
  if (Status.window().visible()) Status.window().centerWindowInView();
}

// Sets the status to string and shows the status window. If modal is passed
// as true a white transparent div that covers the entire page is positioned
// under the status window causing a diming effect and preventing stray mouse
// clicks.
function showStatus(string, modal) {
  setStatus(string);
  Status.window().show(modal);
}

// Hides the status window
function hideStatus() {
  Status.window().hide();
}