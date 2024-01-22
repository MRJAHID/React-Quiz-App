import {useReducer} from "react";

const initialState = {count: 0, step: 1};
const reducer = (state, action) => {
    switch (action.type) {
        case "increment":
            return {...state, count: state.count + state.step};
        case "decrement":
            return {...state, count: state.count - state.step};
        case "setCount":
            return {...state, count: action.payload};
        case "setStep":
            return {...state, step: action.payload};
        case "reset":
            return initialState;
        default:
            throw new Error("Invalid Action");
    }
}

function DateCounter() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {count, step} = state;

    // This mutates the date object.
    const date = new Date("june 21 2027");
    date.setDate(date.getDate() + count);

    const increment = function () {
        dispatch({type: 'increment'})
    };
    const decrement = function () {
        dispatch({type: 'decrement'})
    };


    const defineCount = function (e) {
        dispatch({
            type: 'setCount',
            payload: e.target.value
        })
    };

    const defineStep = function (e) {
        dispatch({
            type: 'setStep',
            payload: e.target.value
        })
    };

    const reset = function () {
        dispatch({
            type: 'reset'
        })
        // setCount(0);
        // setStep(1);
    };

    return (
        <div className="counter">
            <div>
                <input
                    type="range"
                    min="0"
                    max="10"
                    value={step}
                    onChange={defineStep}
                />
                <span>{step}</span>
            </div>

            <div>
                <button onClick={decrement}>-</button>
                <input value={count} onChange={defineCount}/>
                <button onClick={increment}>+</button>
            </div>

            <p>{date.toDateString()}</p>

            <div>
                <button onClick={reset}>Reset</button>
            </div>
        </div>
    );
}

export default DateCounter;