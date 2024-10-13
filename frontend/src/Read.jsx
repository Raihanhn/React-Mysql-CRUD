import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Read() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/read/" + id)
      .then((res) => {
        if (res.data.length > 0) {
          setStudent(res.data[0]);
        } else {
          setError("Student not found");
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Error fetching student data");
      });
  }, [id]);

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3 text-center ">
        <h2>Student Details</h2>
        {student ? (
          <>
            <h2>{student.ID}</h2>
            <h2>{student.Name}</h2>
            <h2>{student.Email}</h2>
            <Link to={"/"} className="btn btn-primary me-2">
              Back
            </Link>
            <Link to={`/edit/${student.ID}`} className="btn btn-info">
              Edit
            </Link>
          </>
        ) : (
          <p>Student not found</p>
        )}
      </div>
    </div>
  );
}
