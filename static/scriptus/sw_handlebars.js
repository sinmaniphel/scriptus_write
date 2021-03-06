define(['handlebars'], function(Handlebars) {

this["ScriptusTemplates"] = this["ScriptusTemplates"] || {};

this["ScriptusTemplates"]["sw_sc_charas"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression;

  return "     <li class=\"list-group-item\" id=\"sc_pl_ch_cnt\" >\n       <details>\n       <summary>\n       <span class=\"badge\">"
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.chara_gender : depth0)) != null ? stack1.gender_name : stack1), depth0))
    + "</span>\n       "
    + alias1(((helper = (helper = helpers.chara_whole_name || (depth0 != null ? depth0.chara_whole_name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"chara_whole_name","hash":{},"data":data}) : helper)))
    + "</summary>\n       </details>\n    </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"panel-heading\">\n    <h3 class=\"panel-title\" id=\"scene_title\">Characters</h3>\n    </h3>\n</div>\n<ul class=\"list-group\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.result : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"useData":true});

this["ScriptusTemplates"]["sw_sc_li"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "  data-start=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.timeframe : depth0)) != null ? stack1.tf_start : stack1), depth0))
    + "\"\n  data-end=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.timeframe : depth0)) != null ? stack1.tf_end : stack1), depth0))
    + "\"\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "      Start : "
    + alias3((helpers.formatDate || (depth0 && depth0.formatDate) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.timeframe : depth0)) != null ? stack1.tf_start : stack1),{"name":"formatDate","hash":{"minute":"numeric","hour":"numeric","year":"numeric","month":"long","day":"numeric"},"data":data}))
    + "\n      <br/>\n      End : "
    + alias3((helpers.formatDate || (depth0 && depth0.formatDate) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.timeframe : depth0)) != null ? stack1.tf_end : stack1),{"name":"formatDate","hash":{"minute":"numeric","hour":"numeric","year":"numeric","month":"long","day":"numeric"},"data":data}))
    + "\n      \n";
},"5":function(container,depth0,helpers,partials,data) {
    return "      Not dated yet\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<a class=\"list-group-item sw_dated_scene_item sw_scene_item\"\n  data-scid=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"\n  data-title=\""
    + alias4(((helper = (helper = helpers.scene_title || (depth0 != null ? depth0.scene_title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"scene_title","hash":{},"data":data}) : helper)))
    + "\"\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.scene : depth0)) != null ? stack1.timeframe : stack1)) != null ? stack1.tf_start : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  data-url=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\"\n  >\n      \n  <h4 class=\"list-group-item-heading\">"
    + alias4(((helper = (helper = helpers.scene_title || (depth0 != null ? depth0.scene_title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"scene_title","hash":{},"data":data}) : helper)))
    + "</h4>\n  <p class=\"list-group-item-text\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.timeframe : depth0)) != null ? stack1.tf_start : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "      \n  </p>\n</a>\n";
},"useData":true});

