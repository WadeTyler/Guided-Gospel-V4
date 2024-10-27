
import { Link } from 'react-router-dom';

const Rates = () => {
  return (
    <div className="flex md:flex-row flex-col-reverse items-center justify-center w-full min-h-screen md:gap-16 gap-8 bg-white dark:bg-darkbg">
      
      <div className="form-container !h-full dark:text-darktext">
        <h2 className="text-3xl text-primary">How do Daily Message Rates Work?</h2>
        <section>
          <p className="text-xl">Daily Limit</p>
          <p>By default Guided Gospel provides a limit of 50 messages per day. Once, you send 50 messages, you will no longer be able to send any more. Because Guided Gospel is a free service, a daily limit is in place to prevent malicious users from abusing our service.</p>
        </section>

        <section>
          <p className="text-xl">How do I get more?</p>
          <p>Daily Limits reset at 12:00 AM EST (Midnight) every night. At the moment, there currently is no official way to get more than 50 message rates per day, but there is plans for in the future.</p>
        </section>

        <Link to="/settings" className="text-primary underline">Go Back</Link>

      </div>

      <div className="logo-container">
        <img src="./images/logo-3.png" alt="" className="rounded-full" /> 
      </div>

    </div>
  )
}

export default Rates