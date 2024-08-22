import { useEffect, useState } from 'react';
import useCreateUser from '../utils/useCreateUser';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import Dashboard from './Dashboard';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const {createUser, userName} = useCreateUser();
  const navigate = useNavigate();


  const handleSignup = async (e) => {
    e.preventDefault();
    if(password === passwordConfirm){
        try {

          createUser(email,username,password,passwordConfirm);

        } catch (error) {
            console.error('Signup error:', error.message);
          }
    }
    else{
        alert("Password did not match")
    }
    
  };

  useEffect(()=>{
    if (userName != null){
      navigate('/')
    }
  }, [])
  
  return (   
    <div className='flex h-screen w-screen justify-center items-center bg-[#fafbfb] text-white'>
      
      <div className='flex flex-col justify-center items-center bg-[#18181b] px-5 py-10 rounded-md'>
        {/* <h1 className='font-bold text-[2rem]'>AMUStudy</h1> */}
        <h3 className='text-[1.5rem] font-semibold mb-10'>Register</h3>
        <form onSubmit= {handleSignup} className='flex flex-col items-center gap-5'>
          <input
            type="email"
            value={email}
            onChange= {(e) => setEmail(e.target.value)}
            required
            placeholder='Email'
            className='px-4 py-2 bg-transparent focus:outline-none'
          />
          <input
            value={username}
            onChange= {(e) => setUsername(e.target.value)}
            required
            placeholder='Username'
            className='px-4 py-2 bg-transparent focus:outline-none'
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
            className='px-4 py-2 bg-transparent focus:outline-none'
          />
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            placeholder='Confirm Password'
            className='px-4 py-2 bg-transparent focus:outline-none'
          />
          <button type="submit" className='bg-green-500 w-[100%] py-2 rounded-md text-white'>Sign up</button>
        </form>
        <p className='text-slate-500 mt-5'>Already have an account?</p>
        <Link to="/login" className='text-slate-300'> Login</Link>
      </div>

      {/* {userName !== null && !isVerified && (<Verify  isVerified={isVerified} requestVerification={requestVerification} checkVerified={checkVerified} />)} */}
    </div>
  );
};

export default Signup;