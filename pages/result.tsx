import * as React from "react";
import { useRouter } from "next/router";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Page from "../components/page";
import Score from "../components/score";
import questionsJSON from "../questions.json";

const scores = questionsJSON.scores;
const topics = questionsJSON.topics;

const mockScore = { id: "", value: 0 };

const minMaxScores: [number, number][] = scores.map((score) => {
    let minScoreValue = 0;
    let maxScoreValue = 0;

    topics.forEach((topic) => {
        topic.questions.forEach((question) => {
            const lastIndex = question.answers.length - 1;

            let answerScores = question.answers.map(
                (answer) =>
                    (answer.scores.find((v) => v.id == score.id) ?? mockScore)
                        .value
            );

            let questionMinScore = Math.min(
                ...answerScores.slice(0, lastIndex)
            );
            let questionMaxScore = Math.max(
                ...answerScores.slice(0, lastIndex)
            );

            if (question.type == "several") {
                // These variables are needed to avoid double counting of the min/max in the loop
                let severalQuestionMinScore = questionMinScore;
                let severalQuestionMaxScore = questionMaxScore;

                answerScores.forEach((score, i) => {
                    if (i != lastIndex) {
                        severalQuestionMinScore = Math.min(
                            severalQuestionMinScore + score,
                            severalQuestionMinScore
                        );
                        severalQuestionMaxScore = Math.max(
                            severalQuestionMaxScore + score,
                            severalQuestionMaxScore
                        );
                    } else {
                        severalQuestionMinScore = Math.min(
                            score,
                            severalQuestionMinScore
                        );
                        severalQuestionMaxScore = Math.max(
                            score,
                            severalQuestionMaxScore
                        );
                    }
                });

                questionMinScore = severalQuestionMinScore - questionMinScore;
                questionMaxScore = severalQuestionMaxScore - questionMaxScore;
            }

            minScoreValue += questionMinScore;
            maxScoreValue += questionMaxScore;
        });
    });

    return [minScoreValue, maxScoreValue];
});

export default function Result() {
    const { query } = useRouter();

    const queryValidated = scores.reduce(
        (prev, score, i) =>
            typeof query[score.id] === "string" &&
            parseInt(query[score.id]! as string) >= minMaxScores[i][0] &&
            parseInt(query[score.id]! as string) <= minMaxScores[i][1] &&
            prev,
        true
    );

    return (
        <Page title="Results">
            {queryValidated ? (
                <Stack spacing={3}>
                    <Stack spacing={2}>
                        {scores.map((score, i) => {
                            let [min, max]: [number, number] = minMaxScores[i];
                            let value =
                                (100 *
                                    (parseInt(query[score.id]! as string) -
                                        min)) /
                                (max - min);
                            return (
                                <Score
                                    score={score}
                                    value={value}
                                    key={score.id}
                                />
                            );
                        })}
                    </Stack>
                    <Button variant="contained" href="/test">
                        Start again
                    </Button>
                </Stack>
            ) : (
                <Stack spacing={10} alignItems="center">
                    <Typography variant="h2" color="error" align="center">
                        Stop tampering with the URL, there{"'"}s literally no
                        way you could get this link by completing the test!
                    </Typography>
                    <Box>
                        <Button variant="contained" href="/test">
                            How about actually doing the thing?
                        </Button>
                    </Box>
                </Stack>
            )}
        </Page>
    );
}
