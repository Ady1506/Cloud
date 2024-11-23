// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';

// // const subjects = [
// //   { code: 'ADCS', name: 'Analog and Digital Communication Systems' },
// //   { code: 'AI', name: 'Artificial Intelligence' },
// //   { code: 'CAI', name: 'Conversational AI' },
// //   { code: 'CAO', name: 'Computer Architecture' },
// //   { code: 'DBMS', name: 'Database Management Systems' },
// //   { code: 'DSP', name: 'Digital Signal Processing' },
// //   { code: 'LICA', name: 'Linear Integrated Circuits and Applications' },
// //   { code: 'MOS', name: 'MOS (Microelectronic Circuits)' },
// //   { code: 'OS', name: 'Operating Systems' },
// //   { code: 'UIUX', name: 'UI/UX Design' },
// // ];

// // const MarkAttendancePage = () => {
// //   const [formData, setFormData] = useState({
// //     studentId: '',
// //     subjectCode: '',
// //     date: '',
// //     status: '',
// //   });
// //   const [errorMessage, setErrorMessage] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value,
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const response = await axios.post('http://localhost:3000/api/users/mark-attendance', formData);
// //       if (response.status === 200) {
// //         setSuccessMessage('Attendance marked successfully.');
// //         setErrorMessage('');
// //       }
// //     } catch (error) {
// //       setErrorMessage(error.response?.data?.message || 'An error occurred.');
// //       setSuccessMessage('');
// //     }
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <h2>Mark Attendance</h2>
      
// //       {errorMessage && <p style={styles.error}>{errorMessage}</p>}
// //       {successMessage && <p style={styles.success}>{successMessage}</p>}
      
// //       <form onSubmit={handleSubmit} style={styles.form}>
// //         <div style={styles.formGroup}>
// //           <label htmlFor="studentId">Student ID</label>
// //           <input
// //             type="text"
// //             id="studentId"
// //             name="studentId"
// //             value={formData.studentId}
// //             onChange={handleChange}
// //             required
// //             style={styles.input}
// //           />
// //         </div>

// //         <div style={styles.formGroup}>
// //           <label htmlFor="subjectCode">Subject</label>
// //           <select
// //             id="subjectCode"
// //             name="subjectCode"
// //             value={formData.subjectCode}
// //             onChange={handleChange}
// //             required
// //             style={styles.input}
// //           >
// //             <option value="">Select a subject</option>
// //             {subjects.map((subject) => (
// //               <option key={subject.code} value={subject.code}>
// //                 {subject.name}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         <div style={styles.formGroup}>
// //           <label htmlFor="date">Date</label>
// //           <input
// //             type="date"
// //             id="date"
// //             name="date"
// //             value={formData.date}
// //             onChange={handleChange}
// //             required
// //             style={styles.input}
// //           />
// //         </div>

// //         <div style={styles.formGroup}>
// //           <label htmlFor="status">Attendance Status</label>
// //           <select
// //             id="status"
// //             name="status"
// //             value={formData.status}
// //             onChange={handleChange}
// //             required
// //             style={styles.input}
// //           >
// //             <option value="">Select status</option>
// //             <option value="Present">Present</option>
// //             <option value="Absent">Absent</option>
// //             <option value="Late">Late</option>
// //           </select>
// //         </div>

// //         <button type="submit" style={styles.button}>Submit</button>
// //       </form>
// //     </div>
// //   );
// // };

// // const styles = {
// //   container: {
// //     maxWidth: '500px',
// //     margin: 'auto',
// //     padding: '20px',
// //     textAlign: 'center',
// //     border: '1px solid #ccc',
// //     borderRadius: '5px',
// //     backgroundColor: '#f9f9f9',
// //   },
// //   form: {
// //     display: 'flex',
// //     flexDirection: 'column',
// //     alignItems: 'flex-start',
// //   },
// //   formGroup: {
// //     marginBottom: '15px',
// //     width: '100%',
// //   },
// //   input: {
// //     width: '100%',
// //     padding: '10px',
// //     marginTop: '5px',
// //     borderRadius: '5px',
// //     border: '1px solid #ccc',
// //   },
// //   button: {
// //     padding: '10px 20px',
// //     backgroundColor: '#4caf50',
// //     color: '#fff',
// //     border: 'none',
// //     cursor: 'pointer',
// //     borderRadius: '5px',
// //   },
// //   buttonHover: {
// //     backgroundColor: '#45a049',
// //   },
// //   error: {
// //     color: 'red',
// //     marginBottom: '15px',
// //   },
// //   success: {
// //     color: 'green',
// //     marginBottom: '15px',
// //   },
// // };

// // export default MarkAttendancePage;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const MarkAttendancePage = () => {
//   const [formData, setFormData] = useState({
//     studentId: '',
//     subjectCode: '',
//     date: '',
//     status: '',
//   });
//   const [subjects, setSubjects] = useState([]); // Dynamically loaded subjects
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // Fetch subjects for the logged-in student
//   const fetchSubjects = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/api/users/details', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         withCredentials: true, // Allows sending cookies
//       });

