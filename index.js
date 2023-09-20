const baseUrl = 'https://jsonplaceholder.typicode.com';

const loadPost = (id) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject(new Error('No post id given.'));
            return;
        }

        const idVal = Number(id);

        if (idVal < 0 || idVal > 100) {
            reject(new Error('Post ID must be in the range from 0 to 100.'));
            return;
        }

        fetch(`${baseUrl}/posts/${id}`)
            .then(res => res.ok ? res.json() : Promise.reject("No post data loaded."))
            .then(post => resolve(post))
            .catch(err => reject(err));
    });
};

const loadComments = (postId) => {
    return new Promise((resolve, reject) => {
        fetch(`${baseUrl}/comments?postId=${postId}`)
            .then(res => res.ok ? res.json() : Promise.reject("No comments loaded."))
            .then(comments => resolve(comments))
            .catch(err => reject(err));
    });
};

function loadPostData() {
    const id = document.getElementById('idInput').value;
    const loadPostCommentsBtnContainer = document.getElementById('loadPostCommentsBtn-container');
    const postContainer = document.getElementById('post-content');

    loadPost(id)
        .then(post => {
            const blogContent = post.body;
            postContainer.innerText = blogContent;
            loadPostCommentsBtnContainer.style.display = 'block';
        })
        .catch((err) => {
            postContainer.innerText = err;
            document.getElementById('comments-content').style.display = 'none';
        });
}

function loadCommentsData() {
    const postId = document.getElementById('idInput').value;

    loadComments(postId)
        .then(comments => {
            const commentsContent = document.getElementById('comments-content');
            commentsContent.innerHTML = '';

            comments ||= [];
            comments.forEach((comment, _) => {
                const commentContainer = document.createElement('div');
                commentContainer.classList.add('comment-container');

                const commentAuthorContainer = document.createElement('div');
                commentAuthorContainer.classList.add('comment-author');

                const commentBodyContainer = document.createElement('div');
                commentBodyContainer.classList.add('comment-body');

                commentAuthorContainer.innerText = comment.email;
                commentContainer.appendChild(commentAuthorContainer);
                commentBodyContainer.innerText = comment.body;
                commentContainer.appendChild(commentBodyContainer);

                commentsContent.appendChild(commentContainer);
            });

            if (comments.length) {
                commentsContent.style.display = 'block';
            }
        });
}

function onIdChanged() {
    document.getElementById('post-content').innerText = '';
    document.getElementById('comments-content').style.display = 'none';
    document.getElementById('loadPostCommentsBtn-container').style.display = 'none';
}