// src/components/ConfirmEmail.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmailConfirm = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const hasRun = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasRun.current) return;

    hasRun.current = true;

    const confirmEmail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/email-confirm/${token}/`);
        setLoading(false)
        if(!response.ok) {
          const err = await response.json();
          setMessage(err.error);
        }else{
            const data = await response.json();
            console.log(data.message);
            setMessage(data.message);
            setTimeout(() => {
              navigate('/login');
            }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    };
    confirmEmail();
  }, [token]);

  return (
    <div className='flex h-screen w-full justify-center items-center'>
      {loading ? "Verifying email" : <p className='text-2xl'>{message}</p>}
    </div>
  );
};

export default EmailConfirm;
