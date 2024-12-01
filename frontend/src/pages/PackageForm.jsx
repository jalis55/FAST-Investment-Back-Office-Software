import React, { useState, useEffect } from "react";
import api from "../api";
import Swal from "sweetalert2";

const ProjectForm = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [users, setUsers] = useState([]); // List of users for advisors and investors
  const [advisors, setAdvisors] = useState([]); // Advisor data
  const [investors, setInvestors] = useState([]); // Investor data
  const [errors, setErrors] = useState("");
  const [isAddingAdvisor, setIsAddingAdvisor] = useState(false);
  const [isAddingInvestor, setIsAddingInvestor] = useState(false);

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

  const handleAdvisorChange = (index, field, value) => {
    const updatedAdvisors = [...advisors];
    updatedAdvisors[index][field] = value;
    setAdvisors(updatedAdvisors);
  };

  const handleInvestorChange = (index, field, value) => {
    const updatedInvestors = [...investors];
    updatedInvestors[index][field] = value;
    setInvestors(updatedInvestors);
  };

  const addNewAdvisor = () => setAdvisors([...advisors, { userId: "", percentage: "" }]);
  const addNewInvestor = () => setInvestors([...investors, { userId: "", amount: "" }]);

  const removeAdvisor = (index) => {
    const updatedAdvisors = advisors.filter((_, i) => i !== index);
    setAdvisors(updatedAdvisors);
  };

  const removeInvestor = (index) => {
    const updatedInvestors = investors.filter((_, i) => i !== index);
    setInvestors(updatedInvestors);
  };

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

    api.post("/api/projects/", formData)
      .then(() => {
        Swal.fire("Success!", "Project created successfully!", "success");
        // Clear form fields
        setProjectName("");
        setProjectDescription("");
        setAdvisors([]);
        setInvestors([]);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        Swal.fire("Error!", "Failed to create project.", "error");
      });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name:</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => handleProjectChange(e, "name")}
            style={{ display: "block", width: "100%", marginBottom: "10px" }}
            placeholder="Enter project name"
          />
        </div>
        <div>
          <label>Project Description:</label>
          <textarea
            value={projectDescription}
            onChange={(e) => handleProjectChange(e, "description")}
            style={{ display: "block", width: "100%", marginBottom: "20px" }}
            placeholder="Enter project description"
          />
        </div>

        {/* Advisors Section */}
        <h4>Financial Advisors</h4>
        {advisors.length === 0 ? (
          <>
            <button type="button" onClick={() => setIsAddingAdvisor(true)}>
              Add Advisor
            </button>
            {isAddingAdvisor && (
              <div>
                <select
                  onChange={(e) => handleAdvisorChange(advisors.length, "userId", e.target.value)}
                  style={{ marginBottom: "10px", display: "block", width: "100%" }}
                >
                  <option value="">Select Advisor</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Commission (%)"
                  onChange={(e) => handleAdvisorChange(advisors.length, "percentage", e.target.value)}
                  style={{ display: "block", width: "100%", marginBottom: "10px" }}
                />
                <button type="button" onClick={addNewAdvisor}>
                  Save Advisor
                </button>
              </div>
            )}
          </>
        ) : (
          <table style={{ width: "100%", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Advisor</th>
                <th>Commission (%)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {advisors.map((advisor, index) => (
                <tr key={index}>
                  <td>{users.find((user) => user.id === advisor.userId)?.name}</td>
                  <td>{advisor.percentage}</td>
                  <td>
                    <button type="button" onClick={() => removeAdvisor(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Investors Section */}
        <h4>Investors</h4>
        {investors.length === 0 ? (
          <>
            <button type="button" onClick={() => setIsAddingInvestor(true)}>
              Add Investor
            </button>
            {isAddingInvestor && (
              <div>
                <select
                  onChange={(e) => handleInvestorChange(investors.length, "userId", e.target.value)}
                  style={{ marginBottom: "10px", display: "block", width: "100%" }}
                >
                  <option value="">Select Investor</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Investment Amount"
                  onChange={(e) => handleInvestorChange(investors.length, "amount", e.target.value)}
                  style={{ display: "block", width: "100%", marginBottom: "10px" }}
                />
                <button type="button" onClick={addNewInvestor}>
                  Save Investor
                </button>
              </div>
            )}
          </>
        ) : (
          <table style={{ width: "100%", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Investor</th>
                <th>Investment Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {investors.map((investor, index) => (
                <tr key={index}>
                  <td>{users.find((user) => user.id === investor.userId)?.name}</td>
                  <td>{investor.amount}</td>
                  <td>
                    <button type="button" onClick={() => removeInvestor(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {errors && <p style={{ color: "red" }}>{errors}</p>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProjectForm;
