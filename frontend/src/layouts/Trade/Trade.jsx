import { React, useState } from 'react';
import Wrapper from '../Wrapper/Wrapper';
import api from '../../api';
import { set } from 'date-fns';
import BalanceCard from '../../components/BalanceCard';

const Trade = () => {

    const [searchId, setSearchId] = useState('');
    const [projectData, setProjectData] = useState({});
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [totalBuyAmount, setTotalBuyAmount] = useState(0);
    const [totalSellAmount, setTotalSellAmount] = useState(0);

    const findTotalInvestment = (data) => {
        const totalAmount = data.reduce((sum, investment) => sum + parseFloat(investment.amount), 0);
        setTotalInvestment(totalAmount);
        console.log(totalAmount);
    }

    const searchProject = (e) => {
        e.preventDefault();

        if (searchId === '') {
            alert('Please enter a project id');
            return;
        }

        //api call to search project
        api.get(`/api/stock/projects/${searchId}/`)
            .then(res => {
                console.log(res.data);
                setProjectData(res.data);
                findTotalInvestment(res.data.investments);
                setSearchId('');
            })
            .catch(err => {
                console.log(err);
            })

        console.log("searching project");
    }

    return (
        <Wrapper>
            <form className="ml-auto search-form d-md-block" action="#">
                <div className="form-group">
                    <input type="search" className="form-control"
                        placeholder="Search Project"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                </div>
                <button className='btn btn-primary' onClick={(e) => searchProject(e)}>search</button>
            </form>
            {projectData.project_id &&
                <div class="row  card-body ">
                    <BalanceCard title="Total Investment" amount={totalInvestment} />
                    <BalanceCard title="Total Buy Amount" amount={totalBuyAmount} />
                    <BalanceCard title="Total Sell Amount" amount={totalSellAmount} />
                    <BalanceCard title="Available Balance" amount={totalInvestment - totalBuyAmount + totalSellAmount} />

                </div>
            }
        </Wrapper>
    )
}

export default Trade