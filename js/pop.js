/**
 * Created by sdm on 14-1-18.
 */
$(function () {

    //@todo 自动提示 datalist 有问题 ,使用headtype 这个暂不 不支持 增量更新
    var model = window.Model;

    var ips = []
    var domains = []

    //@todo 支持回调 增量更新
    model.setAutoIp(function (all) {
        ips.length = 0;
        for (var i = 0; i < all.length; i++) {
            ips.push(all[i]);
        }
    });
    model.setAutoDomain(function (all) {
        domains.length = 0;
        for (var i = 0; i < all.length; i++) {
            domains.push(all[i]);
        }

        $('#domain').typeahead({
            source: domains,
            display: 'domain',
            val: 'domain'});
    });

    $('#ip').typeahead({
        source: ips,
        display: 'ip',
        val: 'ip'});

    $('#domain').typeahead({
        source: domains,
        display: 'domain',
        val: 'domain'});


    var last_search = model.getkws();
    var kws = []
    $(model.getkws()).each(function (i, v) {
        kws.push({'kw': v});
    })

    $('#input_search').typeahead({
        source: kws,
        display: 'kw',
        val: 'kw'
    });

    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    function search() {

        var kw = $('#input_search').val();
        var result = model.search(kw);
        setTimeout(render_search_history, 0);
        //显示

        render_search_result(result);
    }

    setTimeout(search)

    function render_label_filter() {
        var tags = model.countTags();
        //标签过滤
        var labels = $('#label-filter')

        //添加 host 表单
        var div_labels = $('#div_labels');

        div_labels.html('');
        labels.html('');
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            labels.append('<a href="#" data-tag="' + tag.name + '">' + tag.name + '(' + tag.count + ')</a>&nbsp;')
            div_labels.append('<label class="checkbox-inline">' +
                '<input type="checkbox" name="labels[]" value="' + tag.name + '">' + tag.name + '</label>'
            )
        }


    }

    var labels = $('#label-filter')

    labels.on('click', 'a', function () {
        var kw = $('#input_search').val();
        var kws = kw.split(/\s+/);
        for (var i = 0; i < kws.length; i++) {
            if (kws[i].indexOf(':')) {
                var t = kws[i].split(':');
                if (t[0] == 'tags') {
                    kws[i] = '';
                }
            }
        }
        kws.push('tags:' + $(this).data('tag'));


        $('#input_search').val(kws.join(' ')).change();
    })

    setTimeout(render_label_filter);

    function render_search_result(result) {


        var tbody = $('#tbody-hosts');
        tbody.find('tr').remove();
        //@todo 改进使用 模板引擎
        if (result.length == 0) {
            tbody.append('<tr><td colspan="3">没有结果</td></tr>');
        } else {
            $(result).each(function (i, v) {
                var tags = '<td>&nbsp;</td>';
                if (v.tags) {
                    tags = '<td>' + (v.tags.join(' , ')) + '</td>';
                }


                var status = 'status-enabled';
                if (!v.status) {
                    status = 'status-disabled';
                }
                //<a href="#" data-toggle="tooltip" title="" data-original-title="Default tooltip">you probably</a>

                tbody.append('<tr  title="备注:' + v.note + ' 更新时间:' + v.uptime + '"   id="host-' + v.id + '" data-id="' + v.id + '"><td><input name="id[]" value="' + v.id + '" type="checkbox"></td><td><span class="host-status glyphicon glyphicon-ok ' + status + '"  ></span></td></td><td>' + v.ip + '</td><td>' + v.domain + '</td>' + tags + '</tr>');


            })
        }
    }

    //状态刷新
    function render_status(ids, status) {

        var id_map = {}
        $(ids).each(function (i, v) {
            id_map[v] = 1;
            var span = $('#tbody-hosts tr#host-' + v).find('.host-status');
            if (status) {
                span.removeClass('status-disabled').addClass('status-enabled');
            } else {
                span.removeClass('status-enabled').addClass('status-disabled');
            }
        })
    }

    setTimeout(render_search_history);
    function render_search_history() {
        var last_search = model.getkws();
        $('#menu li').remove();
        $(last_search).each(function (k, v) {
            $('#menu').append('<li><a href="#" data-kw="' + v + '">' + v + '</a></li>');
        })
        $('#menu').append('<li class="divider"></li><li><a href="#" data-kw="">clear</a></li>');
    }

    var labels = $('#menu')

    labels.on('click', 'a', function () {

        var kw = $(this).data('kw');
        $('#input_search').val(kw).change();
        if (!kw) {
            model.clearkws();
            setTimeout(render_search_history, 0);
        }

    })


    $('#select_all').change(function () {

        $('input[type=checkbox][name="id[]"]').prop('checked', this.checked).change();
    })

    function select_one(id) {
        console.log(id);

    }

    $('#tbody-hosts ').on('change', 'input[name="id[]"]', function () {
        select_one(this.value)
        var tr = $(this).parents('tr');
        if ($(this).prop('checked')) {
            tr.addClass('success')
        } else {
            tr.removeClass('success')
        }
        return false;
    });
    $('#tbody-hosts').on('click', 'tr', function () {
        var c = $('input', this)
        setTimeout(function () {
            c.prop('checked', !c.prop('checked')).change();
        })
        return false;

    });
    $('#but-save').click(function () {

        //保存操作
        if ($('#add').is(":visible")) {
            console.log('普通添加模式');
            var info = {
                'ip': $('#ip').val(),
                'domain': $('#domain').val(),
                'note': $('#note').val(),
                'tags': [],
                'uptime': new Date().Format("yyyy-MM-dd hh:mm:ss")
            };
            var add_tags = $('#add_labels').val().split(',');
            $(add_tags).each(function (i, v) {
                if (v) {
                    info.tags.push(v);
                }

            })

            $('#div_labels input[name="labels[]"]:checked').each(function () {

                info.tags.push(this.value);
            })

            model.addHost(info);
            $('#dlg_add').modal('hide')
            //重新显示列表
            setTimeout(search, 0);

        } else {
            console.log('批量添加模式');
        }

    })
    $('#input_search').change(function () {
        clearTimeout($(this).data('t'));
        $(this).data('t', setTimeout(search, 100));
    })
    $('#btn_search').click(search);


    $("#status").prop('checked', model.getStatus()).switchButton({}).change(function () {
        model.setStatus(this.checked);
    });

    $('#but_add').click(function () {
        //打开对话框
        //window.open('/pages/hi.html','_blank','width=100,height=100,top=100,left=100');
    })

    $('#but_enabled').click(function () {
        var ids = []
        $('input[type=checkbox][name="id[]"]:checked').each(function () {
            ids.push(this.value);
        })
        render_status(ids, 1);
        model.enableHosts(ids);

    })
    $('#but_disabled').click(function () {
        var ids = []
        $('input[type=checkbox][name="id[]"]:checked').each(function () {
            ids.push(this.value);
        })
        render_status(ids, 0);
        model.disableHosts(ids);


    })
    $('#but_del').click(function () {

        $('input[type=checkbox][name="id[]"]:checked').each(function () {
            model.removeHost(this.value);
        })


        $('input[type=checkbox][name="id[]"]:checked').parents('tr').remove();
    })


    $('#add_tab a:first').tab('show')
})

