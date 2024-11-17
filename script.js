let prompt=document.querySelector("#prompt")
let chatContainer=document.querySelector(".chat-container")


let user={
    data:null,
}
function createChatBox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}

function handlechatResponse(Message){
    let html =`<img src = "us.png" alt = "" id="userImage" width="50">
<div class="user-chat-area">
    ${Message}
</div>`

prompt.value=""
let userChatBox=createChatBox(html,"user-chat-box")
chatContainer.appendChild(userChatBox)


setTimeout(()=>{
let html=` <img src = "aii.png" alt = "" id="aiImage" width="50">
     <div class="ai-chat-area"></div>
 </div>`
 let aichatBox= createChatBox(html,"ai-chat-box")
 chatContainer.appendChild(aichatBox)
 generateResponse(aichatBox)
},600)
}

prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
       handlechatResponse(prompt.value)
    }
    
})