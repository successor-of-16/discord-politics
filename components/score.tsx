import * as React from "react";
import * as icons from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import * as Types from "../types";

const roundNumber = (num: number) =>
    Math.round((num + Number.EPSILON) * 100) / 100;

export default function Score({ score, value }: Types.ScoreProps) {
    const mode = useTheme().palette.mode;
    const colorLeft =
        mode == "dark"
            ? score.colorLeftDarkMode ?? score.colorLeft
            : score.colorLeft;
    const colorRight =
        mode == "dark"
            ? score.colorRightDarkMode ?? score.colorRight
            : score.colorRight;

    const gradient = `linear-gradient(90deg, ${colorLeft} 0%, ${colorLeft} ${
        100 - value
    }%, ${colorRight} ${100 - value}%, ${colorRight} 100%)`;

    const IconLeft = icons[score.iconLeft as keyof typeof icons];
    const IconRight = icons[score.iconRight as keyof typeof icons];

    let label = "";
    if (value == 50) {
        label = `${score.nameNeutral} neutral`;
    } else if (value > 50) {
        label = `${score.nameRight}: ${roundNumber(2 * (value - 50))}%`;
    } else {
        label = `${score.nameLeft}: ${roundNumber(2 * (50 - value))}%`;
    }

    return (
        <div className="flex-center flex-col">
            <div className="flex-center">
                <div
                    style={{
                        background: colorLeft,
                        color: mode == "dark" ? "black" : "white",
                    }}
                    className="w-10 h-10 rounded-full flex-center mr-[-1px]"
                >
                    {<IconLeft />}
                </div>
                <div
                    className="w-[1px] h-2 flex-center"
                    style={{ background: colorLeft }}
                ></div>
                <div
                    className="w-[19em] h-2 flex-center"
                    style={{ background: gradient }}
                ></div>
                <div
                    className="w-[1px] h-2 flex-center"
                    style={{ background: colorRight }}
                ></div>
                <div
                    style={{
                        background: colorRight,
                        color: mode == "dark" ? "black" : "white",
                    }}
                    className="w-10 h-10 rounded-full flex-center ml-[-1px]"
                >
                    {<IconRight />}
                </div>
            </div>
            <div className="text-sm mt-[-5px]">{label}</div>
        </div>
    );
}
