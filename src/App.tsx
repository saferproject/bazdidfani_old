import { theme, cacheRtl } from "./app/theme";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./Stores/store";
import RouterHandler from "./router";
import { Toaster } from "sonner";
import UpdateDialog from "./pwa/UpdateDialog";

function App() {
  return (
    <Provider store={store}>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <div className="App notranslate" dir="rtl" lang="fa" translate="no">
            <CssBaseline />
            <UpdateDialog />
            <Toaster
              closeButton
              richColors
              position="bottom-center"
              duration={5000}
              toastOptions={{
                style: {
                  direction: "rtl",
                  fontFamily: "Yekan Bakh FaNum",
                },
              }}
            />
            <RouterHandler />
          </div>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}

export default App;
