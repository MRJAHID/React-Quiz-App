import './App.css'
import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import {useEffect, useReducer} from "react";
import Loader from "./components/Loader.jsx";
import Error from "./components/Error.jsx";
import StartScreen from "./components/StartScreen.jsx";
import Questions from "./components/Questions.jsx";
import NextButton from "./components/NextButton.jsx";
import Progress from "./components/Progress.jsx";
import FinishedScreen from "./components/FinishedScreen.jsx";
import Timer from "./components/Timer.jsx";
import Footer from "./components/Footer.jsx";

const SECS_PER_QUESTIONS = 30;
// initialState of useReducer
const initialState = {
    questions: [],
    // 'loading', 'error', 'ready', 'active', 'finished'
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
    highScore: 0,
    secRemaining: 10
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
            let question = state.questions.at(state.index)
            return {
                ...state,
                answer: action.payload,
                points: action.payload === question.correctOption ? state.points + question.points : state.points,
            }
        case 'nextQuestion':
            return {
                ...state,
                index: state.index + 1,
                answer: null
            }
        case 'restartQuestion':
            return {
                ...initialState,
                questions: state.questions,
                status: 'ready',
            }
        case 'start':
            return {
                ...state,
                status: 'active',
                secRemaining: state.questions.length * SECS_PER_QUESTIONS
            }
        case 'finish':
            return {
                ...state,
                status: 'finished',
                highScore: state.points > state.highScore ? state.points : state.highScore
            }
        case 'tick':
            return {
                ...state,
                secRemaining: state.secRemaining - 1,
                status: state.secRemaining === 0 ? 'finished' : state.status
            }
        default:
            throw new Error('Unknown action')
    }
}

function App() {

    const [{questions, highScore, status, points, index, answer, secRemaining}, dispatch] = useReducer(reducer, initialState)

    const questionsLength = questions.length;
    const possiblePoints = questions.reduce((prev, curr) => prev + curr.points, 0)

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
                {status === 'active' && <>
                    <Progress answer={answer} possiblePoints={possiblePoints} points={points} index={index}
                              questionsLength={questionsLength}/>
                    <Questions answer={answer} dispatch={dispatch} question={questions[index]}/>
                    <Footer>
                        <Timer secRemaining={secRemaining} dispatch={dispatch}/>
                        <NextButton answer={answer} index={index} questionsLength={questionsLength}
                                    dispatch={dispatch}/>
                    </Footer>
                </>}
                {status === 'finished' &&
                    <FinishedScreen dispatch={dispatch} points={points} possiblePoints={possiblePoints}
                                    highScore={highScore}/>}

            </Main>
        </div>
    )
}

export default App
