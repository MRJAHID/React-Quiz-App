import './App.css'
import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import {useEffect, useReducer} from "react";
import Loader from "./components/Loader.jsx";
import Error from "./components/Error.jsx";
import StartScreen from "./components/StartScreen.jsx";
import Questions from "./components/Questions.jsx";

// initialState of useReducer
const initialState = {
    questions: [],
    // 'loading', 'error', 'ready', 'active', 'finished'
    status: 'loading',
    index: 0,
    answer: null,
    points: 0
}

// reducer function of useReducer
function reducer(state, action) {
    switch (action.type) {
        case 'dataReceived':
            return {
                ...state,
                questions: action.payload,
                status: 'ready'
            }
        case 'dataFailed':
            return {
                ...state,
                status: 'error'
            }
        case 'newAnswer':
            const question = state.questions.at(state.index)
            return {
                ...state,
                answer: action.payload,
                points: action.payload === question.correctOption ? state.points + question.points : state.points,
            }
        case 'start':
            return {
                ...state,
                status: 'active'
            }
        default:
            throw new Error('Unknown action')
    }
}

function App() {

    const [{questions, status, index, answer}, dispatch] = useReducer(reducer, initialState)

    const questionsLength = questions.length;

    useEffect(() => {
        fetch('http://localhost:9000/questions')
            .then((res) => res.json())
            .then((data) => dispatch({
                type: 'dataReceived',
                payload: data
            }))
            .catch((err) => dispatch({
                type: 'dataFailed'
            }))
    }, []);

    return (
        <div className='app'>
            <Header/>
            <Main>
                {status === 'loading' && <Loader/>}
                {status === 'error' && <Error/>}
                {status === 'ready' && <StartScreen questionsLength={questionsLength} dispatch={dispatch}/>}
                {status === 'active' && <Questions answer={answer} dispatch={dispatch} question={questions[index]}/>}
            </Main>
        </div>
    )
}

export default App