this["ScriptusTemplates"]["sw_sc_main_pannel"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "       \n      <span class=\"label label-success\" id=\"sc_dt_start\">"
    + alias3((helpers.formatDate || (depth0 && depth0.formatDate) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.timeframe : depth0)) != null ? stack1.tf_start : stack1),{"name":"formatDate","hash":{"minute":"numeric","hour":"numeric","year":"numeric","month":"short","day":"numeric"},"data":data}))
    + "\n      </span>\n      <span class=\"label label-danger\" id=\"sc_dt_end\">"
    + alias3((helpers.formatDate || (depth0 && depth0.formatDate) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.timeframe : depth0)) != null ? stack1.tf_end : stack1),{"name":"formatDate","hash":{"minute":"numeric","hour":"numeric","year":"numeric","month":"short","day":"numeric"},"data":data}))
    + "\n      </span>\n\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "       <div class='input-group date'\n        id='sc_datetimepicker'\n        >\n        <input type='text' class=\"form-control\" />\n        <span class=\"input-group-addon\">\n          <span class=\"glyphicon glyphicon-calendar\"></span>\n        </span>\n      </div>\n   \n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "  <div class=\"panel-heading\">\n    <h3 class=\"panel-title\" id=\"scene_title\">"
    + alias4(((helper = (helper = helpers.scene_title || (depth0 != null ? depth0.scene_title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"scene_title","hash":{},"data":data}) : helper)))
    + "\n    </h3>\n  </div>\n  <div class=\"panel-body\" id=\"sc_date_content\" >\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.timeframe : depth0)) != null ? stack1.tf_start : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "  </div>\n  <ul class=\"list-group\">\n    <li class=\"list-group-item\"\n      id=\"sc_pl_ch_cnt\"\n      data-url=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.characters : depth0)) != null ? stack1.url : stack1), depth0))
    + "\"\n      <span class=\"badge\">"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.characters : depth0)) != null ? stack1.count : stack1), depth0))
    + "</span>\n      Characters\n    </li>\n  </ul>    \n  <ul class=\"list-group\">\n    <li class=\"list-group-item\" id=\"scene_content\">\n      <details>\n      <summary>Show scene text</summary>\n      "
    + ((stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n      </detail>\n  </ul>    ";
},"useData":true});

this["ScriptusTemplates"]["sw_sc_pg"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "  <li class=\"previous\" \">\n    <a id=\"sw_sc_prev\"\n      class=\"sw_sc_pg_ctrl\"\n      data-url=\""
    + container.escapeExpression(((helper = (helper = helpers.previous || (depth0 != null ? depth0.previous : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"previous","hash":{},"data":data}) : helper)))
    + "\"\n      >\n    \n";
},"3":function(container,depth0,helpers,partials,data) {
    return "    <li class=\"disabled\">\n      <a >\n";
},"5":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "      \n      <li>\n        <a data-url=\""
    + alias2(alias1((depth0 != null ? depth0.url : depth0), depth0))
    + "\"\n          class=\"sw_sc_pg_ctrl\"\n          >\n          "
    + alias2(alias1((depth0 != null ? depth0.page : depth0), depth0))
    + "\n        </a>\n      </li>\n\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "  <li class=\"next\"\n     >\n     <a id=\"sw_sc_next\"\n       data-url=\""
    + container.escapeExpression(((helper = (helper = helpers.next || (depth0 != null ? depth0.next : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"next","hash":{},"data":data}) : helper)))
    + "\"\n       class=\"sw_sc_pg_ctrl\">\n    \n   \n";
},"9":function(container,depth0,helpers,partials,data) {
    return "    <li class=\"disabled\">\n      <a id=\"sw_sc_next\">\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.previous : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "      <span aria-hidden=\"true\">&laquo;</span></a>\n    </li>\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.links : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    \n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.next : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "     \n            <span aria-hidden=\"true\">&raquo;</span></a>\n  </li>\n\n";
},"useData":true});

this["ScriptusTemplates"]["sw_sc_timed_dropdown"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"btn-group\" role=\"group\">\n    <button type=\"button\"\n      class=\"btn btn-default dropdown-toggle\"\n      data-toggle=\"dropdown\"\n      aria-haspopup=\"true\"\n      aria-expanded=\"false\">\n      "
    + container.escapeExpression(((helper = (helper = helpers.current_action || (depth0 != null ? depth0.current_action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"current_action","hash":{},"data":data}) : helper)))
    + "\n      <span class=\"caret\"></span>\n    </button>\n    <ul class=\"dropdown-menu\">\n      <li>\n        <a class=\"sc-filter-mode\"\n          >All scenes</a>\n      </li>\n      <li><a\n        class=\"sc-filter-mode\"\n        data-mode=\"timed\"\n          >Dated only</a></li>\n          <li><a class=\"sc-filter-mode\"\n            data-mode=\"untimed\"\n            >Without date</a></li>\n    </ul>\n  </div>\n  <button class=\"btn pull-right btn-danger \">New\n    <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span>\n  </button>";
},"useData":true});

return this["ScriptusTemplates"];

});