import './App.css'
import Header from "./Header.jsx";
import Main from "./Main.jsx";
import {useEffect, useReducer} from "react";
import Loader from "./Loader.jsx";
import Error from "./Error.jsx";
import StartScreen from "./StartScreen.jsx";
import Questions from "./Questions.jsx";

// initialState of useReducer
const initialState = {
    questions: [],
    // 'loading', 'error', 'ready', 'active', 'finished'
    status: 'loading'
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

    const [{questions, status}, dispatch] = useReducer(reducer, initialState)

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
                {status === 'active' && <Questions/>}
            </Main>
        </div>
    )
}

export default App
