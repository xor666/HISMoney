//imports
const { app, ipcRenderer} = require('electron');


let littleMoneyCount = document.getElementsByClassName('little-money-count');// show the count of money
let moneyInput = document.getElementById('money-input'); //<input> at the top used to get an amount of money
let addMoneyButton = document.getElementById('add-button'); // <button>  used to add money from the input ^
let eraseMoneyButton = document.getElementById('erase-money-button');
let testSum= document.getElementById('divSum');


storage =[]
storage = JSON.parse(localStorage.getItem('little-money-storage')) || [];
sum=0.0; //sum of the money we must show onscreen
changeSum();//show the  sum of money at start



/*add money to localStorage*/
addMoneyButton.addEventListener('click', e =>{
  addMoney();
})
//clear little-money-storage
eraseMoneyButton.addEventListener('click', e =>{
  localStorage.clear('little-money-storage');
  sum=0;
  storage = [];
  changeSum();
})

ipcRenderer.on('enter-pressed', (e,args)=>{
  addMoney();
})

//Change sum function
function changeSum() {
  /*Change total*/
  for (var i = 0; i < storage.length; i++) {
    sum= sum + parseFloat(storage[i]);
  }
  console.log('sum test: '+ sum);
  testSum.innerHTML ="<p>"+sum+"€ </p>";
  sum=0;
}

//AddMoneyFunction
function addMoney(){
  if(moneyInput.value ==""){
    console.log('The money input is void');
  }
  else{
    storage.push(moneyInput.value)
    localStorage.setItem('little-money-storage', JSON.stringify(storage));
    moneyInput.value = null;
  }
  //change money count
  changeSum();
}
