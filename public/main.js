const postsList = document.querySelector(".posts-list");
const createPostBtn = document.querySelector(".add-post");
const reloadBtn = document.querySelector(".reload");

// Reload des posts
reloadBtn.addEventListener("click", () => {
  postsList.innerHTML = "";
  afficherPosts();
});

// Fonction pour créer un post
async function createPost(title) {
  try {
    const response = await fetch("http://localhost:3333/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Assurez-vous que cet en-tête est présent
      },
      body: JSON.stringify({ post: title }), // Corps de la requête
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const result = await response.json();
    const newPost = result.post;
    afficherPost(newPost, postsList.children.length);
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
  }
}

createPostBtn.addEventListener("click", async () => {
  const title = prompt("Entrer le titre du post");
  if (title) {
    await createPost(title);
  }
});

// Fonction pour editer un post
async function editPost(postId, newTitle) {
  try {
    const response = await fetch(`http://localhost:3333/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Assurez-vous que cet en-tête est présent
      },
      body: JSON.stringify({ title: newTitle }), // Corps de la requête
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    postsList.innerHTML = "";
    afficherPosts();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du post:", error);
  }
}

// Fonction pour supprimer un post
async function deletePost(postId) {
  try {
    const response = await fetch(`http://localhost:3333/posts/${postId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Erreur lors de la suppression du post:", error);
  }
}

// Fonction pour update les posts

async function afficherPost(element, index) {
  const indexPost = document.createElement("p");
  indexPost.textContent = index + 1 + ". ";
  indexPost.className = "text-2xl font-bold";

  const post = document.createElement("div");
  post.className =
    "flex justify-between items-center hover:bg-gray-200 rounded-xl opacity-0 transition-all duration-500 ease-out p-2 m-2 bg-gray-300";

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "X";
  removeBtn.className =
    "flex items-center justify-center bg-red-500 text-white rounded-xl p-4 border-none leading-none  duration-300 ease-in-out hover:bg-red-700 cursor-pointer";

  removeBtn.addEventListener("click", () => {
    post.classList.add("translate-x-[1000px]", "duration-300", "ease-in-out");
    setTimeout(async () => {
      await deletePost(element.id);
      post.remove();
    }, 500);
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className =
    "flex items-center justify-center  bg-blue-500 text-white rounded-xl p-4 border-none leading-none  duration-300 ease-in-out hover:bg-blue-700 mr-2 cursor-pointer";

  editBtn.addEventListener("click", async () => {
    const newTitle = prompt("Entrer le nouveau titre");
    if (newTitle) {
      await editPost(element.id, newTitle);
      title.textContent = newTitle;
    }
  });

  let title = document.createElement("li");
  title.textContent = element.post;
  title.className =
    "text-lg  transition-all duration-500 ease-out  m-1 p-1 origin-left w-[700px] ";

  postsList.appendChild(post);
  post.appendChild(indexPost);
  post.appendChild(title);
  post.appendChild(editBtn);
  post.appendChild(removeBtn);

  setTimeout(() => {
    post.classList.remove("opacity-0");
  }, index * 50);

  postsList.scrollTop = postsList.scrollHeight;
}

// Fonction pour afficher tout les posts
async function afficherPosts() {
  const token = localStorage.getItem("authToken");

  const response = await fetch("http://localhost:3333/posts", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const posts = await response.json();
  console.log(posts);

  posts.forEach((element, index) => {
    afficherPost(element, index);
  });
}

afficherPosts();
