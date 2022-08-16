export interface ScoreValue {
    id: string
    value: number
}

export interface Answer {
    answer: string
    scores: ScoreValue[]
}

export interface Question {
    question: string
    type: string
    answers: Answer[]
}

export interface Topic {
    topic: string
    questions: Question[]
}

export interface ScoreParams {
    nameRight: string
    nameLeft: string
    nameNeutral: string
    id: string
    iconLeft: string
    iconRight: string
    colorLeft: string
    colorRight: string
    colorLeftDarkMode?: string
    colorRightDarkMode?: string
}

export interface Choice {
    checkbox: boolean[]
    radio: number
}

export interface RadioFormProps {
    question: Question
    answer: number
    setAnswer: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export interface CheckboxFormProps {
    question: Question
    answer: boolean[]
    setAnswer: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export interface ScoreProps {
    score: ScoreParams;
    value: number;
}

export type AnswerTable = Choice[][]