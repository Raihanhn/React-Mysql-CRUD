import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { w3cwebsocket as W3CWebSocket } from "websocket";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));

    const client = new W3CWebSocket("ws://localhost:3001");

    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    client.onmessage = (message) => {
      setData(JSON.parse(message.data));
    };

    return () => {
      client.close();
    };
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3001/delete/" + id)
      .then((res) => {
        console.log("Delete successful");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-60 bg-white rounded p-3">
        <h2>Student List</h2>
        <div className="d-flex justify-content-end mb-2">
          <Link to="/create" className="btn btn-success">
            Create +
          </Link>
        </div>
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {data.map((student, index) => {
              return (
                <tr key={index}>
                  <td>{student.ID} </td>
                  <td>{student.Name} </td>
                  <td>{student.Email} </td>
                  <td>
                    <Link
                      to={`/read/${student.ID}`}
                      className="btn btn-info btn-sm"
                    >
                      Read
                    </Link>
                    <Link
                      to={`/edit/${student.ID}`}
                      className="btn btn-primary btn-sm mx-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(student.ID)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
