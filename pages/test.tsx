import * as React from "react";
import * as Types from "../types";

import Page from "../components/page";
import CheckboxForm from "../components/checkbox_form";
import RadioForm from "../components/radio_form";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";

import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";

import questionsJSON from "../questions.json";

const scores = questionsJSON.scores;
const topics = questionsJSON.topics;

const initialAnswerTable = (() => {
    let answerTable: Types.AnswerTable = [];

    topics.forEach((topic) => {
        let topicAnswerTable: Types.Choice[] = [];

        topic.questions.forEach((question) => {
            if (question.type == "one") {
                topicAnswerTable.push({ radio: -1, checkbox: [] });
            } else {
                topicAnswerTable.push({
                    radio: -2,
                    checkbox: question.answers.map(() => false),
                });
            }
        });

        answerTable.push(topicAnswerTable);
    });

    return answerTable;
})();

const initialTopicsTouched = topics.map((_, i) => i == 0);

const initialQuestionsTouched = topics.map((topic) =>
    topic.questions.map((_, i) => i == 0)
);

const scoreIndex = (() => {
    let scoreIndex: Record<string, number> = {};

    scores.forEach((score, i) => {
        scoreIndex[score.id] = i;
    });

    return scoreIndex;
})();

export default function Test() {
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    const [answerTable, setAnswerTable] =
        React.useState<Types.AnswerTable>(initialAnswerTable);
    const [curTopicIndex, setCurTopicIndex] = React.useState(0);
    const [curQuestionIndex, setCurQuestion] = React.useState(0);
    const [topicsTouched, setTopicsTouched] =
        React.useState(initialTopicsTouched);
    const [questionsTouched, setQuestionsTouched] = React.useState(
        initialQuestionsTouched
    );
    const [alertOpen, setAlertOpen] = React.useState(true);

    const choiceMade = (answer: Types.Choice) =>
        answer.radio >= 0 ||
        answer.checkbox.reduce((prev, cur) => prev || cur, false);

    const curAnswered = choiceMade(
        answerTable[curTopicIndex][curQuestionIndex]
    );

    const topicAnswered = (topicInd: number) => {
        return answerTable[topicInd].reduce(
            (prev, answer) => prev && choiceMade(answer),
            true
        );
    };

    const allAnswered = topics
        .map((_, i) => topicAnswered(i))
        .reduce((prev, topic) => prev && topic, true);

    const touchTopic = (topic: number) => {
        let newTopicsTouched = topicsTouched;
        newTopicsTouched[topic] = true;
        setTopicsTouched(newTopicsTouched);
    };

    const touchQuestion = (topic: number, question: number) => {
        let newQuestionsTouched = questionsTouched;
        newQuestionsTouched[topic][question] = true;
        setQuestionsTouched(newQuestionsTouched);
    };

    const setRadioAnswer = (event: React.ChangeEvent<HTMLInputElement>) => {
        let answer = parseInt((event.target as HTMLInputElement).value);

        let newAnswerTable = answerTable;
        newAnswerTable[curTopicIndex][curQuestionIndex].radio = answer;
        console.log(newAnswerTable[curTopicIndex][curQuestionIndex].radio);

        setAnswerTable(newAnswerTable);
        forceUpdate();
    };

    const setCheckboxAnswer = (event: React.ChangeEvent<HTMLInputElement>) => {
        let answerIndex = parseInt((event.target as HTMLInputElement).value);
        const lastIndex =
            topics[curTopicIndex].questions[curQuestionIndex].answers.length -
            1;

        let newAnswerTable = answerTable;
        // the change to newAnswer will be transfered by reference to the change of newAnswerTable
        let newAnswer =
            newAnswerTable[curTopicIndex][curQuestionIndex].checkbox;
        let currentChoice = newAnswer[answerIndex];
        newAnswer[answerIndex] = !currentChoice;

        if (answerIndex == lastIndex) {
            for (let i = 0; i < lastIndex; ++i) {
                newAnswer[i] = false;
            }
        } else {
            newAnswer[lastIndex] = false;
        }

        if (!newAnswer.reduce((prev, cur) => prev || cur, false)) {
            newAnswer[lastIndex] = true;
        }

        setAnswerTable(newAnswerTable);
        forceUpdate();
    };

    const setNextQuestion = () => {
        const nextQuestion = curQuestionIndex + 1;

        if (nextQuestion == topics[curTopicIndex].questions.length) {
            touchTopic(curTopicIndex + 1);
            touchQuestion(curTopicIndex + 1, 0);
            setCurTopicIndex(curTopicIndex + 1);
            setCurQuestion(0);
        } else {
            touchQuestion(curTopicIndex, nextQuestion);
            setCurQuestion(nextQuestion);
        }
    };

    const setPrevQuestion = () => {
        const prevQuestion = curQuestionIndex - 1;

        if (prevQuestion == -1) {
            setCurTopicIndex(curTopicIndex - 1);
            setCurQuestion(topics[curTopicIndex - 1].questions.length - 1);
        } else {
            console.log(curTopicIndex, prevQuestion);
            setCurQuestion(prevQuestion);
        }
    };

    const calculateScoreURL = () => {
        let scoresTotal: [string, number][] = scores.map((score) => [
            score.id,
            0,
        ]);

        answerTable.forEach((topic, topicInd) => {
            topic.forEach((choice, questionInd) => {
                topics[topicInd].questions[questionInd].answers.forEach(
                    (answer, answerInd) => {
                        answer.scores.forEach(({ id, value }) => {
                            if (
                                choice.radio == answerInd ||
                                choice.checkbox[answerInd]
                            ) {
                                scoresTotal[scoreIndex[id]][1] += value;
                            }
                        });
                    }
                );
            });
        });

        return `/result?${scoresTotal
            .map(([id, value]) => `${id}=${value}`)
            .join("&")}`;
    };

    const isLastStep =
        curTopicIndex == topics.length - 1 &&
        curQuestionIndex == topics[topics.length - 1].questions.length - 1;

    return (
        <Page title="Test">
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Stepper nonLinear activeStep={curTopicIndex}>
                    {topics.map((label, index) => {
                        let error;
                        index != curTopicIndex &&
                            topicsTouched[index] &&
                            !topicAnswered(index);

                        return (
                            <Step
                                key={label.topic}
                                completed={topicAnswered(index)}
                            >
                                <StepButton
                                    color="inherit"
                                    disabled={!topicsTouched[index]}
                                    onClick={() => {
                                        setCurTopicIndex(index);
                                        setCurQuestion(0);
                                    }}
                                    optional={
                                        error ? (
                                            <Typography
                                                variant="caption"
                                                color="error"
                                            >
                                                Questions unanswered!
                                            </Typography>
                                        ) : (
                                            <></>
                                        )
                                    }
                                >
                                    <StepLabel error={error}>
                                        {label.topic}
                                    </StepLabel>
                                </StepButton>
                            </Step>
                        );
                    })}
                </Stepper>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    {
                        <>
                            <Box sx={{ flex: "1 1 auto" }} />
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {topics[curTopicIndex].questions[
                                    curQuestionIndex
                                ].type == "one" ? (
                                    <RadioForm
                                        question={
                                            topics[curTopicIndex].questions[
                                                curQuestionIndex
                                            ]
                                        }
                                        setAnswer={setRadioAnswer}
                                        answer={
                                            answerTable[curTopicIndex][
                                                curQuestionIndex
                                            ].radio
                                        }
                                    />
                                ) : (
                                    <CheckboxForm
                                        question={
                                            topics[curTopicIndex].questions[
                                                curQuestionIndex
                                            ]
                                        }
                                        setAnswer={setCheckboxAnswer}
                                        answer={
                                            answerTable[curTopicIndex][
                                                curQuestionIndex
                                            ].checkbox
                                        }
                                    />
                                )}
                            </Box>
                            <Box sx={{ flex: "1 1 auto" }} />
                            {
                                <Box sx={{ width: "100%" }}>
                                    <Collapse
                                        in={
                                            alertOpen &&
                                            !allAnswered &&
                                            isLastStep &&
                                            curAnswered
                                        }
                                    >
                                        <Alert
                                            action={
                                                <IconButton
                                                    aria-label="close"
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => {
                                                        setAlertOpen(false);
                                                    }}
                                                >
                                                    <CloseIcon fontSize="inherit" />
                                                </IconButton>
                                            }
                                            severity="error"
                                        >
                                            The test cannot be finished, because
                                            you missed some questions! Click on
                                            the red steps and red circles to
                                            navigate through unanswered
                                            questions!
                                        </Alert>
                                    </Collapse>
                                </Box>
                            }
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    pt: 2,
                                }}
                            >
                                <Button
                                    color="inherit"
                                    disabled={
                                        curTopicIndex === 0 &&
                                        curQuestionIndex === 0
                                    }
                                    onClick={setPrevQuestion}
                                    sx={{ mr: 1 }}
                                >
                                    Back
                                </Button>
                                <Box sx={{ display: "flex" }}>
                                    {topics[curTopicIndex].questions.map(
                                        (question, ind) => {
                                            return (
                                                <IconButton
                                                    aria-label="delete"
                                                    disabled={
                                                        !questionsTouched[
                                                            curTopicIndex
                                                        ][ind]
                                                    }
                                                    size="small"
                                                    color={
                                                        curQuestionIndex == ind
                                                            ? "primary"
                                                            : choiceMade(
                                                                  answerTable[
                                                                      curTopicIndex
                                                                  ][ind]
                                                              )
                                                            ? "default"
                                                            : "error"
                                                    }
                                                    onClick={() =>
                                                        setCurQuestion(ind)
                                                    }
                                                    key={question.question}
                                                >
                                                    <CircleIcon />
                                                </IconButton>
                                            );
                                        }
                                    )}
                                </Box>
                                {isLastStep ? (
                                    <Button
                                        href={calculateScoreURL()}
                                        sx={{ mr: 1 }}
                                        disabled={!allAnswered}
                                    >
                                        Finish
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={setNextQuestion}
                                        sx={{ mr: 1 }}
                                        disabled={!curAnswered}
                                    >
                                        Next
                                    </Button>
                                )}
                            </Box>
                        </>
                    }
                </Box>
            </Box>
        </Page>
    );
}
