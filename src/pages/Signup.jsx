import { useState } from 'react';
import useCreateUser from '../utils/useCreateUser';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Google from '../../public/google.png';


const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const {createUser, oauthSignup} = useCreateUser();
  const navigate = useNavigate();


  const handleSignup = async (e) => {
    e.preventDefault();
    if(password === passwordConfirm){
        try {

          await createUser(email,username,password,passwordConfirm);
          navigate('/');
          
        } catch (error) {
          console.error('Signup error:', error.message);
          alert("Signup Error:", error.message);
        }
    }
    else{
        alert("Password did not match")
    }
    
  };

  
  return (   
    <div className='flex h-screen w-screen justify-center items-center bg-[#0e1116] text-white'>
      
      <div className='flex flex-col justify-center items-center bg-[#1c1f26] px-5 py-10 rounded-md'>
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
            onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
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

        <p className='text-sm text-gray-400 mt-5'>Or sign up with</p>
        <button onClick={oauthSignup} className='cursor-pointer bg-white rounded-md w-full mt-5 flex justify-center'>

          <img src={Google}  className='w-[30px]' />
        </button>
        
        <p className='text-slate-500 mt-5'>Already have an account?</p>
        <Link to="/login" className='text-slate-300'> Login</Link>
      </div>

      {/* {userName !== null && !isVerified && (<Verify  isVerified={isVerified} requestVerification={requestVerification} checkVerified={checkVerified} />)} */}
    </div>
  );
};

export default Signup;