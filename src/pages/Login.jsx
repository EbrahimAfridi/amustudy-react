import { useNavigate } from "react-router-dom";
import useLogin from "../utils/useLogin";
import { Link } from "react-router-dom";
import Google from '../../public/google.png';



const Auth = () => {
    const { email, setEmail, password, setPassword, login, handleSubmit, handleOauth } = useLogin();
    const navigate = useNavigate();

    

    if(login){
        navigate('/');
    }

    return(
        
        <div className="flex h-screen w-screen justify-center items-center bg-primary text-primary-text">
            <div className='flex flex-col justify-center items-center gap-5 bg-primary-light px-5 py-10 rounded-md'>
                 {/* <h1 className='text-3xl font-bold'>AMUStudy</h1> */}
                <h3 className='text-2xl font-semibold'>Login</h3>
                <form onSubmit={handleSubmit} className='flex flex-col items-center gap-6'>
                    <input 
                    type="text" 
                    className='px-4 py-2 rounded-md bg-transparent focus:outline-none'
                    value={email} 
                    onChange={(e)=> setEmail(e.target.value)}
                    placeholder="Email"
                    />

                    <input 
                    type="password" 
                    className='px-4 py-2 rounded-md bg-transparent focus:outline-none'
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Password"
                    />

                    <button type="submit" className='bg-green-500 w-[100%] py-2 mt-5 rounded-md text-primary-text hover:border-transparent'>Login</button>
                </form>
                <p className='text-sm text-gray-400 '>Or login with</p>
                <button onClick={handleOauth} className='cursor-pointer bg-white rounded-md w-full flex justify-center'>

                <img src={Google}  className='w-[30px]' />
                </button>
                <p className='text-slate-500 mt-5'>New to AMUStudy?</p>
                <Link to="/signup" className='text-slate-300'>Sign up</Link>
            </div>
        </div>
    )
}
export default Auth;