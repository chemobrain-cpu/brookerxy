require("dotenv").config()
const secret = process.env.SECRET_KEY

module.exports.welcomeTemplate = (email) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">WELCOME <h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Welcome ${email} to stockexchagecryptomanagement.com. fund your account now to start live trading and enjoy hih margin profit within shortest time poosible. Our support team are available 24/7 to help you get started with all you need to do! </p>



    <div style=" margin-bottom: 30px; width: 100%; display: flex; flex-direction: row ">
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: center">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;text-align:center">Email</p>

        </div>
        



    </div>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align:center; font-weight: 400 ">Happy trading !!</h2>


</div>`
}
module.exports.fundTemplate = ( email,currency,amount) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">coincap.cloud Credited </h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your live trading  account has  been credited with  ${currency} ${amount} by stockexchange crypto management to start trading with. Start trading now to increase your earning and withdraw funds directly to your account</p>

    

    <h2 style=" margin-bottom:30px; width: 100%; text-align: center ">For your information </h2>



    <div style=" margin-bottom: 30px; width: 100%; display: flex; flex-direction: row ">
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: center">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;text-align:center">Email</p>

        </div>
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: center">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;text-align:center">${email}</p>

        </div>



    </div>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align:center; font-weight: 400 ">Happy trading !!</h2>


</div>`

}
module.exports.withdrawTemplate = ({email,currency,amount}) => {
    return `
<div >

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">coincap.cloud DEBIT </h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your live trading  account has  been debited  ${currency} ${amount} and the cash would be sent to your destination monetry address!!  </p>

      



    </div>


    <div style=" margin-bottom: 30px; width: 100%; display: flex; flex-direction: row ">
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: center">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;text-align:center">Email</p>

        </div>
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: center">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;text-align:center">${email}</p>

        </div>



    </div>


    <h2 style=" margin-bottom: 30px; width: 100%; text-align:center; font-weight: 400 ">Happy trading !!</h2>


</div>`

}




