document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const folderName = document.getElementById("folderName");
  const error = document.getElementById("error");

  // Get folder name from URL path
  const folder = window.location.pathname.replace("/", "").replace(/\/$/, "");

  // Show the folder name
  folderName.textContent = folder
    ? `Viewing folder: ${folder}`
    : "No folder specified";

  if (folder) {
    // Fetch image files dynamically
    fetch(`${folder}/`)
      .then((response) => {
        if (response.ok) {
          return response.text(); // Get the folder listing
        } else {
          throw new Error("Folder not found");
        }
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Parse and display images
        const links = [...doc.querySelectorAll("a")];
        const images = links
          .map((link) => link.getAttribute("href"))
          .filter((fileName) =>
            /\.(jpg|jpeg|png|gif|webp|jfif)$/i.test(fileName)
          ); // Added .jfif support

        if (images.length > 0) {
          images.forEach((img) => {
            const imgElement = document.createElement("img");
            imgElement.src = `${folder}/${img}`;
            gallery.appendChild(imgElement);
          });
        } else {
          error.textContent = "No images found in this folder.";
          error.style.display = "block";
        }
      })
      .catch((err) => {
        error.textContent = "Folder not found. Please check the URL!";
        error.style.display = "block";
        console.error(err);
      });
  } else {
    error.textContent = "Please specify a folder in the URL.";
    error.style.display = "block";
  }
});
