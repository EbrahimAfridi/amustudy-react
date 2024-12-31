import { useEffect } from "react";

const Verify = ( { isVerified, requestVerification, checkVerified }) => {

    
    useEffect(() => {
        let verificationRequested = false;
        let intervalId;

        const checkVerification = () => {
            // if (!verificationRequested) {
            //     requestVerification();
            //     verificationRequested = true;
            // }

            const check = () => {
                console.log(isVerified);
                if (!isVerified) {
                    checkVerified();
                    intervalId = setTimeout(check, 5000);
                }
            };
            check();

            return () => clearTimeout(intervalId);
        };

        if (!isVerified) {
            intervalId = setTimeout(checkVerification, 0); // Start the verification process when the component mounts
        }

        return () => clearTimeout(intervalId); // Stop the verification process when the component unmounts
    }, [isVerified, requestVerification, checkVerified]);

    const handleVerifyClick = () => {
        if (!isVerified) {
            requestVerification();
        }
    };
    return(
        <>
            {!isVerified && (
                <div className="absolute bg-slate-100 font-medium text-center text-2xl px-5 py-10 shadow-lg">
                    <h2>Click here to verify your account!</h2>
                    <button onClick={handleVerifyClick} className="bg-blue-500 text-primary-text px-4 py-2 mt-10 rounded-md">Verify</button>
                </div>
            )}
        </>
    )
}
export default Verify;