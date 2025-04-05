import BarChart from "./componens/BarChart"
import React from 'react';

const Home = () => {
    return(
        <div>
            <BarChart title={'三大框架满意度'}/ > 
            <BarChart title={'三大框架使用度'}/ >
        </div>
    )
}

export default Home