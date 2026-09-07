import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { createTheme } from "@mui/material/styles";
import { faIR as faIR_ } from "@mui/x-data-grid/locales";

export const theme = createTheme({
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
          slotProps: {
            paper: { lang: "fa", translate: "no", className: "notranslate" },
            popper: { lang: "fa", translate: "no", className: "notranslate" },
          },
        },
      },

      MuiSelect: {
        defaultProps: {
          size: "small",
          MenuProps: {
            PaperProps: { lang: "fa", translate: "no", className: "notranslate" },
          },
        },
      },

      MuiMenu: {
        defaultProps: {
          PaperProps: { lang: "fa", translate: "no", className: "notranslate" },
        },
      },

      MuiModal: {
        defaultProps: {
          slotProps: {
            root: { lang: "fa", translate: "no", className: "notranslate" },
          },
        },
      },

      MuiDialog: {
        defaultProps: {
          PaperProps: { lang: "fa", translate: "no", className: "notranslate" },
        },
      },

      MuiTooltip: {
        defaultProps: {
          slotProps: {
            tooltip: { lang: "fa", translate: "no", className: "notranslate" },
          },
        },
      },

      MuiPopover: {
        defaultProps: {
          PaperProps: { lang: "fa", translate: "no", className: "notranslate" },
        },
      },

      MuiPopper: {
        defaultProps: {
          lang: "fa",
          translate: "no",
          className: "notranslate",
        },
      },

      MuiDrawer: {
        defaultProps: {
          PaperProps: { lang: "fa", translate: "no", className: "notranslate" },
        },
      },

      MuiSnackbar: {
        defaultProps: {
          lang: "fa",
          translate: "no",
          className: "notranslate",
        },
      },

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

export const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

