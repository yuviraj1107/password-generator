const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const cpybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNum]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".gnr-btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols= '~!@#$%^&*()_-+={[]}|:;<,>.?/"';
let password=""; 
let passwordLength= 10;
let checkCount= 0;

handleSlider();
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

}

function setIndicator(color){
    indicator.style.backgroundColor=color;
}

function getRndInteger(min,max){
    Math.floor(Math.random()*(max-min))+min;
}

function getRndNumber(){
    return getRndInteger(0,9);
}

function getRndLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function getRndUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function getRndSymbol(){
    let rndNo=getRndInteger(0,symbols.length);
    return symbols.charAt(rndNo);
}

function calStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasSym=false;
    let hasNum=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
    
}

async function copyContent(){
    try{
        await navigator.clipbaoard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    copyMsg.classList.add("active");

    setTimeout( ()=>{copyMsg.classList.remove("active");},2000);
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

cpybtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();    
    }
})

function shufflePassword(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp =array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

generateBtn.addEventListener('click',()=>{
    // none of the checkboxes is ticked
    if(checkCount<=0)
        return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // lets start journey

    //remove old password
    password="";

    let funarr=[];

    if(uppercaseCheck.checked)
        funarr.push(getRndUpperCase);
    if(lowercaseCheck.checked)
        funarr.push(getRndLowerCase);
    if(numbersCheck.checked)
        funarr.push(getRndNumber);
    if(symbolsCheck.checked)
        funarr.push(getRndSymbol);

    //compulsory addition
    for(let i=0;i<funarr.length;i++){
        password +=funarr[i]();
    }

    // remaining addition 
    for(let i=0;i<passwordLength-funarr.length;i++){
        let getRndIdx= getRndInteger(0,funarr.length);
        password += funarr[getRndIdx]();
    }

    //shuffle password
    password=shufflePassword(Array.from(password));

    //show password in display
    passwordDisplay.value=password;

    //display strength
    calStrength();
});
