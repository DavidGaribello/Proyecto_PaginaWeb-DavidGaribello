const Info=document.querySelector("#exten-information");
const bninfo=document.querySelector("#more-information");

bninfo.addEventListener("click",()=>{
    Info.classList.toggle("activo");
    bninfo.classList.toggle("activo");
});