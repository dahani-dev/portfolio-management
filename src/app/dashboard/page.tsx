"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    // check if we have a token
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please Login");
      router.push("/");
    }
  }, [router]);

  return <div>Dashboard</div>;
};

export default Dashboard;
