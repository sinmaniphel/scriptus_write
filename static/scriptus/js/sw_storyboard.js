function init_timeline(cont_name, data)
{
    var tl = $(cont_name)[0];
    var items = new vis.DataSet(data);

    var options = {};
    return new vis.Timeline(tl,data,options);
}
