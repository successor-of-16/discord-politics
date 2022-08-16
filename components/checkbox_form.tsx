import * as React from "react";
import {
    FormControl,
    FormControlLabel,
    Checkbox,
    FormLabel,
    FormGroup,
    Radio,
} from "@mui/material";
import { CheckboxFormProps } from "../types";

export default function RadioForm({
    question,
    answer,
    setAnswer,
}: CheckboxFormProps) {
    return (
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
                {question.question}
            </FormLabel>
            <FormGroup>
                {question.answers
                    .slice(0, question.answers.length - 1)
                    .map((v, i) => (
                        <FormControlLabel
                            control={
                                <Checkbox value={i} onChange={setAnswer} />
                            }
                            label={v.answer}
                            value={i}
                            key={question.question + v.answer}
                            checked={answer[i]}
                        />
                    ))}
                <FormControlLabel
                    control={
                        <Radio
                            value={question.answers.length - 1}
                            onChange={setAnswer}
                            checked={answer[question.answers.length - 1]}
                        />
                    }
                    value={question.answers.length - 1}
                    label={question.answers[question.answers.length - 1].answer}
                />
            </FormGroup>
        </FormControl>
    );
}
