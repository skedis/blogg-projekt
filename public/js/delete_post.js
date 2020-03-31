// Get delete button and add EventListener to it
let deleteButton = document.querySelector('.delete-post');
deleteButton && deleteButton.addEventListener('click', deletePost);

// Used for sending a DELETE request on the given post
function deletePost() {
  let id = deleteButton.getAttribute('data-id');

  fetch('/posts/' + id, {
    method: 'DELETE',
  }).then((res) => {
    window.location.href = '/';
  }).catch((err) => {
    console.log(err);
  });
}
