import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Update() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/read/" + id)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setValues({
            name: res.data[0].Name,
            email: res.data[0].Email,
          });
        } else {
          console.error("No data found for the given ID");
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [id]);

  const handleUpdate = (event) => {
    event.preventDefault();
    axios
      .put("http://localhost:3001/update/" + id, values)
      .then((res) => {
        console.log("Update response:", res);
        navigate("/");
      })
      .catch((err) => console.error("Error updating data:", err));
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={handleUpdate}>
          <h2>Update Student</h2>
          <div className="mb-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              className="form-control"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              className="form-control"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <button className="btn btn-success">Submit</button>
        </form>
      </div>
    </div>
  );
}
