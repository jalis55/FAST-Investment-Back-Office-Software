import React, { useState, useEffect } from "react";
import api from "../api";
import Swal from "sweetalert2";

const ProjectForm = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [users, setUsers] = useState([]); // List of users for advisors and investors
  const [advisors, setAdvisors] = useState([{ userId: "", percentage: "" }]); // Advisor data
  const [investors, setInvestors] = useState([{ userId: "", amount: "" }]); // Investor data
  const [errors, setErrors] = useState("");

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
        {advisors.map((_, index) => (
          <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <select
              value={advisors[index].userId}
              onChange={(e) => handleAdvisorChange(index, "userId", e.target.value)}
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
              value={advisors[index].percentage}
              onChange={(e) => handleAdvisorChange(index, "percentage", e.target.value)}
              placeholder="Commission (%)"
            />
          </div>
        ))}
        <button type="button" onClick={addNewAdvisor}>Add Advisor</button>

        {/* Investors Section */}
        <h4>Investors</h4>
        {investors.map((_, index) => (
          <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <select
              value={investors[index].userId}
              onChange={(e) => handleInvestorChange(index, "userId", e.target.value)}
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
              value={investors[index].amount}
              onChange={(e) => handleInvestorChange(index, "amount", e.target.value)}
              placeholder="Investment Amount"
            />
          </div>
        ))}
        <button type="button" onClick={addNewInvestor}>Add Investor</button>

        {errors && <p style={{ color: "red" }}>{errors}</p>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProjectForm;
