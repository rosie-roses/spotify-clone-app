import "@/styles/globals.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import '@fontsource-variable/nunito';
import '@fontsource-variable/overpass';
import "@fontsource-variable/source-code-pro";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#050505",
      paper: "#050505"
    },
  },
  typography: {
    fontFamily: "'Overpass Variable', sans-serif",
    fontSize: 13,
  },
});

export default function App({ Component, pageProps }) {
  return (
    <AppCacheProvider {...pageProps}>
      <ThemeProvider theme={darkTheme} defaultMode="dark" disableTransitionOnChange noSsr>
        <CssBaseline />
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </AppCacheProvider>
  );
}
