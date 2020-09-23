const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require('electron');
const windowStateKeeper = require('electron-window-state');
const log = require('electron-log');
const { dialog } = require('electron');


// Gardez une reference globale de l'objet window, si vous ne le faites pas, la fenetre sera
// fermee automatiquement quand l'objet JavaScript sera garbage collected.
let win;
let view ="home";


function createWindow () {
  // Save the window position and size
  let state = windowStateKeeper({
    defaultWidth: 288,
    defaultHeigh: 511,

  })
  //create window
  mainWindow = new BrowserWindow({
    x: state.x, y: state.y,
    width: state.width, height: state.height,
    resizable: false,
    center:true,
    backgroundColor: '#2c2f33',
    autoHideMenuBar:true,
    icon: __dirname + '/assets/diamondDColor.png',
    webPreferences: {
      nodeIntegration: true
    }
  })

  // load html openDevTools keep winPosition
  mainWindow.loadFile('renderer/main.html');
  //mainWindow.webContents.openDevTools();
  state.manage(mainWindow);

  globalShortcut.register('CommandOrControl+Q', () => {
    console.log('Q is pressed, app quitting');
    app.quit();
  })
  globalShortcut.register('Enter', ()=>{
    mainWindow.webContents.send('enter-pressed','enter');
  })
  //null the window's content
  mainWindow.on('closed', () => {
    win = null
  })

  //Check if the mainWindow is focused end allow the Enter Button
  mainWindow.on('focus', ()=>{
    globalShortcut.register('Enter', ()=>{
      mainWindow.webContents.send('enter-pressed','enter');
    })
  })
  mainWindow.on('blur', ()=>{
    globalShortcut.unregister('Enter');
  })

}

ipcMain.on('change-view', (event, args) => {
  view = args;
  switch(view) {
    case "home":
    mainWindow.loadFile('renderer/main.html');
    break;
    case "budget":
    mainWindow.loadFile('renderer/budget.html');
    break;
    case "spent":
    mainWindow.loadFile('renderer/spent.html');
    break;
    default:
    mainWindow.loadFile('renderer/main.html');
  }
})

//once the app is ready create the window
app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
//for mac
app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
