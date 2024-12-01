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

        const advisor = advisors.find((adv) => adv.id === parseInt(selectedAdvisor));
        const newAdvisor = { advisor: advisor.id, email: advisor.email, com_percentage: advisorCommission };

        setAdvisorList((prev) => {
            const existingAdvisor = prev.find((adv) => adv.advisor === newAdvisor.advisor);
            if (existingAdvisor) {
                Swal.fire('Error', 'This advisor is already added', 'error');
                return prev;
            }
            return [...prev, newAdvisor];
        });

        setSelectedAdvisor('');
        setAdvisorCommission('');
    };

    // Add Investor to the list
    const addInvestor = () => {
        if (!selectedInvestor || !investmentAmount) {
            Swal.fire('Error', 'Select an investor and enter an investment amount', 'error');
            return;
        }

        const investor = investors.find((inv) => inv.id === parseInt(selectedInvestor));
        const newInvestor = { investor: investor.id, email: investor.email, amount: investmentAmount };

        setInvestorList((prev) => {
            const existingInvestor = prev.find((inv) => inv.investor === newInvestor.investor);
            if (existingInvestor) {
                Swal.fire('Error', 'This investor is already added', 'error');
                return prev;
            }
            return [...prev, newInvestor];
        });

        setSelectedInvestor('');
        setInvestmentAmount('');
    };

    // Start editing an advisor
    const editAdvisor = (index) => {
        const advisorToEdit = advisorList[index];
        setSelectedAdvisor(advisorToEdit.advisor);
        setAdvisorCommission(advisorToEdit.com_percentage);
     
        removeAdvisor(index); // Remove the advisor from the list for editing
    };



    // Remove Advisor
    const removeAdvisor = (index) => {
        setAdvisorList((prev) => prev.filter((_, i) => i !== index));
    };

    // Start editing an investor
    const editInvestor = (index) => {
        const investorToEdit = investorList[index];
        setSelectedInvestor(investorToEdit.investor);
        setInvestmentAmount(investorToEdit.amount);
        removeInvestor(index); // Remove the investor from the list for editing
    };



    // Remove Investor
    const removeInvestor = (index) => {
        setInvestorList((prev) => prev.filter((_, i) => i !== index));
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
            // Reset form after successful submission
            setProjectTitle('');
            setProjectDescription('');
            setAdvisorList([]);
            setInvestorList([]);
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

                {advisorList.length > 0 && (
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Commission (%)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {advisorList.map((adv, index) => (
                                <tr key={index}>
                                    <td>{adv.email}</td>
                                    <td>{adv.com_percentage}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm" onClick={() => editAdvisor(index)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm ms-2" onClick={() => removeAdvisor(index)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
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

                {investorList.length > 0 && (
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Investment Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {investorList .map((inv, index) => (
                                <tr key={index}>
                                    <td>{inv.email}</td>
                                    <td>${inv.amount}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm" onClick={() => editInvestor(index)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm ms-2" onClick={() => removeInvestor(index)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>




            <button className="btn btn-success mt-3" onClick={handleSubmit}>
                Submit Project
            </button>
        </div>
    );
};

export default CreateProjectForm;