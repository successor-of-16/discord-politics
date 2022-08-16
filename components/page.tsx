import * as React from "react";
import Head from "next/head";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Button, AppBar, Typography, Box, Toolbar } from "@mui/material";

import GitHubIcon from "@mui/icons-material/GitHub";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import { getCookie, setCookie } from "cookies-next";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export default function Page({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) {
    const themeCookie = getCookie("PreferableTheme");
    const themeQuery = useMediaQuery("(prefers-color-scheme: dark)");

    const prefersDarkMode = themeCookie ? themeCookie === "dark" : themeQuery;
    const [mode, setMode] = React.useState<"light" | "dark">("light");
    React.useEffect(
        () => setMode(prefersDarkMode ? "dark" : "light"),
        [prefersDarkMode]
    );
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const nextColor = prevMode === "light" ? "dark" : "light";
                    setCookie("PreferableTheme", nextColor);
                    return nextColor;
                });
            },
        }),
        []
    );
    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode]
    );

    return (
        <>
            <Head>
                <title>{`${title} | Discord Politics`}</title>
            </Head>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <Box
                        sx={{
                            width: "100%",
                            height: "100vh",
                            bgcolor: "background.default",
                            color: "text.primary",
                            display: "flex",
                            flexDirection: "column",
                            p: 0,
                        }}
                    >
                        <AppBar position="static">
                            <Toolbar>
                                <Typography
                                    component="h1"
                                    variant="h4"
                                    sx={{ flexGrow: 1 }}
                                >
                                    {title}
                                </Typography>
                                <Button
                                    color="inherit"
                                    startIcon={<GitHubIcon />}
                                    href="https://github.com/successor-of-16/discord-politics"
                                >
                                    Src
                                </Button>
                                <Button
                                    onClick={colorMode.toggleColorMode}
                                    color="inherit"
                                    startIcon={
                                        theme.palette.mode === "dark" ? (
                                            <Brightness7Icon />
                                        ) : (
                                            <Brightness4Icon />
                                        )
                                    }
                                    sx={{ width: "140px" }}
                                >
                                    {theme.palette.mode === "dark"
                                        ? "light"
                                        : "dark"}{" "}
                                    mode
                                </Button>
                            </Toolbar>
                        </AppBar>
                        <Box
                            sx={{
                                display: "flex",
                                width: "100%",
                                height: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "text.primary",
                                borderRadius: 1,
                                p: 3,
                            }}
                        >
                            {children}
                        </Box>
                    </Box>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </>
    );
}
