import React, {FC} from "react";
import Matrix from "./Matrix";
import {start} from "../../services/local";

const Game: FC = () => {
    const getState = start(10, 20);
    return (
        <Matrix getGameState={getState} />
    )
}

export default Game