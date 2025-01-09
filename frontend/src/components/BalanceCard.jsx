import React from 'react'

const BalanceCard = ({title,amount}) => {
    return (
        <div class="col-md-3 border mb-1 ml-1">
            <div class="d-flex align-items-center pb-2">
                <div class="dot-indicator bg-primary mr-2"></div>
                <p class="mb-0">{title}</p>
            </div>
            <h4 class="font-weight-semibold">${amount}</h4>
        </div>
    )
}

export default BalanceCard;