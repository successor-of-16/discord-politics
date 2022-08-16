import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Page from "../components/page";
import questionsJSON from "../questions.json";

export default function Home() {
    return (
        <Page title="Welcome!">
            <Stack spacing={10} alignItems="center">
                <Typography component="p" variant="h4" align="center">
                    {questionsJSON.description}
                </Typography>
                <Box>
                    <Button variant="contained" href="/test">
                        Start the test
                    </Button>
                </Box>
            </Stack>
        </Page>
    );
}
