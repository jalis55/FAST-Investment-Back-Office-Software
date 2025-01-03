import { React, useState, useEffect } from 'react';
import api from '../../api';
import Wrapper from './Wrapper.jsx';
import Swal from "sweetalert2";

const Projects = () => {
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [users, setUsers] = useState([]);
    const [advisors, setAdvisors] = useState([{ userId: "", percentage: "" }]);
    const [advisorDetails, setAdvisorDetails] = useState([]);
    const [investors, setInvestors] = useState([{ userId: "", amount: "" }]);
    const [investorDetails, setInvestorDetails] = useState([]);
    const [errors, setErrors] = useState("");
    const [userId, setUserId] = useState(0);
    const [amount, setAmout] = useState();
    const [percentage, setPercentage] = useState();


    useEffect(() => {
        api
            .get("/api/admin/customers/")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    const handleProjectChange = (e, field) => {
        if (field === "name") setProjectName(e.target.value);
        if (field === "description") setProjectDescription(e.target.value);
    };
    const handleAddAdvisor = () => {
        if (!userId || !percentage) {
            Swal.fire("Error!", "Please select an investor and enter a valid amount.", "error");
            return;
        }

        const user = users.find((user) => user.id === parseInt(userId));
        if (!user) {
            Swal.fire("Error!", "Selected investor not found.", "error");
            return;
        }

        const newAdvisor = { userId: parseInt(userId), percentage: parseFloat(percentage) };

        // Check if the investor is already added
        if (advisors.some((investor) => advisors.userId === newAdvisor.userId)) {
            Swal.fire("Error!", "Investor already added.", "error");
            return;
        }
        // Update investors and investorDetails
        const newAdvisorDetails = {
            userId: user.id,
            name: user.name,
            email: user.email,
            percentage: parseFloat(percentage),
        };
        setAdvisors((prevAdvisors) => [...prevAdvisors, newAdvisor]);
        setAdvisorDetails((prevDetails) => [...prevDetails, newAdvisorDetails]);

        // Reset form fields
        setUserId(0);
        setAmout(0);

        Swal.fire("Success!", "Investor added successfully!", "success");
    }
    const handleAddInvestor = () => {
        if (!userId || !amount) {
            Swal.fire("Error!", "Please select an investor and enter a valid amount.", "error");
            return;
        }

        const user = users.find((user) => user.id === parseInt(userId));
        if (!user) {
            Swal.fire("Error!", "Selected investor not found.", "error");
            return;
        }

        const newInvestor = { userId: parseInt(userId), amount: parseFloat(amount) };

        // Check if the investor is already added
        if (investors.some((investor) => investor.userId === newInvestor.userId)) {
            Swal.fire("Error!", "Investor already added.", "error");
            return;
        }
        // Update investors and investorDetails
        const newInvestorDetails = {
            userId: user.id,
            name: user.name,
            email: user.email,
            amount: parseFloat(amount),
        };
        setInvestors((prevInvestors) => [...prevInvestors, newInvestor]);
        setInvestorDetails((prevDetails) => [...prevDetails, newInvestorDetails]);

        // Reset form fields
        setUserId(0);
        setAmout(0);

        Swal.fire("Success!", "Investor added successfully!", "success");
    };
    // const addNewAdvisor = () => setAdvisors([...advisors, { userId: "", percentage: "" }]);
    // const addNewInvestor = () => setInvestors([...investors, { userId: "", amount: "" }]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!projectName || !projectDescription) {
            setErrors("Project name and description are required.");
            return;
        }
        if (advisors.some((item) => item.userId === "" || item.percentage === "") ||
            investors.some((item) => item.userId === "" || item.amount === "")) {
            setErrors("All advisor and investor fields must be filled.");
            return;
        }

        setErrors(""); // Clear errors on successful validation

        // Submit form data
        const formData = {
            project: {
                project_title: projectName,
                project_description: projectDescription,
            },
            advisors,
            investors,
        };

        api.post("/api/stock/projects/", formData)
            .then(() => {
                Swal.fire("Success!", "Project created successfully!", "success");
                // Clear form fields
                setProjectName("");
                setProjectDescription("");
                setAdvisors([{ userId: "", percentage: "" }]);
                setInvestors([{ userId: "", amount: "" }]);
            })
            .catch((error) => {
                console.error("Error submitting form:", error);
                Swal.fire("Error!", "Failed to create project.", "error");
            });
    };
    return (
        <Wrapper>
            <h4 className="card-title">Create Project</h4>
            <form className="form-sample">
                <div className="row">
                    <div className="col-md-6">
                        <p className="card-description"> Project Info </p>
                        <div className="form-group">
                            <label htmlFor="projectName">Project Name</label>
                            <input type="text" className="form-control" id="projectName" placeholder="Project Name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="projectDescription">Project Description</label>
                            <textarea className="form-control" id="projectDescription" rows="2"></textarea>
                        </div>
                        <p className="card-description"> Financial Advisor </p>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="selectAdvisor1">Select Advisor</label>
                                    <select className="form-control"
                                        id="selectAdvisor1"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                    >
                                        <option>Select Advisor</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="selectCommission1">Commission %</label>
                                    <input type="number" className="form-control"
                                        id="selectCommission1"
                                        placeholder="Commission"
                                        value={percentage}
                                        onChange={(e) => setPercentage(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <button type="button" className="btn btn-primary" onClick={handleAddAdvisor}>Add Advisor</button>
                            </div>
                        </div>
                        <p className="card-description"> Investors </p>
                        <div className="row">

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="selectInvesor">Select Investor</label>
                                    <select className="form-control"
                                        id="selectInvesor"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                    >
                                        <option>Select Investor</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="selectAmount">Amount</label>
                                    <input type="number" className="form-control"
                                        id="selectAmount"
                                        placeholder="Amount"
                                        value={amount}
                                        onChange={(e) => setAmout(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <button type="button" className="btn btn-primary" onClick={handleAddInvestor}>Add Investor</button>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-6">
                        <h4 className='card-title'>Financial advisor</h4>
                        {advisorDetails && advisorDetails.length > 0 && (
                            <table class="table table-hover">
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
                                                <button className="btn badge-info">Edit</button>
                                                <button className="btn badge-danger" >Delete</button>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        )}


                        <h4 className='card-title'>Investor</h4>
                        {investorDetails && investorDetails.length > 0 && (
                            <table class="table table-hover">

                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Amount</th>
                                        <th>Action</th>

                                    </tr>
                                </thead>
                                <tbody >
                                    {investorDetails.map((investor, index) => (

                                        <tr key={index}>
                                            <td>{investor.name}</td>
                                            <td>{investor.email}</td>
                                            <td>{investor.amount}</td>
                                            <td>
                                                <button className="btn badge-info">Edit</button>
                                                <button className="btn badge-danger" >Delete</button>
                                            </td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        )}


                    </div>
                </div>
            </form>
        </Wrapper>
    );
};

export default Projects;
