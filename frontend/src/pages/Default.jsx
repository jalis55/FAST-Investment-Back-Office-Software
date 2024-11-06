import React from 'react'

const Default = () => {
    return (
        <div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Dashboard</h1>
            </div>


            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
                <div className="col">
                    <div className="card stat-card">
                        <div className="card-body">
                            <h5 className="card-title">Total Revenue</h5>
                            <p className="card-text fs-2 fw-bold">$45,231.89</p>
                            <p className="card-text"><small className="text-muted">+20.1% from last month</small></p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card stat-card">
                        <div className="card-body">
                            <h5 className="card-title">Subscriptions</h5>
                            <p className="card-text fs-2 fw-bold">2,350</p>
                            <p className="card-text"><small className="text-muted">+180.1% from last month</small></p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card stat-card">
                        <div className="card-body">
                            <h5 className="card-title">Active Now</h5>
                            <p className="card-text fs-2 fw-bold">573</p>
                            <p className="card-text"><small className="text-muted">+201 since last hour</small></p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Recent Activity</h3>
                </div>
                <div className="card-body">
                    <p>This is where you would display the main content for the selected tab.</p>
                </div>
            </div>
        </div>
    )
}

export default Default