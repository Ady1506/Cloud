import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportPage = () => {
  const [studentData, setStudentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchStudentDetails = async () => {
    const token = localStorage.getItem('token'); // Use localStorage instead of getCookie
    console.log('Token from localStorage:', token);

    if (!token) {
      setErrorMessage('No authentication token found. Please log in again.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/api/users/details', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setStudentData(response.data.data); // Store student data in state
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      setErrorMessage('Failed to fetch student details. Please try again.');
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Student Report</h2>

      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      {studentData ? (
        <>
          <h3>Student Details</h3>
          <p>Name: {studentData.name}</p>
          <p>Email: {studentData.email}</p>

          {studentData.subjects && studentData.subjects.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Teacher</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {studentData.subjects.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.subjectName}</td>
                    <td>{subject.teacher.teacherName}</td>
                    <td>
                      {subject.attendance.length > 0 ? (
                        subject.attendance.map((attendance, idx) => (
                          <div key={idx}>
                            <span>{attendance.date}: {attendance.status}</span>
                          </div>
                        ))
                      ) : (
                        <span>No attendance records</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <p>Loading student details...</p>
      )}
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
