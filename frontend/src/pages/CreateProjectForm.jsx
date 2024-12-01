import React, { useState, useEffect } from 'react';
import api from '../api'; // Import your API service
import Swal from 'sweetalert2';

const CreateProjectForm = () => {
    // Project State
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    // Financial Advisors State
    const [advisors, setAdvisors] = useState([]);
    const [selectedAdvisor, setSelectedAdvisor] = useState('');
    const [advisorCommission, setAdvisorCommission] = useState('');
    const [advisorList, setAdvisorList] = useState([]);

    // Investors State
    const [investors, setInvestors] = useState([]);
    const [selectedInvestor, setSelectedInvestor] = useState('');
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [investorList, setInvestorList] = useState([]);

    // Fetch Users (Advisors & Investors)
    useEffect(() => {
        api
            .get('/api/admin/customers/') // Replace with your correct endpoint for fetching users
            .then((response) => {
                setAdvisors(response.data);
                setInvestors(response.data);
            })
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    // Add Financial Advisor to the list
    const addAdvisor = () => {
        if (!selectedAdvisor || !advisorCommission) {
            Swal.fire('Error', 'Select an advisor and enter a commission percentage', 'error');
            return;
        }

        if (advisorList.some((adv) => adv.advisor === selectedAdvisor)) {
            Swal.fire('Error', 'This advisor is already added', 'error');
            return;
        }

        const advisor = advisors.find((adv) => adv.id === parseInt(selectedAdvisor));
        setAdvisorList([...advisorList, { advisor: advisor.id, com_percentage: advisorCommission }]);
        setSelectedAdvisor('');
        setAdvisorCommission('');
    };

    // Add Investor to the list
    const addInvestor = () => {
        if (!selectedInvestor || !investmentAmount) {
            Swal.fire('Error', 'Select an investor and enter an investment amount', 'error');
            return;
        }

        if (investorList.some((inv) => inv.investor === selectedInvestor)) {
            Swal.fire('Error', 'This investor is already added', 'error');
            return;
        }

        const investor = investors.find((inv) => inv.id === parseInt(selectedInvestor));
        setInvestorList([...investorList, { investor: investor.id, amount: investmentAmount }]);
        setSelectedInvestor('');
        setInvestmentAmount('');
    };

    // Submit Project Data
    const handleSubmit = async () => {
        const projectData = {
            project_title: projectTitle,
            project_description: projectDescription,
            financial_advisors: advisorList,
            investments: investorList,
        };

        try {
            await api.post('/api/stock/projects/', projectData);
            Swal.fire('Success', 'Project created successfully!', 'success');
        } catch (error) {
            console.error('Error creating project:', error);
            Swal.fire('Error', 'Failed to create the project', 'error');
        }
    };

    return (
        <div>
            <h2>Create New Project</h2>

            <div className="mb-3">
                <label>Project Title</label>
                <input
                    type="text"
                    className="form-control"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label>Project Description</label>
                <textarea
                    className="form-control"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <h4>Add Financial Advisor</h4>
                <select
                    className="form-select"
                    value={selectedAdvisor}
                    onChange={(e) => setSelectedAdvisor(e.target.value)}
                >
                    <option value="">Select Advisor</option>
                    {advisors.map((advisor) => (
                        <option key={advisor.id} value={advisor.id}>
                            {advisor.name} ({advisor.email})
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    className="form-control mt-2"
                    placeholder="Commission Percentage (%)"
                    value={advisorCommission}
                    onChange={(e) => setAdvisorCommission(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={addAdvisor}>
                    Add Advisor
                </button>

                <ul>
                    {advisorList.map((adv, index) => (
                        <li key={index}>
                            Advisor ID: {adv.advisor}, Commission: {adv.com_percentage}%
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-3">
                <h4>Add Investor</h4>
                <select
                    className="form-select"
                    value={selectedInvestor}
                    onChange={(e) => setSelectedInvestor(e.target.value)}
                >
                    <option value="">Select Investor</option>
                    {investors.map((investor) => (
                        <option key={investor.id} value={investor.id}>
                            {investor.name} ({investor.email})
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    className="form-control mt-2"
                    placeholder="Investment Amount"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={addInvestor}>
                    Add Investor
                </button>

                <ul>
                    {investorList.map((inv, index) => (
                        <li key={index}>
                            Investor ID: {inv.investor}, Amount: ${inv.amount}
                        </li>
                    ))}
                </ul>
            </div>

            <button className="btn btn-success mt-3" onClick={handleSubmit}>
                Submit Project
            </button>
        </div>
    );
};

export default CreateProjectForm;
