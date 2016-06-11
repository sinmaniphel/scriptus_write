import StoryBoardManager from './storyboard/manager'

var list_url = $('#scene-service-url').data('url');
var sb_manager = new StoryBoardManager(list_url);
sb_manager.init();





