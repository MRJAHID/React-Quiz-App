
const StartScreen = ({questionsLength}) => {
    return (
        <div className='start'>
            <h2>Welcome to the React Quiz</h2>
            <h3>{questionsLength} Questions to test your React mastery</h3>
            <button className='btn btn-ui'>Lets Start</button>
        </div>
    );
};

export default StartScreen;