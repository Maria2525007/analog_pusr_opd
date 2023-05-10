import React from 'react';

class AnalogMovementTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            targetPosition: 0,
            isMovingRight: true,
            cursorPosition: 0,
            progress: 0,
            startTime: null,
            endTime: null,
            isTestStarted: false,
            showTest: false,
        };
    }

    componentDidMount() {
        this.intervalId = setInterval(this.moveTarget, 10);
        document.addEventListener("keydown", this.handleKeyPress);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);
        document.removeEventListener("keydown", this.handleKeyPress);
    }

    startTest = () => {
        this.setState({
            isTestStarted: true,
            targetPosition: 200,
            isMovingRight: true,
            cursorPosition: 200,
            progress: 0,
            startTime: null,
            endTime: null,
            showTest: true,
        });
    };

    moveTarget = () => {
        const { targetPosition, isMovingRight } = this.state;
        const maxPosition = 675; // максимальная позиция вправо
        const minPosition = 200; // максимальная позиция влево

        const step = 2; // размер шага движения шара

        let newPosition = targetPosition + (isMovingRight ? step : -step);

        if (newPosition > maxPosition) {
            newPosition = maxPosition;
            this.setState({ isMovingRight: false });
        } else if (newPosition < minPosition) {
            newPosition = minPosition;
            this.setState({ isMovingRight: true });
        }

        this.setState({ targetPosition: newPosition });
    };

    handleKeyPress = (event) => {
        const { targetPosition, cursorPosition, startTime } = this.state;
        const endTime = new Date();
        const newCursorPosition = event.keyCode === 37
            ? Math.max(cursorPosition - 10, 200) // left arrow
            : event.keyCode === 39
                ? Math.min(cursorPosition + 10, 675) // right arrow
                : cursorPosition; // do nothing if other key is pressed

        const progress = this.calculateProgress(targetPosition, newCursorPosition);

        this.setState({
            cursorPosition: newCursorPosition,
            progress: progress,
            startTime: startTime ? startTime : new Date(),
            endTime: endTime,
        });
    };

    calculateProgress = (targetPosition, cursorPosition) => {
        const { progress, prevTimestamp } = this.state;
        const distance = Math.abs(targetPosition - cursorPosition);
        const timestamp = Date.now();
        let newProgress = progress;
        if (distance <= 50) { // если шарики пересекаются
            const timeDiff = timestamp - prevTimestamp;
            const progressDiff = Math.floor(timeDiff / 30);
            newProgress = Math.min(progress + progressDiff, 100);
        }
        this.setState({ prevTimestamp: timestamp });
        return newProgress;
    };



    render() {
        const { showTest, targetPosition, cursorPosition, progress } = this.state;

        return (
            <div style={{ textAlign: "center" }}>
                {!showTest && (
                    <>
                        <h1>Аналоговое преследование</h1>
                        <button onClick={this.startTest}>Начать тест</button>
                    </>
                )}
                {showTest && (
                    <>
                        <h1>Тест аналогового преследования</h1>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <div
                                style={{
                                    position: "relative",
                                    width: "500px",
                                    height: "50px",
                                    backgroundColor: "lightgray",
                                }}
                            />
                            <div
                                style={{
                                    position: "fixed",
                                    left: `${targetPosition + 250}px`,
                                    top: "70px",
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    backgroundColor: "red",
                                }}
                            />
                            <div
                                style={{
                                    position: "fixed",
                                    left: `${cursorPosition + 250}px`,
                                    bottom: "12px",
                                    width: "50px",
                                    top: "70px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    backgroundColor: "blue",
                                }}
                            />
                        </div>
                        <div style={{ marginTop: "20px" }} />
                        <progress value={progress} max="100" />
                        <button onClick={this.startTest}>Перезапустить тест</button>
                    </>
                )}
            </div>
        );
    }


}

export default AnalogMovementTest;