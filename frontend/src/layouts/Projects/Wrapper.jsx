import React from 'react'

const Wrapper = ({children}) => {
  return (
            <div className="content-wrapper">
                <div className="row">
                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                
                                {children}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
  )
}

export default Wrapper;