// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const LoginPage = () => {
//   const [rollNumber, setRollNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(''); // Clear any previous error

//     try {
//       const response = await axios.post('http://localhost:3000/api/users/sign-in', {
//         roll_number: rollNumber,
//         password: password,
//       });
//       if (response.status === 200) {
//         localStorage.setItem('token', response.data.token);
//         alert('Logged in successfully!');
//         navigate('/presence_pulse'); // Redirect to the attendance page
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         setError('User does not exist. Please sign up first.');
//       } else {
//         setError('Wrong credentials. Please try again.');
//       }
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.formContainer}>
//         <h2>Student Login</h2>
//         <form onSubmit={handleLogin} style={styles.form}>
//           <div style={styles.inputGroup}>
//             <label htmlFor="rollNumber">Roll Number</label>
//             <input
//               type="text"
//               id="rollNumber"
//               value={rollNumber}
//               onChange={(e) => setRollNumber(e.target.value)}
//               required
//               style={styles.input}
//             />
//           </div>
//           <div style={styles.inputGroup}>
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               style={styles.input}
//             />
//           </div>
//           <button type="submit" style={styles.button}>
//             Login
//           </button>
//           {error && <p style={styles.error}>{error}</p>}
//         </form>

//         <div style={styles.signUpLink}>
//           <p>Don't have an account?</p>
//           <button onClick={() => navigate('/signup')} style={styles.linkButton}>
//             Sign Up
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',  // Center horizontally
//     alignItems: 'center',      // Center vertically
//     height: '100vh',           // Full viewport height
//     backgroundColor: '#f0f0f0',
//   },
//   formContainer: {
//     maxWidth: '600px',
//     width: '100%',
//     padding: '20px',
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     backgroundColor: '#fff',
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//     textAlign: 'center',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   inputGroup: {
//     marginBottom: '15px',
//   },
//   input: {
//     width: '100%',
//     padding: '8px',
//     fontSize: '16px',
//     border: '1px solid #ccc',
//     borderRadius: '4px',
//   },
//   button: {
//     padding: '10px',
//     backgroundColor: '#4caf50',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   error: {
//     marginTop: '10px',
//     color: 'red',
//   },
//   signUpLink: {
//     marginTop: '15px',
//   },
//   linkButton: {
//     background: 'none',
//     border: 'none',
//     color: '#007bff',
//     cursor: 'pointer',
//   },
// };

// export default LoginPage;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const LoginPage = () => {
//   const [rollNumber, setRollNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(''); // Clear any previous error

//     try {
//       const response = await axios.post('http://localhost:3000/api/users/sign-in', {
//         roll_number: rollNumber,
//         password: password,
//       });
//       if (response.status === 200) {
//         localStorage.setItem('token', response.data.token);
//         alert('Logged in successfully!');
//         navigate('/presence_pulse'); // Redirect to the attendance page
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         setError('User does not exist. Please sign up first.');
//       } else {
//         setError('Wrong credentials. Please try again.');
//       }
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.formContainer}>
//         <h2>Student Login</h2>
//         <form onSubmit={handleLogin} style={styles.form}>
//           <div style={styles.inputGroup}>
//             <label htmlFor="rollNumber">Roll Number</label>
//             <input
//               type="text"
//               id="rollNumber"
//               value={rollNumber}
//               onChange={(e) => setRollNumber(e.target.value)}
//               required
//               style={styles.input}
//             />
//           </div>
//           <div style={styles.inputGroup}>
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               style={styles.input}
//             />
//           </div>
//           <button type="submit" style={styles.button}>
//             Login
//           </button>
//           {error && <p style={styles.error}>{error}</p>}
//         </form>

//         <div style={styles.signUpLink}>
//           <p>Don't have an account?</p>
//           <button onClick={() => navigate('/signup')} style={styles.linkButton}>
//             Sign Up
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',  // Center horizontally
//     alignItems: 'center',      // Center vertically
//     height: '100vh',           // Full viewport height
//     backgroundColor: '#f0f0f0',
//   },
//   formContainer: {
//     maxWidth: '600px',
//     width: '100%',
//     padding: '20px',
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     backgroundColor: '#fff',
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//     textAlign: 'center',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   inputGroup: {
//     marginBottom: '15px',
//   },
//   input: {
//     width: '100%',
//     padding: '8px',
//     fontSize: '16px',
//     border: '1px solid #ccc',
//     borderRadius: '4px',
//   },
//   button: {
//     padding: '10px',
//     backgroundColor: '#4caf50',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   error: {
//     marginTop: '10px',
//     color: 'red',
//   },
//   signUpLink: {
//     marginTop: '15px',
//   },
//   linkButton: {
//     background: 'none',
//     border: 'none',
//     color: '#007bff',
//     cursor: 'pointer',
//   },
// };

// export default LoginPage;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error

    try {
      const response = await axios.post('http://localhost:3000/api/users/sign-in', {
        roll_number: rollNumber,
        password: password,
      }, {
        withCredentials: true,  // Ensure cookies are included with the request
      });
      
      if (response.status === 200) {
        alert('Logged in successfully!');
        navigate('/presence_pulse'); // Redirect to the attendance page
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('User does not exist. Please sign up first.');
      } else {
        setError('Wrong credentials. Please try again.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Student Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="rollNumber">Roll Number</label>
            <input
              type="text"
              id="rollNumber"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>

        <div style={styles.signUpLink}>
          <p>Don't have an account?</p>
          <button onClick={() => navigate('/signup')} style={styles.linkButton}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',  // Center horizontally
    alignItems: 'center',      // Center vertically
    height: '100vh',           // Full viewport height
    backgroundColor: '#f0f0f0',
  },
  formContainer: {
    maxWidth: '600px',
    width: '100%',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    marginTop: '10px',
    color: 'red',
  },
  signUpLink: {
    marginTop: '15px',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
  },
};

export default LoginPage;

