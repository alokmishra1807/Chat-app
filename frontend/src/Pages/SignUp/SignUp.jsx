import React, { useState } from 'react'
import GenderCheckbox from './GenderCheckbox';
import { Link } from 'react-router-dom';
import { set } from 'mongoose';
import useSignup from '../../Hooks/useSignup';

const SignUp = () => {
	const [Inputs, setInputs] = useState({
		fullName:"",
		username:"",
		password:"",
		confirmedPassword:"",
		gender:"",
	}); 


const handleCheckBoxChange =(gender) =>{
	setInputs({...Inputs,gender})
}

const {Loading,signup} = useSignup();

const handleSubmit = async(e)=>{
	e.preventDefault();
	  await signup(Inputs);
}



	return (
		<div className='flex flex-col items-center justify-center min-w-[26rem] mx-auto '>
			<div className='min-w-full w-[calc(100vh-px)] sm:w-auto  h-[calc(100vh-px)] sm:h-auto p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-gray-300'>
					Sign Up <span className='text-blue-500'> ChatApp</span>
				</h1>

				<form onSubmit={handleSubmit}>
					<div>
						<label className='label p-2'>
							<span className='text-base text-black label-text'>Full Name</span>
						</label>
						<input type='text' placeholder='Enter Your Name' className='w-full input input-bordered  h-10' 
						value = {Inputs.fullName}
						onChange={(e)=>setInputs({...Inputs, fullName:e.target.value})}/>
					</div>

					<div>
						<label className='label p-2 '>
							<span className='text-base text-black  label-text'>Username</span>
						</label>
						<input type='text' placeholder='Username' className='w-full input input-bordered h-10'
						value = {Inputs.username}
						onChange={(e)=>setInputs({...Inputs, username:e.target.value})}
						 />
					</div>

					<div>
						<label className='label'>
							<span className='text-base text-black label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full input input-bordered h-10'
							value = {Inputs.password}
						onChange={(e)=>setInputs({...Inputs, password:e.target.value})}
						/>
					</div>

					<div>
						<label className='label'>
							<span className='text-base text-black  label-text'>Confirm Password</span>
						</label>
						<input
							type='password'
							placeholder='Confirm Password'
							className='w-full input input-bordered h-10'
							value = {Inputs.confirmedPassword}
						onChange={(e)=>setInputs({...Inputs, confirmedPassword:e.target.value})}
						/>
					</div>

                       <GenderCheckbox onCheckBoxChange = {handleCheckBoxChange} selectGender ={Inputs.gender}/>
				
					   <Link 
  to="/login" 
  className='text-sm text-black font-semibold hover:underline hover:font-bold mt-2 inline-block'
>
  Already have an account?
</Link>

				

					<div>
						<button className='btn btn-block btn-sm mt-2 border border-slate-700' disabled={Loading}>
							{
          Loading? <span className='loading loading-spinner'></span>: "Sign Up"
							}
							
							
							</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp
