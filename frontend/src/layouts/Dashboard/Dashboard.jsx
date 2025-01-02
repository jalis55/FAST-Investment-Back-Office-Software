import React from 'react'

const Dashboard = () => {
  return (
    <div className="content-wrapper">
    {/* <!-- Page Title Header Starts--> */}
    <div className="row page-title-header">
        <div className="col-12">
            <div className="page-header">
                <h4 className="page-title">Dashboard</h4>
                <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
                    <ul className="quick-links">
                        <li><a href="#">ICE Market data</a></li>
                        <li><a href="#">Own analysis</a></li>
                        <li><a href="#">Historic market data</a></li>
                    </ul>
                    <ul className="quick-links ml-auto">
                        <li><a href="#">Settings</a></li>
                        <li><a href="#">Analytics</a></li>
                        <li><a href="#">Watchlist</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="col-md-12">
            <div className="page-header-toolbar">
                <div className="btn-group toolbar-item" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-secondary"><i className="mdi mdi-chevron-left"></i></button>
                    <button type="button" className="btn btn-secondary">03/02/2019 - 20/08/2019</button>
                    <button type="button" className="btn btn-secondary"><i className="mdi mdi-chevron-right"></i></button>
                </div>
                <div className="filter-wrapper">
                    <div className="dropdown toolbar-item">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownsorting" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">All Day</button>
                        <div className="dropdown-menu" aria-labelledby="dropdownsorting">
                            <a className="dropdown-item" href="#">Last Day</a>
                            <a className="dropdown-item" href="#">Last Month</a>
                            <a className="dropdown-item" href="#">Last Year</a>
                        </div>
                    </div>
                    <a href="#" className="advanced-link toolbar-item">Advanced Options</a>
                </div>
                <div className="sort-wrapper">
                    <button type="button" className="btn btn-primary toolbar-item">New</button>
                    <div className="dropdown ml-lg-auto ml-3 toolbar-item">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownexport" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Export</button>
                        <div className="dropdown-menu" aria-labelledby="dropdownexport">
                            <a className="dropdown-item" href="#">Export as PDF</a>
                            <a className="dropdown-item" href="#">Export as DOCX</a>
                            <a className="dropdown-item" href="#">Export as CDR</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- Page Title Header Ends--> */}
    <div className="row">
        <div className="col-md-12 grid-margin">
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="d-flex">
                                <div className="wrapper">
                                    <h3 className="mb-0 font-weight-semibold">32,451</h3>
                                    <h5 className="mb-0 font-weight-medium text-primary">Visits</h5>
                                    <p className="mb-0 text-muted">+14.00(+0.50%)</p>
                                </div>
                                <div className="wrapper my-auto ml-auto ml-lg-4">
                                    <canvas height="50" width="100" id="stats-line-graph-1"></canvas>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mt-md-0 mt-4">
                            <div className="d-flex">
                                <div className="wrapper">
                                    <h3 className="mb-0 font-weight-semibold">15,236</h3>
                                    <h5 className="mb-0 font-weight-medium text-primary">Impressions</h5>
                                    <p className="mb-0 text-muted">+138.97(+0.54%)</p>
                                </div>
                                <div className="wrapper my-auto ml-auto ml-lg-4">
                                    <canvas height="50" width="100" id="stats-line-graph-2"></canvas>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mt-md-0 mt-4">
                            <div className="d-flex">
                                <div className="wrapper">
                                    <h3 className="mb-0 font-weight-semibold">7,688</h3>
                                    <h5 className="mb-0 font-weight-medium text-primary">Conversation</h5>
                                    <p className="mb-0 text-muted">+57.62(+0.76%)</p>
                                </div>
                                <div className="wrapper my-auto ml-auto ml-lg-4">
                                    <canvas height="50" width="100" id="stats-line-graph-3"></canvas>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mt-md-0 mt-4">
                            <div className="d-flex">
                                <div className="wrapper">
                                    <h3 className="mb-0 font-weight-semibold">1,553</h3>
                                    <h5 className="mb-0 font-weight-medium text-primary">Downloads</h5>
                                    <p className="mb-0 text-muted">+138.97(+0.54%)</p>
                                </div>
                                <div className="wrapper my-auto ml-auto ml-lg-4">
                                    <canvas height="50" width="100" id="stats-line-graph-4"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default Dashboard