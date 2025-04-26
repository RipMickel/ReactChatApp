import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const UsersList = ({ user }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map(doc => doc.data());
        setUsers(usersData.filter(u => u.uid !== user.uid)); // Exclude current user
      } catch (error) {
        console.error("Error getting users:", error);
      }
    };

    fetchUsers();
  }, [user.uid]);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          users.map((u) => (
            <li key={u.uid}>
              <Link to={`/chat/${u.uid}`}>
                <img src={u.photoURL} alt={u.displayName} width={40} height={40} />
                {u.displayName}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default UsersList;
