const { app, BrowserWindow, shell, session } = require("electron");
const { registerMenuHandling } = require("./menuBarHandling");

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";

const createWindow = () => {
  const win = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      spellcheck: false,
    },
  });

  
  win.maximize();
  session.defaultSession.setUserAgent(userAgent);

  win.loadURL("https://teams.microsoft.com/", 
    { userAgent: userAgent }
  );

  registerMenuHandling(win);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith("https://teams.microsoft.com/")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
};

app.commandLine.appendSwitch('ignore-certificate-errors');

app.on("ready", () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["User-Agent"] = userAgent;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  createWindow();
});


