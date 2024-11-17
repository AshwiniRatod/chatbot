let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput = document.querySelector("#image input");

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=your api"


let user = {
    data: null,
    file: {
        mime_type: null,
        data: null
    }
};

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");

    let requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: user.data }
                    ]
                }
            ]
        })
    };

    try {
        let response = await fetch(Api_Url, requestOptions);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        let data = await response.json();

        let apiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
            ?.replace(/\*\*(.*?)\*\*/g, "$1") 
            ?.trim() || "No response received.";
        
        text.innerHTML = apiResponse;
    } catch (error) {
        console.error("Error:", error);
        text.innerHTML = "An error occurred. Please try again.";
    } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        image.src = "img.svg";
        image.classList.remove("choose");
        user.file = { mime_type: null, data: null };
    }
}

function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}


function handlechatResponse(message) {
    if (!message.trim()) {
        alert("Please enter a message!");
        return;
    }

    user.data = message;

    let html = `
        <img src="human.png" alt="User" id="userImage" width="50">
        <div class="user-chat-area">
            ${user.data}
        </div>`;
    prompt.value = "";

    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });


    setTimeout(() => {
        let html = `
            <img src="ro.png" alt="AI" id="aiImage" width="50">
            <div class="ai-chat-area">
                <img src="loading.webp" alt="Loading" class="load" width="50px">
            </div>`;
        let aiChatBox = createChatBox(html, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);

        generateResponse(aiChatBox);
    }, 600);
}


prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handlechatResponse(prompt.value);
    }
});


submitbtn.addEventListener("click", () => {
    handlechatResponse(prompt.value);
});

imageinput.addEventListener("change", () => {
    const file = imageinput.files[0];
    if (!file) return;


    if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB.");
        return;
    }

    let reader = new FileReader();
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1];
        user.file = {
            mime_type: file.type,
            data: base64string
        };
        image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
        image.classList.add("choose");
    };

    reader.readAsDataURL(file);
});

imagebtn.addEventListener("click", () => {
    imageinput.click();
});
