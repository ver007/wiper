
/**************************************
* Date: 2015-8-6
* Description: the class Current record the current data
*
**************************************/
function Current(){
	this.project = null;
	this.host = null;
	this.vul = null;
	this.comment = null;
}

Current.prototype.init = function(){
	this.project = null;
	this.host = null;
	this.vul = null;
	this.comment = null;

	$("#wip-title-project").text("[project]");
	$("#wip-title-host").text("[host]");
	$("#wip-title-vul").text("[vul]");
	$("#wip-title-comment").text("[comment]");
}
Current.prototype.initProject = function(){
	this.project = null;
	this.host = null;
	this.vul = null;
	this.comment = null;

	$("#wip-title-project").text("[project]");
	$("#wip-title-host").text("[host]");
	$("#wip-title-vul").text("[vul]");
	$("#wip-title-comment").text("[comment]");
}
Current.prototype.initHost = function(){
	this.host = null;
	this.vul = null;
	this.comment = null;

	$("#wip-title-host").text("[host]");
	$("#wip-title-vul").text("[vul]");
	$("#wip-title-comment").text("[comment]");
}
Current.prototype.initVul = function(){
	this.vul = null;

	$("#wip-title-vul").text("[vul]");
}
Current.prototype.initComment = function(){
	this.comment = null;

	$("#wip-title-comment").text("[comment]");
}
Current.prototype.setProject = function(project){
	this.project = project;
	if(!project) {
		$("#wip-title-project").text("[project]");
	} else {
		$("#wip-title-project").text("["+project.name+"]");
	}
	this.setHost(null);
	this.setVul(null);
	this.setComment(null);
}
Current.prototype.getProject = function(){
	return this.project;
}
Current.prototype.setHost = function(host){
	this.host = host;
	if(!host){
		$("#wip-title-host").text("[host]");
	} else {
		$("#wip-title-host").text("["+host.ip+' | '+host.url+"]");
	}
	this.setVul(null);
	this.setComment(null);
}
Current.prototype.getHost = function(){
	return this.host;
}
Current.prototype.setVul = function(vul){
	this.vul = vul;
	if(!vul) {
		$("#wip-title-vul").text("[vul]");
	} else {
		$("#wip-title-vul").text("["+vul.name+"]");
	}	
}
Current.prototype.getVul = function(){
	return this.vul;
}
Current.prototype.setComment = function(comment){
	this.comment = comment;
	if(!comment) {
		$("#wip-title-comment").text("[comment]");
	} else {
		$("#wip-title-comment").text("["+comment.name+"]");
	}	
}
Current.prototype.getComment = function(){
	return this.comment;
}

/**************************************
* Date: 2015-8-6
* Description: init the program
*
**************************************/
var current = new Current();

$(document).ready(function() {

    listProject();

//    bindAddProjectEvent();
    $("#wip-project-button-add").click(addProject);
    $("#wip-project-button-delete").click(deleteProject);
    $("#wip-project-button-modify").click(modifyProject);
    $("#wip-project-button-refresh").click(refreshProject);

    $("#wip-tab-button-detail").click(function(){listHost();});
    $("#wip-host-button-add").click(addHost);
    $("#wip-host-button-delete").click(deleteHost);
    $("#wip-host-button-modify").click(modifyHost);
    $("#wip-host-button-refresh").click(refreshHost);
});

/**************************************
* Date: 2015-8-6
* Description: manage the project table
**************************************/

function addProject(){
//	 data-toggle="modal" data-target="#wip-project"
	 $("#wip-project-modal").modal("show");
	 var options = {
    	type:"POST",
    	url:"addproject",
    	beforeSubmit:function(){
    		//参数校验
    	},
    	success:function(){   		
    		alert("提交成功!");
    		$("#wip-project-modal").modal("hide");
    		listProject();
    	},
    	error:function(err){
    	 	alert("提交失败!");
    	}
    };
    //$('#wip-project-modal-form').submit(function(){$(this).ajaxSubmit(options);return false;});  
    $("#wip-project-modal-form").ajaxForm(options);
}

