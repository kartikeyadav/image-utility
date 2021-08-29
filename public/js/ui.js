const userPrompt = document.querySelector("#userPrompt");
const selectFileBtn = document.querySelector("#select-img");
const uploadFileBtn = document.querySelector("#upload-img");

const checkImage = (evt) => {
    let imageFile = evt.target.files[0];
    const imageSize = imageFile.size;
    if (imageSize >= 1048576)
    {
        userPrompt.textContent = `Image size : ${(imageSize / 1048576).toFixed(1)} MB.
        Accepted Image size: (< 1 MB)`;
        uploadFileBtn.disabled = true;
    }
    else
    {
        userPrompt.textContent = "";
        uploadFileBtn.disabled = false;
    }
};

if (selectFileBtn !== null){
    selectFileBtn.addEventListener("change", evt => {
        checkImage(evt);
    });
}
