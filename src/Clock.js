import React from "react";

class Clock extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            sessionLength: 1500,
            breakLength: 300,
            timerLabel: "Session",
            timeLeft: 1500,
            isCountingDown: false,
        }
        this.timer = 0;
        this.beep = document.getElementById("beep");
        this.sessionDecrement = this.sessionDecrement.bind(this);
        this.sessionIncrement = this.sessionIncrement.bind(this);
        this.breakDecrement = this.breakDecrement.bind(this);
        this.breakIncrement = this.breakIncrement.bind(this);
        this.startStop = this.startStop.bind(this);
        this.countDown = this.countDown.bind(this);
        this.reset  = this.reset.bind(this);
    }

    sessionDecrement(){
        if (!this.state.isCountingDown){
            this.setState((state, props) => {
                var newSessionLength;
    
                if (state.sessionLength === 60){
                    newSessionLength = state.sessionLength;
                }
    
                else{
                    newSessionLength = state.sessionLength - 60;
                }
    
                return{
                    timeLeft: newSessionLength,
                    sessionLength: newSessionLength
                };
            });
        }
    }

    sessionIncrement(){
        if (!this.state.isCountingDown){
            this.setState((state, props) => {
                var newSessionLength;
    
                if (state.sessionLength === 3600){
                    newSessionLength = state.sessionLength;
                }
    
                else{
                    newSessionLength = state.sessionLength + 60;
                }
    
                return{
                    timeLeft: newSessionLength,
                    sessionLength: newSessionLength
                };
            });
        }
    }

    breakDecrement(){
        if (!this.state.isCountingDown){
            this.setState((state, props) => {
                var newBreakLength;
    
                if (state.breakLength === 60){
                    newBreakLength = state.breakLength;
                }
    
                else{
                    newBreakLength = state.breakLength - 60;
                }
    
                return{
                    breakLength: newBreakLength
                };
            });
        }
    }

    breakIncrement(){
        if (!this.state.isCountingDown){
            this.setState((state, props) => {
                var newBreakLength;
    
                if (state.breakLength === 3600){
                    newBreakLength = state.breakLength;
                }
    
                else{
                    newBreakLength = state.breakLength + 60;
                }
    
                return{
                    breakLength: newBreakLength
                };
            });
        }
    }

    startStop(){
        var newIsCountingDown;

        this.setState((state, props) => {
            if (state.isCountingDown){ // to pause/stop the timer
                newIsCountingDown = false;
                clearInterval(this.timer);
            }

            else{ // to start the timer
                newIsCountingDown = true;
                this.timer = setInterval(this.countDown, 1000);

                if (state.timeLeft <= 60){
                    setWarningTimeLeft();
                }

                else{
                    setNormalTimeLeft();
                }
            }

            return{
                isCountingDown: newIsCountingDown
            };
        });
    }

    countDown(){
        this.setState((state, props) => {
            var newTimerLabel;
            var newTimeLeft;

            if (state.timeLeft <= 60){
                // to indicate that the time is running out (< 1 minute left)
                setWarningTimeLeft();
            }

            if (state.isCountingDown && state.timeLeft >= 1){
                newTimerLabel = state.timerLabel;
                newTimeLeft = state.timeLeft - 1;
            }

            else if (state.isCountingDown && state.timeLeft === 0){
                if (state.timerLabel === "Session"){ // if the Session has ended
                    newTimerLabel = "Break";
                    newTimeLeft = state.breakLength;
                    setNormalTimeLeft();
                    this.beep.play();
                }

                else if (state.timerLabel === "Break"){ // if the Break has ended
                    newTimerLabel = "Session";
                    newTimeLeft = state.sessionLength;
                    setNormalTimeLeft();
                    this.beep.play();
                }
            }

            return{
                timerLabel: newTimerLabel,
                timeLeft: newTimeLeft
            };
        });
    }

    reset(){
        clearInterval(this.timer);
        setNormalTimeLeft();
        this.beep.pause(); // stop the beep audio
        this.beep.currentTime = 0; // rewind the beep audio to the beginning
        this.setState((state, props) => {
            return{
                sessionLength: 1500,
                breakLength: 300,
                timerLabel: "Session",
                timeLeft: 1500,
                isCountingDown: false,
            };
        })
    }

    render(){
        var startStopClass;

        if (this.state.isCountingDown){
            startStopClass = "fa-solid fa-pause";
        }

        else{
            startStopClass = "fa-solid fa-play";
        }

        return (
            <div id="wrapper" class="row d-flex justify-content-center text-center">
                <div id="timer">
                    <div id="timer-label"><u>{this.state.timerLabel}</u></div>
                    <div id="time-left">{toMMSS(this.state.timeLeft)}</div>
                </div>
                <div id="incrementsDecrements" class="row d-flex justify-content-center">
                    <div id="sessionIncrementDecrement" class="col-sm-5">
                        <div id="session-label" class="col-sm-15 change-label">Session Length</div>
                        <div class="row d-flex justify-content-center">
                            <button class="button col-sm-2"><i id="session-decrement" class="fa-solid fa-arrow-down" onClick={this.sessionDecrement}></i></button>
                            <div id="session-length" class="col-sm-2 length-label">{this.state.sessionLength / 60}</div>
                            <button class="button col-sm-2"><i id="session-increment" class="fa-solid fa-arrow-up" onClick={this.sessionIncrement}></i></button>
                        </div>
                    </div>
                    <div id="breakIncrementDecrement" class="col-sm-5">
                        <div id="break-label" class="col-sm-15 change-label">Break Length</div>
                        <div class="row d-flex justify-content-center">
                            <button class="button col-sm-2"><i id="break-decrement" class="fa-solid fa-arrow-down" onClick={this.breakDecrement}></i></button>
                            <div id="break-length" class="col-sm-2 length-label">{this.state.breakLength / 60}</div>
                            <button class="button col-sm-2"><i id="break-increment" class="fa-solid fa-arrow-up" onClick={this.breakIncrement}></i></button>
                        </div>
                    </div>
                </div>
                <div id="controlButtons" class="row d-flex justify-content-center">
                    <button class="button col-sm-1"><i id="start_stop" class={startStopClass} onClick={this.startStop}></i></button>
                    <button class="button col-sm-1"><i id="reset" class="fa-solid fa-arrows-rotate" onClick={this.reset}></i></button>
                </div>
            </div>
        )
    }
}

function toMMSS(inputInSeconds){
    var minutes = Math.floor(inputInSeconds / 60);

    if (minutes < 10){
        minutes = '0'.concat(minutes.toString());
    }

    var seconds = inputInSeconds % 60;

    if (seconds < 10){
        seconds = '0'.concat(seconds.toString());
    }

    return `${minutes}:${seconds}`
}

function setWarningTimeLeft(){
    document.getElementById("timer-label").style.color = "#FF2975";
    document.getElementById("time-left").style.color = "#FF2975";
}

function setNormalTimeLeft(){
    document.getElementById("timer-label").style.color = "#CCFF00";
    document.getElementById("time-left").style.color = "#CCFF00";
}

export default Clock;
