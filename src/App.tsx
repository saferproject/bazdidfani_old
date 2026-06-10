import createCache from "@emotion/cache";
import { Provider } from "react-redux";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./Stores/store";
import RouterHandler from "./router";
import { faIR as faIR_ } from "@mui/x-data-grid/locales";
import { Toaster } from "sonner";

function App() {
  const theme = createTheme({
    direction: "rtl",

    palette: {
      primary: {
        light: "#30eca5",
        main: "#00eb93",
        dark: "#00be77",
      },
      secondary: {
        light: "#79716B",
        main: "#57534D",
        contrastText: "#fff",
      },

      info: {
        light: "#AEBCD3",
        main: "#8DA2C6",
        dark: "#7474C1",
        contrastText: "#fff",
      },
      text: {
        disabled: "#9da6ad",
      },
    },
    components: {
      MuiTextField: {
        defaultProps: {
          autoComplete: "off",
          size: "small",
        },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          },
        },
      },

      MuiInput: {
        defaultProps: {
          autoComplete: "off",
          size: "small",
        },
      },

      MuiOutlinedInput: {
        defaultProps: {
          autoComplete: "off",
          size: "small",
        },
      },

      MuiFilledInput: {
        defaultProps: {
          autoComplete: "off",
          size: "small",
          sx: {
            "& .MuiInputBase-root": {
              borderRadius: 8,
            },
          },
        },
      },

      MuiAutocomplete: {
        defaultProps: {
          size: "small",
        },
      },

      MuiSelect: { defaultProps: { size: "small" } },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 700,
          },
        },
      },

      MuiDataGrid: {
        styleOverrides: {
          root: {
            "--DataGrid-containerBackground": "#f4f5f7",
            borderRadius: "8px",
            color: "#000",
            overflow: "hidden",
          },
          cell: {
            color: "#000000",
            position: "relative",
            "&:not(:last-child)::after": {
              content: '""',
              position: "absolute",
              top: "50%",
              right: 0,
              height: "50%",
              borderRight: "2px solid #ddd",
              transform: "translateY(-50%)",
            },
          },
        },
        defaultProps: {
          localeText: faIR_.components.MuiDataGrid.defaultProps.localeText,
          slotProps: {
            panel: {
              dir: "rtl",
            },
          },
        },
      },

      MuiPickersLayout: {
        styleOverrides: {
          root: {
            direction: "rtl",
          },
        },
      },

      // تنظیمات پایه‌ای برای تمام pickers
      MuiPickersPopper: {
        defaultProps: {
          dir: "rtl",
          size: "small",
        },
      },

      // تنظیمات DatePicker
      MuiDatePicker: {
        defaultProps: {
          size: "small",
          slotProps: {
            textField: {
              dir: "rtl",
            },
            popper: {
              dir: "rtl",
            },
          },
        },
      },

      // تنظیمات TimePicker
      MuiTimePicker: {
        defaultProps: {
          size: "small",
          slotProps: {
            textField: {
              dir: "rtl",
            },
            popper: {
              dir: "rtl",
            },
          },
        },
      },

      // تنظیمات DateTimePicker
      MuiDateTimePicker: {
        defaultProps: {
          size: "small",
          slotProps: {
            textField: {
              dir: "rtl",
            },
            popper: {
              dir: "rtl",
            },
          },
        },
      },
    },
    typography: {
      fontFamily: "Yekan Bakh FaNum",
    },
  });

  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  return (
    <Provider store={store}>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <div className="App" dir="rtl">
            <CssBaseline />
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
