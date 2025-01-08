import React, { useState, useEffect } from "react";
import api from "../../api";
import Wrapper from "./Wrapper.jsx";
import Swal from "sweetalert2";

const Projects = () => {
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [users, setUsers] = useState([]);
    const [advisors, setAdvisors] = useState([]);
    const [advisorDetails, setAdvisorDetails] = useState([]);
    const [investors, setInvestors] = useState([]);
    const [investorDetails, setInvestorDetails] = useState([]);
    const [advisorForm, setAdvisorForm] = useState({ userId: "", percentage: "" });
    const [investorForm, setInvestorForm] = useState({ userId: "", amount: "" });
    const [errors, setErrors] = useState("");

    useEffect(() => {
        api
            .get("/api/admin/customers/")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    const handleAddAdvisor = () => {
        const { userId, percentage } = advisorForm;

        if (!userId || !percentage) {
            Swal.fire("Error!", "Please select an advisor and enter a valid commission percentage.", "error");
            return;
        }

        const user = users.find((user) => user.id === parseInt(userId));
        if (!user) {
            Swal.fire("Error!", "Selected advisor not found.", "error");
            return;
        }

        const newAdvisor = { advisor: parseInt(userId), com_percentage: parseFloat(percentage) };

        if (advisors.some((advisor) => advisor.advisor === newAdvisor.advisor)) {
            Swal.fire("Error!", "Advisor already added.", "error");
            return;
        }

        const newAdvisorDetails = {
            userId: user.id,
            name: user.name,
            email: user.email,
            percentage: parseFloat(percentage),
        };

        setAdvisors((prev) => [...prev, newAdvisor]);
        setAdvisorDetails((prev) => [...prev, newAdvisorDetails]);

        setAdvisorForm({ userId: "", percentage: "" });
        Swal.fire("Success!", "Advisor added successfully!", "success");
    };

    const handleAddInvestor = () => {
        const { userId, amount } = investorForm;

        if (!userId || !amount) {
            Swal.fire("Error!", "Please select an investor and enter a valid amount.", "error");
            return;
        }

        const user = users.find((user) => user.id === parseInt(userId));
        if (!user) {
            Swal.fire("Error!", "Selected investor not found.", "error");
            return;
        }

        const newInvestor = { investor: parseInt(userId), amount: parseFloat(amount) };

        if (investors.some((investor) => investor.investor === newInvestor.investor)) {
            Swal.fire("Error!", "Investor already added.", "error");
            return;
        }

        const newInvestorDetails = {
            userId: user.id,
            name: user.name,
            email: user.email,
            amount: parseFloat(amount),
        };

        setInvestors((prev) => [...prev, newInvestor]);
        setInvestorDetails((prev) => [...prev, newInvestorDetails]);

        setInvestorForm({ userId: "", amount: "" });
        Swal.fire("Success!", "Investor added successfully!", "success");
    };

    const handleDeleteAdvisor = (index) => {
        setAdvisors((prev) => prev.filter((_, i) => i !== index));
        setAdvisorDetails((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDeleteInvestor = (index) => {
        setInvestors((prev) => prev.filter((_, i) => i !== index));
        setInvestorDetails((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!projectName || !projectDescription) {
            setErrors("Project name and description are required.");
            return;
        }

        if (
            advisors.some((item) => !item.advisor || !item.com_percentage) ||
            investors.some((item) => !item.investor || !item.amount)
        ) {
            setErrors("All advisor and investor fields must be filled.");
            return;
        }

        setErrors("");

        const formData = {
            project_title: projectName,
            project_description: projectDescription,
            financial_advisors: advisors,
            investments: investors,
        };
        const pretty = JSON.stringify(formData, null, 2);
        console.log(pretty);

        api.post("/api/stock/projects/", formData)
            .then(() => {
                Swal.fire("Success!", "Project created successfully!", "success");
                setProjectName("");
                setProjectDescription("");
                setAdvisors([]);
                setInvestors([]);
                setAdvisorDetails([]);
                setInvestorDetails([]);
            })
            .catch((error) => {
                console.error("Error submitting form:", error);
                Swal.fire("Error!", "Failed to create project.", "error");
            });
    };

    return (
        <Wrapper>
            <h4 className="card-title">Create Project</h4>
            <form className="form-sample" onSubmit={handleSubmit}>
                <div className="row">
                    {/* Project Info */}
                    <div className="col-md-6">
                        <p className="card-description">Project Info</p>
                        <div className="form-group">
                            <label>Project Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Project Name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Project Description</label>
                            <textarea
                                className="form-control"
                                rows="2"
                                placeholder="Project Description"
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                            ></textarea>
                        </div>
                        {/* Advisor Form */}
                        <p className="card-description">Financial Advisor</p>
                        <div className="form-group">
                            <label>Select Advisor</label>
                            <select
                                className="form-control"
                                value={advisorForm.userId}
                                onChange={(e) => setAdvisorForm((prev) => ({ ...prev, userId: e.target.value }))}
                            >
                                <option value="">Select Advisor</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Commission %</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Commission"
                                value={advisorForm.percentage}
                                onChange={(e) => setAdvisorForm((prev) => ({ ...prev, percentage: e.target.value }))}
                            />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleAddAdvisor}>
                            Add Advisor
                        </button>
                        {/* Investor Form */}
                        <p className="card-description mt-4">Investors</p>
                        <div className="form-group">
                            <label>Select Investor</label>
                            <select
                                className="form-control"
                                value={investorForm.userId}
                                onChange={(e) => setInvestorForm((prev) => ({ ...prev, userId: e.target.value }))}
                            >
                                <option value="">Select Investor</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Amount"
                                value={investorForm.amount}
                                onChange={(e) => setInvestorForm((prev) => ({ ...prev, amount: e.target.value }))}
                            />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleAddInvestor}>
                            Add Investor
                        </button>
                    </div>
                    {/* Advisor and Investor Lists */}
                    <div className="col-md-6">
                        <h4>Financial Advisors</h4>
                        {advisorDetails.length > 0 ? (
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Commission %</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {advisorDetails.map((advisor, index) => (
                                        <tr key={index}>
                                            <td>{advisor.name}</td>
                                            <td>{advisor.percentage}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteAdvisor(index)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No advisors added yet.</p>
                        )}
                        <h4>Investors</h4>
                        {investorDetails.length > 0 ? (
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {investorDetails.map((investor, index) => (
                                        <tr key={index}>
                                            <td>{investor.name}</td>
                                            <td>{investor.email}</td>
                                            <td>{investor.amount}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteInvestor(index)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No investors added yet.</p>
                        )}
                    </div>
                </div>
                {/* Error Messages */}
                {errors && <p className="text-danger">{errors}</p>}
                <button type="submit" className="btn btn-success mt-4">
                    Create Project
                </button>
            </form>
        </Wrapper>
    );
};

export default Projects;
