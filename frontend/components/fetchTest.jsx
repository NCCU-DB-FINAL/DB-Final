import { useState, useEffect } from "react";
import NextLink from "next/link";
import { Card, CardBody } from "@nextui-org/react";


/**
 * Just trying to fetch something
 */
export const Fetch = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setUsers(data);
      });
  }, []);

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <div key={user.id}>
          <NextLink
            href={{
              pathname: "/apiTest/user/[slug]",
              query: { slug: user.id },
            }}
          >
            <Card>
              <CardBody>
                <p>User {user.id}</p>
              </CardBody>
            </Card>
          </NextLink>
        </div>
      ))}
    </div>
  );
};

export const FetchSingleUser = ({ uid }) => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    if (!uid) return;
    fetch(`https://jsonplaceholder.typicode.com/users/${uid}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setUser(data);
      });
  }, [uid]);

  return (
    <div className="mt-3">

      <div key={user.id}>
        <h2>{user.name}</h2>
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  );
};
