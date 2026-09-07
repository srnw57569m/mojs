const BaseResponse = require("../../../Base/BaseResponse");
const { cloudflareCdnUrl } = require("../../../Constants/WebApiConstants");

function buildBody(body) {
    return {
        text: body.text === "None" ? null : body.text,
        inventory: {
            items: body.inventory.items
        }
    }
}

function buildPost(post) {
    return {
        postId: post.post_id,
        authorId: post.author_id,
        createdAt: new Date(post.created_at),
        mediaUrl: post.type !== 'text'
            ? cloudflareCdnUrl.concat(post.file_key)
            : null,
        type: post.type,
        visibility: post.visibility,
        comments: post.num_comments,
        likes: post.num_likes,
        reposts: post.num_reposts,
        body: post.body ? buildBody(post.body) : null,
        caption: post.caption,
        featuredUserIds: post.featured_user_ids
    }
}

class PostsResponse extends BaseResponse {
    build(data, listNext) {
        this.posts = data.posts.map((post) => (buildPost(post)))

        this.total = data.total

        this.firstId = data.first_id ? data.first_id : null
        this.lastId = data.last_id ? data.last_id : null

        if (this.lastId) {
            this.next = async () => await listNext(this.lastId);
        } else {
            this.next = null;
        }
    }
}

class PostResponse extends BaseResponse {
    build(data) {
        const post = data.post

        this.postId = post.post_id
        this.authorId = post.author_id
        this.createdAt = new Date(post.created_at)
        this.mediaUrl = post.type !== 'text'
            ? cloudflareCdnUrl.concat(post.file_key)
            : null
        this.type = post.type
        this.visibility = post.visibility
        this.comments = post.num_comments
        this.likes = post.num_likes
        this.reposts = post.num_reposts
        this.body = post.body ? buildBody(post.body) : null
        this.caption = post.caption
        this.featuredUserIds = post.featured_user_ids

        this.commentsList = post.comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            postId: comment.post_id,
            authorId: comment.author_id,
            authorName: comment.author_name,
            likes: comment.num_likes
        }))
    }
}

module.exports = {
    PostsResponse,
    PostResponse
}