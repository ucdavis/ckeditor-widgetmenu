(() => {
  'use strict';

  const widgetName = 'widget_menu';

  CKEDITOR.plugins.add(widgetName, {
    requires: 'menu',

    // Register the icon used for the toolbar button. It must be the same
    // as the name of the widget.
    icons: widgetName,
    hidpi: true,

    init(editor) {
      editor.addMenuGroup(widgetName);

      editor.ui.add(widgetName, CKEDITOR.UI_MENUBUTTON, {
        label: 'Insert Widget',
        icon: this.path + 'icons/widget_menu.png',
        onMenu() {
          const widgets = getWidgetsInGroup(editor);

          const returnObj = {}
          widgets.forEach(widget => {
            const command = editor.getMenuItem(widget).command;
            returnObj[widget] = editor.getCommand(command).state
          })

          return returnObj;
        }
      });
    },

    afterInit(editor) {
      // Add the buttons for this menu after the init to make sure all the
      // buttons have already loaded.
      const widgets = getWidgetsInGroup(editor);

      const items = {};
      widgets.forEach(widget => {
        const button = editor.ui.items[widget];
        if (button) {
          items[widget] = {
            group: widgetName,
            label: button.label,
            command: button.command,
            icon: button.icon
          }
        }
      })

      editor.addMenuItems(items);

      // Remove the buttons from the normal display since we will stick them in
      // this dropdown menu instead.
      editor.config.removeButtons = widgets.join(',')
    }
  });

  /**
   * Get the other widget buttons added in the group with this plugin.
   *
   * @param editor
   *
   * @return {array|boolean} List of widgets in the group
   */
  function getWidgetsInGroup(editor) {
    // Determine which group this plugin has been placed into.
    const group = editor.config.toolbar.find(group => {
      if (group.items) {
        return group.items.find(key => key === widgetName);
      }
      return false;
    })

    // Get the other widgets added in this group.
    return group.items.filter(item => item !== widgetName);
  }
})();