function deleteProject(){
	if(!current.getProject()) {
		alert("请先选择project!");
		return
	}
	if(confirm("是否删除当前项目？") == false){
		return
	}
	$.get("/deleteproject?id="+current.getProject().id, function(data,status){
		if(status!="success") {
			alert("删除失败！");
		}
	});
	listProject();
	$("#wip-project-detail").empty();
	current.setProject(null);
}

function modifyProject(){
	if(!current.getProject()) {
		alert("请先选择project!");
		return;
	}
	$("#wip-project-modal").modal("show");
	$("#wip-project-modal-form-id").val(current.getProject().id);
	$("#wip-project-modal-form-name").val(current.getProject().name);
	$("#wip-project-modal-form-url").val(current.getProject().url);
	$("#wip-project-modal-form-ip").val(current.getProject().ip);
	$("#wip-project-modal-form-whois").val(current.getProject().whois);
	$("#wip-project-modal-form-description").val(current.getProject().description);

	
	var options = {
    	type:"POST",
    	url:"modifyproject",
    	beforeSubmit:function(formData, jqForm, opt){
//    		var project = {};
//    		project.id = formData[0].value;
//    		project.name = formData[1].value;
//    		project.ip = formData[2].value;
//    		project.url = formData[3].value;
//    		project.whois = formData[4].value;
//    		project.description = formData[5].value;

//    		current.setProject(project);
    	},
    	success:function(){    		
    		alert("提交成功!");
    		$("#wip-project-modal").modal("hide");
    		listProject();
    	},
    	error:function(err){
    	 	alert("提交失败!");
    	}
    };

    $("#wip-project-modal-form").ajaxForm(options);
}

function listProject(){
	function addProjectItem(id, name){
		var item = $("<a></a>").addClass("list-group-item").attr("id","wip-project-id-"+id).attr("href","#").text(name);
		item.click(clickProject);
		$("#wip-project-list").append(item);
	}

	current.initProject();
	$("#wip-project-list").empty()
	$.getJSON("/listproject", function(result){
		$.each(result, function(i, value){
			addProjectItem(value.id, value.name);
		});
	});
}

function clickProject(){
	function addProjectDetailItem(name, value){
		$("#wip-project-detail").append($("<a></a>").addClass("list-group-item").attr("href","#").append($("<b></b>").text(name+":\t"), $("<br />"), value));
	}

	var id = $(this).attr('id').substring(15);
	$(this).addClass("active");
	if(current.getProject() && (current.getProject().id != id)){
		$("#wip-project-id-"+current.getProject().id).removeClass("active");
	}

	$("#wip-project-detail").empty();
	$.getJSON("/getprojectdetail?id="+id, function(result){
		current.setProject(result);
		addProjectDetailItem("项目名称", result.name);
		addProjectDetailItem("URL地址", result.url);
		addProjectDetailItem("IP地址", result.ip);
		addProjectDetailItem("Whois信息", result.whois);
		addProjectDetailItem("创建时间", result.ctime);
		addProjectDetailItem("描述信息", result.description);
	});
}

function refreshProject(){
	current.initProject();
	listProject();
	$("#wip-project-detail").empty();
}

/**************************************
* Date: 2015-8-13
* Description: manage the host table
**************************************/

function addHost(){
	 $("#wip-host-modal").modal("show");
	 var options = {
    	type:"POST",
    	url:"addhost",
    	beforeSerialize:function(form, opt){
    	},
    	beforeSubmit:function(formData, jqForm, opt){
    		//参数校验
    		if (!current.getProject()) {
    			alert("请先选择project!");
    			$("#wip-host-modal").modal("hide");
    			return false;
    		}
    		var project_id = current.getProject().id;
    		formData[8] = {'name':'project_id', 'value':project_id}
    	},
    	success:function(){   		
    		alert("提交成功!");
    		$("#wip-host-modal").modal("hide");
    		listHost();
    	},
    	error:function(err){
    	 	alert("提交失败!");
    	}
    };

    $("#wip-host-modal-form").ajaxForm(options);
}

