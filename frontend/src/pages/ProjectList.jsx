import React, { useState, useEffect } from 'react';
import api from '../api';

const ProjectList = () => {
    const [projectList, setProjectList] = useState([])
    // Fetch Users (Advisors & Investors)
    useEffect(() => {
        api
            .get('/api/stock/projects/') 
            .then((response) => {
                setProjectList(response.data);

            })
            .catch((error) => console.error('Error fetching users:', error));
    }, []);
    console.log(projectList)
    return (
        <div>ProjectList</div>
    )
}

export default ProjectList