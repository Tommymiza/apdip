import React,{useEffect} from 'react';

const Test = () => {
    useEffect(() => {
        return () => {
            console.log('Hola')
        };
    }, []);
    return (
        <div>
            
        </div>
    );
}

export default Test;