function deleteHost(){
	if(!current.getHost()) {
		alert("请先选择Host!");
		return
	}
	if(confirm("是否删除当前Host？") == false){
		return
	}
	$.get("/deletehost?id="+current.getHost().id, function(data,status){
		if(status!="success") {
			alert("删除失败！");
		}
	});
	listHost();
	$("#wip-vul-comment-list").empty();
	current.setHost(null);
}

function modifyHost(){
	if(!current.getHost()) {
		alert("请先选择Host!");
		return;
	}
	$("#wip-host-modal").modal("show");
	$("#wip-host-modal-form-id").val(current.getHost().id);
	$("#wip-host-modal-form-url").val(current.getHost().url);
	$("#wip-host-modal-form-ip").val(current.getHost().ip);
	$("#wip-host-modal-form-level").val(current.getHost().level);
	$("#wip-host-modal-form-os").val(current.getHost().os);
	$("#wip-host-modal-form-server_info").val(current.getHost().server_info);
	$("#wip-host-modal-form-middleware").val(current.getHost().middleware);
	$("#wip-host-modal-form-description").val(current.getHost().description);
	
	var options = {
    	type:"POST",
    	url:"modifyhost",
    	beforeSubmit:function(formData, jqForm, opt){
    	},
    	success:function(){    		
    		alert("提交成功!");
    		$("#wip-host-modal").modal("hide");
    		listHost();
    	},
    	error:function(err){
    	 	alert("提交失败!");
    	}
    };

    $("#wip-host-modal-form").ajaxForm(options);
}

function listHost(orderby="level"){
	if(!current.getProject()) {
		//alert("请先选择Project!");
		return;
	}
	//如果没有重新选择project，则不刷新host list
	if(current.getHost()){
		if(current.getHost().project_id == current.getProject().id) {
			return
		}
	}
	function addHostItem(id, url, ip){
		var b = $("<b></b>").text(ip+" | ")
		var i = $("<i></i>").text(url)
		var item = $("<a></a>").addClass("list-group-item").attr("id","wip-host-id-"+id).attr("href","#").append(b,i);
		item.click(clickHost);
		$("#wip-host-list").append(item);
	}

	current.initHost();
	$("#wip-host-list").empty();
	$("#wip-vul-comment-list").empty();
	var url = "/listhost?project_id=" + current.getProject().id + "&orderby=" + orderby;
	$.getJSON(url, function(result){
		$.each(result, function(i, value){
			addHostItem(value.id, value.url, value.ip);
		});
	});
}

function clickHost(){
	if(!current.getProject()) {
		alert("请先选择project!");
		return
	}
	function addHostDetailItem(name, value){
		$("#wip-vul-comment-list").append($("<a></a>").addClass("list-group-item").attr("href","#").append($("<b></b>").text(name+":\t"), $("<br />"), value));
	}

	var id = $(this).attr('id').substring(12);
	$(this).addClass("active");
	if(current.getHost() && (current.getHost().id != id)){
		$("#wip-host-id-"+current.getHost().id).removeClass("active");
	}

	$("#wip-vul-comment-list").empty();
	levelList = ["关键","重要","一般","提示"];
	$.getJSON("/gethostdetail?id="+id, function(result){
		current.setHost(result);
		addHostDetailItem("URL地址", result.url);
		addHostDetailItem("IP地址", result.ip);
		addHostDetailItem("等级", levelList[result.level]);
		addHostDetailItem("OS信息", result.os);
		addHostDetailItem("Server信息", result.server_info);
		addHostDetailItem("中间件", result.middleware);
		addHostDetailItem("描述", result.description);
	});
}

function refreshHost(){
	current.initHost();
	listHost();
	$("#wip-vul-comment-list").empty();
}

/**************************************
* Date: 2015-8-13
* Description: manage the vul table
**************************************/
function addVul(){
	 $("#wip-vul-modal").modal("show");
	 var options = {
    	type:"POST",
    	url:"addvul",
    	beforeSerialize:function(form, opt){
    	},
    	beforeSubmit:function(formData, jqForm, opt){
    		//参数校验
    		if (!current.getHost()) {
    			alert("请先选择host!");
    			$("#wip-vul-modal").modal("hide");
    			return false;
    		}
    		var host_id = current.getHost().id;
    		formData[7] = {'name':'host_id', 'value':host_id}
    	},
    	success:function(){   		
    		alert("提交成功!");
    		$("#wip-vul-modal").modal("hide");
    		listVul();
    	},
    	error:function(err){
    	 	alert("提交失败!");
    	}
    };

    $("#wip-vul-modal-form").ajaxForm(options);
}

