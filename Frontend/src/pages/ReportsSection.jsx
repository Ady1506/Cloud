// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Reports = () => {
//   const [studentDetails, setStudentDetails] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchStudentDetails = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:3000/api/users/students/details', {
//           headers: { Authorization: `Bearer ${token}` },
//          },
//         );
//         if (response.status === 200) {
//           console.log(response)
//           setStudentDetails(response.data.data);
//         }
//       } catch (err) {
//         setError('Failed to fetch student details. Please try again later.');
//         console.error(err);
//       }
//     };

//     fetchStudentDetails();
//   }, []);

//   if (error) {
//     return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
//   }

//   if (!studentDetails) {
//     return <p style={{ textAlign: 'center' }}>Loading...</p>;
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h2>Student Report</h2>
//       </div>

//       {/* Student Details */}
//       <div style={styles.card}>
//         <h3>Personal Details</h3>
//         <p><strong>Student ID:</strong> {studentDetails.studentId}</p>
//         <p><strong>Name:</strong> {studentDetails.name}</p>
//         <p><strong>Email:</strong> {studentDetails.email}</p>
//       </div>

//       {/* Subjects and Attendance */}
//       <div style={styles.card}>
//         <h3>Subjects and Attendance</h3>
//         {studentDetails.subjects.map((subject, index) => (
//           <div key={index} style={styles.subjectCard}>
//             <h4>{subject.subjectName} ({subject.subjectCode})</h4>
//             <p><strong>Teacher:</strong> {subject.teacher.teacherName}</p>

//             {/* Subgroups */}
//             <div>
//               <h5>Subgroups:</h5>
//               <ul>
//                 {subject.subgroups.map((subgroup, idx) => (
//                   <li key={idx}>
//                     <strong>ID:</strong> {subgroup.subgroupId} | <strong>Branch:</strong> {subgroup.branchId} | <strong>Year:</strong> {subgroup.yearId}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Attendance */}
//             <div>
//               <h5>Attendance:</h5>
//               {subject.attendance.length > 0 ? (
//                 <table style={styles.table}>
//                   <thead>
//                     <tr>
//                       <th>Date</th>
//                       <th>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {subject.attendance.map((att, idx) => (
//                       <tr key={idx}>
//                         <td>{new Date(att.date).toLocaleDateString()}</td>
//                         <td>{att.status}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No attendance records available.</p>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: '800px',
//     margin: '20px auto',
//     padding: '20px',
//     backgroundColor: '#f9f9f9',
//     borderRadius: '8px',
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//   },
//   header: {
//     textAlign: 'center',
//     marginBottom: '20px',
//   },
//   card: {
//     marginBottom: '20px',
//     padding: '20px',
//     border: '1px solid #ddd',
//     borderRadius: '8px',
//     backgroundColor: '#fff',
//   },
//   subjectCard: {
//     marginBottom: '20px',
//     padding: '15px',
//     border: '1px solid #ddd',
//     borderRadius: '8px',
//     backgroundColor: '#f0f8ff',
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse',
//     marginTop: '10px',
//   },
//   tableHeader: {
//     backgroundColor: '#007bff',
//     color: '#fff',
//     textAlign: 'left',
//     padding: '8px',
//   },
//   tableCell: {
//     border: '1px solid #ddd',
//     padding: '8px',
//   },
// };

// export default Reports;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchReportData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/reports', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setReportData(response.data.data); // Assuming the response data structure
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      setErrorMessage('Failed to fetch report data. Please try again.');
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Reports</h2>

      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Attendance Percentage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reportData.length > 0 ? (
            reportData.map((report, index) => (
              <tr key={index}>
                <td>{report.subjectName}</td>
                <td>{report.attendancePercentage}%</td>
                <td>{report.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No reports found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
  },
  td: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
};

export default ReportPage;
