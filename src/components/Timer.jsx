import React, {useEffect} from 'react';

const Timer = ({dispatch, secRemaining}) => {
    const minutes = Math.floor(secRemaining / 60);
    const seconds = secRemaining % 60;

    useEffect(function () {
       const id =  setInterval(() => {
            dispatch({
                type: 'tick',
            })
        }, 1000);

        return () => {
            clearInterval(id)
        }
    }, [dispatch])
    return (
        <div className='timer'>
            {minutes < 10 && '0'}{minutes} : {seconds < 10 && '0'}{seconds}
        </div>
    );
};

export default Timer;