function deleteVul(){
	if(!current.getVul()) {
		alert("请先选择Vul!");
		return
	}
	if(confirm("是否删除当前Vul？") == false){
		return
	}
	$.get("/deletevul?id="+current.getVul().id, function(data,status){
		if(status!="success") {
			alert("删除失败！");
		}
	});
	listVul();
	$("#wip-vul-comment-list").empty();
	current.setVul(null);
}

function modifyVul(){
	if(!current.getVul()) {
		alert("请先选择Vul!");
		return
	}
	$("#wip-vul-modal").modal("show");
	$("#wip-vul-modal-form-id").val(current.getVul().id);
	$("#wip-vul-modal-form-name").val(current.getVul().name);
	$("#wip-vul-modal-form-url").val(current.getVul().url);
	$("#wip-vul-modal-form-info").val(current.getVul().info);
	$("#wip-vul-modal-form-type").val(current.getVul().type);
	$("#wip-vul-modal-form-level").val(current.getVul().level);
	$("#wip-vul-modal-form-description").val(current.getVul().description);
	
	var options = {
    	type:"POST",
    	url:"modifyvul",
    	beforeSubmit:function(formData, jqForm, opt){
    	},
    	success:function(){    		
    		alert("提交成功!");
    		$("#wip-vul-modal").modal("hide");
    		listVul();
    	},
    	error:function(err){
    	 	alert("提交失败!");
    	}
    };

    $("#wip-vul-modal-form").ajaxForm(options);
}

function listVul(orderby="level"){
	if(!current.getHost()) {
		alert("请先选择Host!");
		return;
	}

	function addVulItem(id, name){
		var item = $("<a></a>").addClass("list-group-item").attr("id","wip-vul-id-"+id).attr("href","#").text(name);
		item.click(clickVul);
		$("#wip-vul-list").append(item);
	}

	current.initVul();
	$("#wip-vul-comment-list").empty();
	var url = "/listvul?host_id=" + current.getHost().id + "&orderby=" + orderby;
	$.getJSON(url, function(result){
		$.each(result, function(i, value){
			addVulItem(value.id, value.name);
		});
	});
}

function clickVul(){
	if(!current.getHost()) {
		alert("请先选择project!");
		return
	}
	function addVulDetailItem(name, value){
		$("#wip-vul-comment-list").append($("<a></a>").addClass("list-group-item").attr("href","#").append($("<b></b>").text(name+":\t"), $("<br />"), value));
	}

	var id = $(this).attr('id').substring(11);
	$(this).addClass("active");
	if(current.getVul() && (current.getVul().id != id)){
		$("#wip-vul-id-"+current.getVul().id).removeClass("active");
	}

	$("#wip-vul-comment-list").empty();
	levelList = ["关键","重要","一般","提示"];
	typeList = ["溢出漏洞","注入漏洞","XSS","CSRF","路径遍历","上传","逻辑漏洞","弱口令","信息泄露","配置错误","认证/会话管理","点击劫持","跨域漏洞","其他"]
	$.getJSON("/getvuldetail?id="+id, function(result){
		current.setVul(result);
		addVulDetailItem("名称", result.name);
		addVulDetailItem("等级", levelList[result.level]);
		addVulDetailItem("URL地址", result.url);
		addVulDetailItem("详情", result.info);
		addVulDetailItem("类型", typeList[result.type]);		
		addVulDetailItem("描述", result.description);
	});
}

function refreshVul(){
	current.initVul();
	listVul();
	$("#wip-vul-comment-list").empty();
}

/**************************************
* Date: 2015-8-13
* Description: manage the comment table
**************************************/

