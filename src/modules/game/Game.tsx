import React, {FC} from "react";
import Matrix from "./Matrix";
import {start} from "../../services/local";

const Game: FC = () => {
    const controls = start(10, 10);
    return (
        <Matrix gameControls={controls} />
    )
}

export default Game