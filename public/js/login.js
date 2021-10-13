import {getCoordinates} from './getLocation.js';

//HTML 
const searchBtn = document.querySelector('#bookLorry'); 
const loginWindow = document.getElementById('loginWindow');
const loginDet = document.querySelector('.loginDet');
const phnoBtn = document.getElementById('phoneBtn');
const phoneNumber = document.getElementById('mobileNumber');
const errMsg = document.getElementById('errorMsg'); 
const otpLabel = document.getElementById('otpLabel'); 
const otpWindow = document.querySelectorAll('.login');
const inputBox = document.createElement('input');
const reSendBtn = document.createElement('button');
const otpMsg = document.getElementById('otpMsg');
let pin;
let numberRegistered  = false; 
let mobileNo;
let loginStatus = false; 

searchBtn.addEventListener('click',callLogin)
phnoBtn.addEventListener('click',storeNumber)

async function storeNumber(){
  mobileNo = phoneNumber.value;
  pin = inputBox.value;
  if(numberRegistered){
   checkOTP(mobileNo,pin); 
  }
  else if(mobileNo.length==10 && !isNaN(mobileNo))
  {
    phnoBtn.setAttribute('class','okBtn')
    sendOTP(mobileNo);
  }
  else{
    phnoBtn.setAttribute('class', 'errorBtn' )
    errMsg.style.display = 'block';
    errMsg.setAttribute('class','slideAction');
  }
}

async function sendOTP(phNumber){
    const OTPstatus = await fetch('/login',{
        method:'POST',
        headers:{
           'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phoneNumber: `+91${phNumber}`,
            channel:'sms'
        })
    })
    await OTPstatus.json().then(
      data=>{
         numberRegistered = data.status; 
    });
    if(numberRegistered){
        enterOTP(phNumber);
    }else{
    errMsg.style.display = 'block';
    errMsg.innerHTML = 'Too many attempts made'; 
    errMsg.setAttribute('class','slideAction');
    }
}

function enterOTP(mobileNo){
  for(let i=0; i<otpWindow.length;i++){
    otpWindow[i].style.display = 'none';
  }
  inputBox.setAttribute('maxlength','6');
  loginDet.insertBefore(inputBox,phnoBtn)
  otpLabel.innerHTML = `OTP has been sent to ${mobileNo.slice(-4)}`;
  reSendBtn.innerHTML = 'Resend Code';  
  reSendBtn.style.background = 'grey';
  reSendBtn.style.marginRight = '20px'
  reSendBtn.setAttribute('disabled',true); 
  loginDet.insertBefore(reSendBtn,phnoBtn)
  setTimeout(
    ()=>{
      reSendBtn.removeAttribute('disabled');
      reSendBtn.style.background = 'green';
    }, 30000
  )
}

async function checkOTP(phNo,pin){
  let pinStatus;
  let pinMsg='Please check network connection';
  if(pin.length!=6){
    incorrectPin('Code must be 6 digits');
  }else{
    const checkPin = await fetch('/login/verify',{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify ({ 
      phoneNumber: `+91${phNo}`,
      code: pin })
    }
  )
  await checkPin.json()
  .then( 
    data=>{ 
    pinStatus = data.status;
    pinMsg = data.msg;
    console.log(data);
  }).catch(error=>{
    pinStatus = false;
    pinMsg = error.msg;
    console.log(error);
  })
  
  if(pinStatus){
      addUser();
  }else{
    incorrectPin(pinMsg);
    console.log('entered');
  } 
}
}

async function addUser(){
    loginWindow.style.display = 'none';
    const user = await fetch ('/login/success',{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify ({ 
          phoneNumber: `+91${mobileNo}`,
          location: getCoordinates 
      })
      })
    await user.json().then(data=>{loginStatus=data.loginStatus});
    if(loginStatus)
    {
        loginPopup("Login Sucessful");
        loginWindow.style.display = 'none';
    }
}

 function incorrectPin(msg){
  phnoBtn.setAttribute('class', 'errorBtn' )
  errMsg.style.display = 'block';
  errMsg.innerHTML = msg;
  errMsg.setAttribute('class','slideAction');
}

reSendBtn.addEventListener('click',()=>{
    numberRegistered =false;
    otpMsg.innerHTML = `OTP resent to ${mobileNo.slice(-4)}`
    otpMsg.style.display = 'block';
    setInterval(
      ()=>{
        otpMsg.style.display = 'none';
      },30000
    )
    otpMsg.setAttribute('class','slideAction');
    storeNumber();
  })

  function callLogin(){
    loginWindow.style.display = 'block';
}


function loginPopup(message){
  const popupMsg = document.createElement('div');
  popupMsg.setAttribute('class','popup'); 
  popupMsg.innerText = message;
  document.body.appendChild(popupMsg);
}