//       if (response.status === 200 && response.data.data.subjects) {
//         const studentDetails = response.data.data;
//         setFormData((prev) => ({ ...prev, studentId: studentDetails.studentId })); // Pre-fill studentId
//         setSubjects(studentDetails.subjects); // Populate subjects dynamically
//       } else {
//         setErrorMessage('Failed to fetch subjects. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//       setErrorMessage('Unauthorized or session expired. Please log in again.');
//     }
//   };

//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   // Handle form field changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3000/api/users/mark-attendance', formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         withCredentials: true, // Allows sending cookies
//       });

//       if (response.status === 200) {
//         setSuccessMessage('Attendance marked successfully.');
//         setErrorMessage('');
//       }
//     } catch (error) {
//       console.error('Error marking attendance:', error);
//       setErrorMessage(error.response?.data?.message || 'An error occurred.');
//       setSuccessMessage('');
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Mark Attendance</h2>
      
//       {errorMessage && <p style={styles.error}>{errorMessage}</p>}
//       {successMessage && <p style={styles.success}>{successMessage}</p>}
      
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <div style={styles.formGroup}>
//           <label htmlFor="studentId">Student ID</label>
//           <input
//             type="text"
//             id="studentId"
//             name="studentId"
//             value={formData.studentId}
//             onChange={handleChange}
//             required
//             style={styles.input}
//             disabled // Make studentId read-only
//           />
//         </div>

//         <div style={styles.formGroup}>
//           <label htmlFor="subjectCode">Subject</label>
//           <select
//             id="subjectCode"
//             name="subjectCode"
//             value={formData.subjectCode}
//             onChange={handleChange}
//             required
//             style={styles.input}
//           >
//             <option value="">Select a subject</option>
//             {subjects.map((subject) => (
//               <option key={subject.subjectCode} value={subject.subjectCode}>
//                 {subject.subjectName}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div style={styles.formGroup}>
//           <label htmlFor="date">Date</label>
//           <input
//             type="date"
//             id="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             required
//             style={styles.input}
//           />
//         </div>

//         <div style={styles.formGroup}>
//           <label htmlFor="status">Attendance Status</label>
//           <select
//             id="status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             required
//             style={styles.input}
//           >
//             <option value="">Select status</option>
//             <option value="Present">Present</option>
//             <option value="Absent">Absent</option>
//             <option value="Late">Late</option>
//           </select>
//         </div>

//         <button type="submit" style={styles.button}>Submit</button>
//       </form>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: '500px',
//     margin: 'auto',
//     padding: '20px',
//     textAlign: 'center',
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//     backgroundColor: '#f9f9f9',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//   },
//   formGroup: {
//     marginBottom: '15px',
//     width: '100%',
//   },
//   input: {
//     width: '100%',
//     padding: '10px',
//     marginTop: '5px',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//   },
//   button: {
//     padding: '10px 20px',
//     backgroundColor: '#4caf50',
//     color: '#fff',
//     border: 'none',
//     cursor: 'pointer',
//     borderRadius: '5px',
//   },
//   buttonHover: {
//     backgroundColor: '#45a049',
//   },
//   error: {
//     color: 'red',
//     marginBottom: '15px',
//   },
//   success: {
//     color: 'green',
//     marginBottom: '15px',
//   },
// };

// export default MarkAttendancePage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarkAttendancePage = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    subjectCode: '',
    date: '',
    status: '',
  });
  const [subjects, setSubjects] = useState([]); // Dynamically loaded subjects
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  // Fetch subjects and attendance for the logged-in student
  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users/details', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true, // Allows sending cookies
      });

      if (response.status === 200 && response.data.data.subjects) {
        const studentDetails = response.data.data;
        setFormData((prev) => ({ ...prev, studentId: studentDetails.studentId }));
        setSubjects(studentDetails.subjects); // Populate subjects dynamically
        setAttendanceHistory(studentDetails.subjects.map(subject => subject.attendance)); // Save attendance history
      } else {
        setErrorMessage('Failed to fetch subjects. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setErrorMessage('Unauthorized or session expired. Please log in again.');
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/mark-attendance', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true, // Allows sending cookies
      });

      if (response.status === 200) {
        setSuccessMessage('Attendance marked successfully.');
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred.');
      setSuccessMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Mark Attendance</h2>
      
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="studentId">Student ID</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            style={styles.input}
            disabled // Make studentId read-only
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="subjectCode">Subject</label>
          <select
            id="subjectCode"
            name="subjectCode"
            value={formData.subjectCode}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.subjectCode} value={subject.subjectCode}>
                {subject.subjectName}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="status">Attendance Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>Submit</button>
      </form>

      {/* Attendance History */}
      <div style={styles.historyContainer}>
        <h3>Previous Attendance</h3>
        {attendanceHistory.map((subject, idx) => (
          <div key={idx}>
            <h4>{subject[0].subjectName}</h4>
            <ul>
              {subject.map((attendance, idx) => (
                <li key={idx}>
                  {attendance.date} - {attendance.status}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: 'auto',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  formGroup: {
    marginBottom: '15px',
    width: '100%',
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
    color: 'red',
    marginBottom: '15px',
  },
  success: {
    color: 'green',
    marginBottom: '15px',
  },
  historyContainer: {
    marginTop: '20px',
  },
};

export default MarkAttendancePage;
