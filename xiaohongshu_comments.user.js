// ==UserScript==
// @name         Fullfill xiaohongshu comments
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fullfill xiaohongshu comments for pc web
// @author       You
// @match        https://www.xiaohongshu.com/discovery/item/*
// @icon         https://ci.xiaohongshu.com/209f8cef-ad50-4299-8e5f-500fc0210353
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if(location.href.endsWith("comments")) {
        $(document).ready(function() {
            setTimeout(function() {
                $(".fixed").hide();
                $("a.back").hide();
            }, 200);
        });
    } else {
        var isMobile = $(".normal-launch-app-container").length > 0;
        var container = "1080px";
        var pic = "720px";
        var comments = "600px";
        if(!isMobile) {
            $(".pc-container").css("width", container);
            $(".left-card").css("width", pic);
            $(".left-card .videoframe").css("width", pic);
            $(".left-card .carousel").css("width", pic);
            $(".left-card .carousel").css("height", pic);
            $(".left-card .small-pic").css("width", pic);
            $(".left-card .carousel ul li").css("width", pic);
            $(".left-card .carousel ul li").css("height", pic);
            $(".all-tip").css("width", pic);
        }
        var qm = location.href.indexOf("?");
        if(qm < 0) qm = location.href.length;
        var allComments = location.href.substr(0, qm) + "/comments" + location.href.substr(qm);
        var author = $(".name .name-detail:first").text();
        if($("div.comment").length > 0) {
            var cnattr = $("div.content:has(div.comment)")[0].attributes[0].name;
            var cmattr = $("div.comment")[0].attributes[0].name;
            if($("div.reply").length > 0) {
                var rpattr = $("div.reply")[0].attributes[0].name;
            }
            var avtattr = $("div.avatar")[0].attributes[0].name;
            var avtimgattr = $("div.avatar img")[0].attributes[0].name;
            if($("div.comment .icon").length > 0) {
                var iconattr = $("div.comment .icon")[0].attributes[0].name;
            }
            var thumbSvg = $("span.like-sum:first").parent().html();
            if(!thumbSvg) {
                thumbSvg = $("span.likes:first").html();
            }

            $.get(allComments).done(function(data) {
                var html = $($.parseHTML(data)).find("div.comments");
                $(html).find("a.back").remove();
                $(html).find(".reply .reply-intro").remove();
                if(isMobile) {
                    $(".sgui-header").remove();
                    $(".more-image-desc").remove();
                    $(".cube-z-bottom-bar").remove();
                    $(".vertical-column-layout .bottom").remove();
                    $("div.content:has(div.comment)").html($(html).html());
                } else {
                    $(html).each(function(idx, e) {
                        $(this).find("div").each(function() {
                            $(this).attr(cmattr, "");
                            if(!$(this).hasClass("replies") && !$(this).hasClass("avatar") && !$(this).hasClass("user-info")) {
                                $(this).attr(cnattr, "");
                            }
                        });
                        $(this).find("div.avatar").each(function() {
                            $(this).removeClass("avatar-M");
                            $(this).addClass("avatar-XS", "");
                            $(this).attr(avtattr, "");
                            $(this).attr(avtimgattr, "");
                        });
                        $(this).find("div.avatar-img").each(function() {
                            $(this).attr(avtattr, "");
                            $(this).attr(avtimgattr, "");
                        });
                        $(this).find("div.avatar img").each(function() {
                            $(this).attr(avtattr, "");
                            $(this).attr(avtimgattr, "");
                        });
                        $(this).find("p.content").attr(cmattr, "");
                        $(this).find("div.comment-info p").each(function() {
                            $(this).attr(cmattr, "");
                            $(this).attr(cnattr, "");
                        });
                        $(this).find("div.comment-info").each(function() {
                            $(this).find("span").attr(cmattr, "");
                            $(this).find("h4").attr(cmattr, "");
                            $(this).find("a").attr(cmattr, "");
                            $(this).find("span.likes font").each(function(){ $(this).remove(); });
                            $(this).find("span.likes").each(function() {
                                var thumbs = $(this).text();
                                $(this).html(thumbSvg);
                                $(this).find("span.like-sum").text(thumbs);
                            });
                        });
                        if($("div.reply").length > 0) {
                            $(this).find("div.reply").each(function() {
                                $(this).attr(rpattr, "");
                                $(this).find("p").each(function() {
                                    $(this).addClass("reply-content");
                                    $(this).attr(rpattr, "");
                                });
                                var rpuser = $(this).find("h4 a:first").text();
                                if(rpuser == author) {
                                    rpuser = rpuser + "(作者)";
                                }
                                var rphtml = $(this).find(".reply-content:first").html();
                                var pubtime = $(this).find("span.publish-time:first").text();
                                var pubhtml = "<span " + rpattr + " class=\"reply-content\" style=\"padding-left:5px;font-size:12px;\">" + pubtime + "</span>";
                                $(this).html("<span " + rpattr + " class=\"replier\">" + rpuser + " : </span>" + rphtml + pubhtml);
                            });
                        }
                        if($("div.comment .icon").length > 0) {
                            $(this).find("div.comment .icon").attr(iconattr, "");
                        }
                        $("div.content:has(div.comment)").html($(this).html());
                    });
                }
            });
        }
    }
})();
