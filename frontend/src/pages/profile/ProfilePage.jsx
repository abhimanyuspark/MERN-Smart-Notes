import React from "react";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { auth } = useSelector((state) => state.auth);

  return (
    <div className="flex items-center justify-center">
      <div className="w-5xl bg-base-300 flex flex-col gap-2 p-4 rounded">
        <Data data={auth?.name} />
        <Data data={auth?.email} />

        <br />
        <hr className="border border-base-100" />
        <br />

        <p className="text-sm flex gap-2">
          <span>Status : </span>
          <span className="text-secondary">Active</span>
        </p>
      </div>
    </div>
  );
};

const Data = ({ data }) => {
  return (
    <div className="py-2 px-4 rounded bg-base-100 text-lg text-base-content/50">
      {data}
    </div>
  );
};

export default ProfilePage;
