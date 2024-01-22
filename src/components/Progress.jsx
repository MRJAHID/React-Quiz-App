const Progress = ({index, questionsLength, points, possiblePoints, answer}) => {
    return (
        <header className='progress'>
            {/*React default Progress bar*/}
            <progress max={questionsLength} value={index + Number(answer !== null)}/>

            <p>Question <strong>{index + 1}</strong> / {questionsLength}</p>
            <p><strong>{points}</strong> / {possiblePoints}</p>
        </header>
    );
};

export default Progress;