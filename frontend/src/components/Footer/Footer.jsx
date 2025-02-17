import React from 'react'

const Footer = () => {
    return (
        <div>
            <>
                <footer className="footer">

                    <div className="template-demo">
                        <button type="button" className="btn social-btn btn-rounded btn-facebook">
                            <i className="mdi mdi-facebook"></i>
                        </button>
                        <button type="button" className="btn social-btn btn-rounded btn-twitter">
                            <i className="mdi mdi-twitter"></i>
                        </button>
                        <button type="button" className="btn social-btn btn-rounded btn-dribbble">
                            <i className="mdi mdi-dribbble"></i>
                        </button>
                        <button type="button" className="btn social-btn btn-rounded btn-linkedin">
                            <i className="mdi mdi-linkedin"></i>
                        </button>
                        <button type="button" className="btn social-btn btn-rounded btn-google">
                            <i className="mdi mdi-google-plus"></i>
                        </button>
                        
                    </div>
                    <div className="container-fluid clearfix">
                        {/* <span className="text-muted d-block text-center text-sm-left d-sm-inline-block"></span> */}
                        <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center"> Copyright © Fast Investment Limited 2025</span>
                    </div>
                </footer>
            </>
        </div>
    )
}

export default Footer;