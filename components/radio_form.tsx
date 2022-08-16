import * as React from "react";
import {
    FormControl,
    FormControlLabel,
    Radio,
    FormLabel,
    RadioGroup,
} from "@mui/material";
import { RadioFormProps } from "../types";

export default function RadioForm({
    question,
    answer,
    setAnswer,
}: RadioFormProps) {
    return (
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
                {question.question}
            </FormLabel>
            <RadioGroup
                value={answer}
                name={question.question}
                onChange={setAnswer}
            >
                {question.answers.map((v, i) => {
                    return (
                        <FormControlLabel
                            control={<Radio />}
                            value={i}
                            label={v.answer}
                            key={question.question + v.answer}
                        />
                    );
                })}
            </RadioGroup>
        </FormControl>
    );
}