function addComment(){
         $("#wip-comment-modal").modal("show");
         var options = {
        type:"POST",
        url:"addcomment",
        beforeSerialize:function(form, opt){
        },
        beforeSubmit:function(formData, jqForm, opt){
                //参数校验
                if (!current.getHost()) {
                        alert("请先选择host!");
                        $("#wip-comment-modal").modal("hide");
                        return false;
                }
                var host_id = current.getHost().id;
                formData[7] = {'name':'host_id', 'value':host_id}
        },
        success:function(){             
                alert("提交成功!");
                $("#wip-comment-modal").modal("hide");
                listComment();
        },
        error:function(err){
                alert("提交失败!");
        }
    };

    $("#wip-comment-modal-form").ajaxForm(options);
}

function deleteComment(){
        if(!current.getComment()) {
                alert("请先选择Comment!");
                return
        }
        if(confirm("是否删除当前Comment？") == false){
                return
        }
        $.get("/deletecomment?id="+current.getComment().id, function(data,status){
                if(status!="success") {
                        alert("删除失败！");
                }
        });
        listComment();
        $("#wip-comment-comment-list").empty();
        current.setComment(null);
}

function modifyComment(){
        if(!current.getComment()) {
                alert("请先选择Comment!");
                return
        }
        $("#wip-comment-modal").modal("show");
        $("#wip-comment-modal-form-id").val(current.getComment().id);
        $("#wip-comment-modal-form-name").val(current.getComment().name);
        $("#wip-comment-modal-form-url").val(current.getComment().url);
        $("#wip-comment-modal-form-info").val(current.getComment().info);        
        $("#wip-comment-modal-form-level").val(current.getComment().level);
        $("#wip-comment-modal-form-type").val(current.getComment().attachment);
        $("#wip-comment-modal-form-description").val(current.getComment().description);
        
        var options = {
        type:"POST",
        url:"modifycomment",
        beforeSubmit:function(formData, jqForm, opt){
        },
        success:function(){             
                alert("提交成功!");
                $("#wip-comment-modal").modal("hide");
                listComment();
        },
        error:function(err){
                alert("提交失败!");
        }
    };

    $("#wip-comment-modal-form").ajaxForm(options);
}

function listComment(orderby="level"){
        if(!current.getHost()) {
                alert("请先选择Host!");
                return;
        }

        function addCommentItem(id, name){
                var item = $("<a></a>").addClass("list-group-item").attr("id","wip-comment-id-"+id).attr("href","#").text(name);
                item.click(clickComment);
                $("#wip-comment-list").append(item);
        }

        current.initComment();
        $("#wip-comment-comment-list").empty();
        var url = "/listcomment?host_id=" + current.getHost().id + "&orderby=" + orderby;
        $.getJSON(url, function(result){
                $.each(result, function(i, value){
                        addCommentItem(value.id, value.name);
                });
        });
}

function clickComment(){
        if(!current.getHost()) {
                alert("请先选择project!");
                return
        }
        function addCommentDetailItem(name, value){
                $("#wip-comment-comment-list").append($("<a></a>").addClass("list-group-item").attr("href","#").append($("<b></b>").text(name+":\t"), $("<br />"), value));
        }

        var id = $(this).attr('id').substring(15);
        $(this).addClass("active");
        if(current.getComment() && (current.getComment().id != id)){
                $("#wip-comment-id-"+current.getComment().id).removeClass("active");
        }

        $("#wip-comment-comment-list").empty();
        levelList = ["关键","重要","一般","提示"];
        typeList = ["溢出漏洞","注入漏洞","XSS","CSRF","路径遍历","上传","逻辑漏洞","弱口令","信息泄露","配置错误","认证/会话管理","点击劫持","跨域漏洞","其他"]
        $.getJSON("/getcommentdetail?id="+id, function(result){
                current.setComment(result);
                addCommentDetailItem("名称", result.name);
                addCommentDetailItem("等级", levelList[result.level]);
                addCommentDetailItem("URL地址", result.url);
                addCommentDetailItem("详情", result.info);                
                addCommentDetailItem("附件", result.attachment);
                addCommentDetailItem("描述", result.description);
        });
}

function refreshComment(){
        current.initComment();
        listComment();
        $("#wip-comment-comment-list").empty();
}