var SP2013QLAccordion = {

  // Options
  useAnimation: true, // Animation is supported in IE9+
  collapseOtherLevels: false, // Collapse sibling levels on expanding
  expandTransition: 'height 0.15s ease-out',
  collapseTransition: 'height 0.15s ease-out',

  // Initialization function
  init: function (){
    var levels = document.querySelectorAll('.ms-core-listMenu-verticalBox li');

    if (levels.length) {
      for (var i = 0; i < levels.length; i++) {
        if (levels[i].querySelector('ul')) {

          // Create switch elements and append them to levels with sublevels
          var switchSpan = document.createElement('div');

          switchSpan.className = 'switch';
          switchSpan.innerHTML = '<span><img alt="" src="/_layouts/15/images/spcommon.png"/></span>';
          levels[i].insertBefore(switchSpan, levels[i].firstChild);

          // Add 'expanded' class to selected branch and 'collapsed' to all other
          levels[i].className += (levels[i].querySelector('.selected') || levels[i].className.indexOf('selected') != -1) ? ' expanded' : ' collapsed';
        }
      }

      // Detect IE8 or lower to turn off animation
      if (document.all && !document.addEventListener) SP2013QLAccordion.useAnimation = false;

      var switches = document.querySelectorAll('.ms-core-listMenu-verticalBox .switch');
      // Add collapse/expand event to switch nodes
      if (switches.length) {
        for (var j = 0; j < switches.length; j++) {
          AddEvent(switches[j], 'click', ExpandCollapse);
        }
      }
    }

    // Function to get height of a hidden node
    function CalculateHeight (node) {
      var initialStyles = node.style.cssText,
        nodeHeight;

      node.style.position = 'absolute';
      node.style.visibility = 'hidden';
      node.style.height = 'auto';
      nodeHeight = node.offsetHeight;
      node.style.cssText = initialStyles;
      return nodeHeight;
    }

    // Expand/Collapse function
    function ExpandCollapse (param) {
      var level = this.parentNode,
        sublevel = level.querySelector('ul'),
        sublevelHeight = CalculateHeight(sublevel),
        otherLevels = level.parentElement.children;

      // Close other levels on expanding
      if (SP2013QLAccordion.collapseOtherLevels && level.className.indexOf('collapsed') != -1 && !param) {
        for (var i = 0; i < otherLevels.length; i++) {
          if (otherLevels[i].className.indexOf('expanded') != -1) ExpandCollapse.call(otherLevels[i], 'collapse');
        }
      }

      if (SP2013QLAccordion.useAnimation) {
        // Animated collapse
        if (level.className.indexOf('expanded') != -1 || param == 'collapse') {
          sublevel.style.height = sublevelHeight + 'px';
          level.className = level.className.replace(' expanded',' collapsed');
          sublevel.style.transition = SP2013QLAccordion.collapseTransition;
          sublevel.offsetHeight; // Force repaint
          sublevel.style.height = 0;
        // Animated expand
        } else {
          sublevel.style.height = 0;
          level.className = level.className.replace(' collapsed',' expanded');
          sublevel.style.transition = SP2013QLAccordion.expandTransition;
          sublevel.offsetHeight; // Force repaint
          sublevel.style.height = sublevelHeight + 'px';
          sublevel.addEventListener('transitionend', function transitionEnd(event) {
            if (event.propertyName == 'height') {
              sublevel.removeAttribute('style');
              sublevel.removeEventListener('transitionend', transitionEnd, false);
            }
          }, false);
        }
      } else {
        // Not animated collapse
        if (level.className.indexOf('expanded') != -1 || param == 'collapse') {
          level.className = level.className.replace(' expanded',' collapsed');
        // Not animated expand
        } else {
          level.className = level.className.replace(' collapsed',' expanded');
        }
      }
    }

    // Crossbrowser event attachment helper function
    function AddEvent (htmlElement, eventName, eventFunction) {
      if (htmlElement.attachEvent)
        htmlElement.attachEvent("on" + eventName, function() {eventFunction.call(htmlElement);});
      else if (htmlElement.addEventListener)
        htmlElement.addEventListener(eventName, eventFunction, false);
    }
  }
};

// SharePoint default DOM onLoad function
ExecuteOrDelayUntilBodyLoaded(SP2013QLAccordion.init);
