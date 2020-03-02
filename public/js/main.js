// Get delete button and add EventListener if it exists on the page
let deleteButton = document.querySelector('.delete-post');
deleteButton && deleteButton.addEventListener('click', deletePost);

// DELETE request method
function deletePost() {
  let id = deleteButton.getAttribute('data-id');
  console.log(id);

  fetch('/posts/' + id, {
      method: 'DELETE',
    })
    .then((res) => {
      window.location.href = '/';
    })
    .catch((err) => {
      console.log(err);
    });
}