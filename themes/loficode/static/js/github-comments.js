// Original code taken with permission from : https://github.com/dwilliamson/donw.io/blob/master/public/js/github-comments.js

// use of ajax vs getJSON for headers use to get markdown (body vs body_html)

function ShowComments(repo_name, comment_id, page_id)
{
    $.ajax({
        url: "https://api.github.com/repos/" + repo_name + "/issues/" + comment_id + "/comments" + "?page=" + page_id,
        headers: {Accept: "application/vnd.github.v3.html+json"},
        dataType: "json",
        success: function(comments, textStatus, jqXHR) {

            if (1 == page_id) {
                $("#gh-comments-list").empty();

                // post button
                var url = "https://github.com/" + repo_name + "/issues/" + comment_id + "#new_comment_field";
                $("#gh-comments-list").append("<div class='gh-comments-actions'><a class='gh-post-btn' href='" + escapeAttr(url) + "' rel='nofollow noopener noreferrer' target='_blank'>Post a comment on GitHub</a></div>");

                if (0 == comments.length) {
                    $("#gh-comments-list").append("<div class='gh-comments-empty'>No comments yet.</div>");
                }
            }

            // Individual comments
            $.each(comments, function(i, comment) {

                var date = new Date(comment.created_at);
                var dateText = date.toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                });

                var t = "<article class='gh-comment'>";
                t += "<div class='gh-comment-author'>";
                t += "<img src='" + escapeAttr(comment.user.avatar_url) + "' alt='' loading='lazy'>";
                t += "<div class='gh-comment-meta'>";
                t += "<b><a href='" + escapeAttr(comment.user.html_url) + "' rel='noopener noreferrer' target='_blank'>" + escapeHtml(comment.user.login) + "</a></b>";
                t += "<time datetime='" + escapeAttr(comment.created_at) + "' title='" + escapeAttr(date.toUTCString()) + "'>" + escapeHtml(dateText) + "</time>";
                t += "</div>";
                t += "</div>";
                t += "<div class='gh-comment-body'>";
                t += cleanGithubCommentHtml(comment.body_html || escapeHtml(comment.body || ""));
                t += "</div>";
                t += "</article>";
                $("#gh-comments-list").append(t);
            });

            // Call recursively if there are more pages to display
            var linksResponse = jqXHR.getResponseHeader("Link");
            if (linksResponse) {
                var entries = linksResponse.split(",");
                for (var j=0; j<entries.length; j++)
                {
                    var entry = entries[j];
                    if ("next" == entry.match(/rel="([^"]*)/)[1])
                    {
                        ShowComments(repo_name, comment_id, page_id+1);
                        break;
                    }
                }
            }
        },
        error: function() {
            $("#gh-comments-list").html("<div class='gh-comments-error'>Comments are not available for this post yet.</div>");
        }
    });
}

function escapeHtml(value)
{
    return String(value || "").replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

function escapeAttr(value)
{
    return escapeHtml(value);
}

function cleanGithubCommentHtml(value)
{
    var wrapper = document.createElement("div");
    wrapper.innerHTML = value || "";

    [
        ".email-hidden-toggle",
        ".email-hidden-reply",
        ".email-quoted-reply"
    ].forEach(function(selector) {
        Array.prototype.forEach.call(wrapper.querySelectorAll(selector), function(element) {
            element.remove();
        });
    });

    Array.prototype.forEach.call(wrapper.querySelectorAll(".email-fragment"), function(element) {
        if (!element.textContent.trim() && 0 == element.children.length) {
            element.remove();
        }
    });

    return wrapper.innerHTML;
}

function DoGithubComments(repo_name, comment_id)
{
    $(document).ready(function ()
    {
        ShowComments(repo_name, comment_id, 1);
    });
}
