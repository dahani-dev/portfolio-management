"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { FaClipboardList, FaUser } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import axios, { isAxiosError } from "axios";
import Image from "next/image";
import jwt_decode from "jwt-decode";
import UpdateForm from "../components/updateForm";
import DeleteConfirmation from "../components/deleteConfirmation";
import Link from "next/link";

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  link: string;
  github: string;
};

type JwtPayload = {
  id: number;
  username: string;
};

const Dashboard = () => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [username, setUsername] = useState<string>("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [confirmationPromise, setConfirmationPromise] = useState<
    ((confirmed: boolean) => void) | null
  >(null);

  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  useEffect(() => {
    // check if we have a token
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      toast.error("Please Login");
      router.push("/");
      return;
    }

    // stored the token when he exist
    setToken(storedToken);

    // decode the token jwt to get username
    try {
      const decodeJwt = jwt_decode<JwtPayload>(storedToken);
      setUsername(decodeJwt.username);
    } catch (error) {
      console.log(error);
      toast.error("Session expired, please login again.");
      localStorage.removeItem("token");
      router.push("/");
    }

    // get all projects
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER}/projects`)
      .then((response) => {
        setProjects(response.data.data);
        setAllProjects(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [router]);

  useEffect(() => {
    // search a project
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setProjects(allProjects);
      } else {
        const filtredProjects = allProjects.filter((project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );

        setProjects(filtredProjects);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, allProjects]);

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
    toast.success("Logout Successfully");
  };

  // delete a project
  const deleteProject = async (id: number) => {
    // check if we have a token
    if (!token) {
      toast.error("Please Login");
      router.push("/");
      return;
    }
    const confirmed = await new Promise<boolean>((resolve) => {
      setConfirmationPromise(() => resolve);
      setShowDeleteConfirmation(true);
    });

    if (!confirmed) {
      return;
    }
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/projects/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success(response.data.message);
      // get all projects but dont get the one who i delete
      setProjects((prevProjects) =>
        prevProjects.filter((item) => item.id !== id)
      );
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 500) {
          toast.error("Please Login");
          router.push("/");
        }
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // add the update project to list of projects
  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  return (
    <div className="p-10">
      <section>
        <div className="flex items-center justify-between flex-wrap gap-10">
          <Link
            href={`/dashboard/add`}
            className="flex items-center gap-4 bg-orange-600 px-2 py-2 rounded cursor-pointer transition hover:bg-orange-700"
          >
            Add New Project
            <FaClipboardList className="text-lg" />
          </Link>
          <input
            type="text"
            className="bg-gray-700 border rounded p-2.5 outline-none border-none"
            placeholder="Search for project by title"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <div className="flex gap-10">
            <div className="flex items-center gap-2">
              <FaUser className="text-blue-600 text-lg" /> {username}
            </div>
            <button
              className="bg-red-600 hover:bg-red-700 py-2 px-2 rounded cursor-pointer flex items-center justify-evenly gap-2 transition"
              onClick={logout}
            >
              Logout <MdLogout />
            </button>
          </div>
        </div>
        <hr className="h-px my-8  border-0 bg-gray-700" />
        <ul className="grid grid-cols-7 gap-4 mb-6 items-center text-center">
          <li>Tiltle</li>
          <li>Description</li>
          <li>Image</li>
          <li>Category</li>
          <li>Link</li>
          <li>Github</li>
          <li>Action</li>
        </ul>
        <hr className="h-px my-8  border-0 bg-gray-700" />
        {projects.length <= 0 ? (
          <p className="text-2xl text-red-500">
            There are no projects currently.
          </p>
        ) : (
          projects.map((item, index) => {
            return (
              <div key={item.id}>
                <ul className="grid grid-cols-7 gap-4 mb-6 items-center text-center">
                  <li className="break-all">{item.title}</li>
                  <li className="break-all">{item.description}</li>
                  <li className="flex justify-center items-center">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER}/uploads/${item.image}`}
                      alt={item.title}
                      width={100}
                      height={100}
                      className="object-cover rounded"
                    />
                  </li>
                  <li className="break-all">{item.category}</li>
                  <li className="break-all">{item.link}</li>
                  <li className="break-all">{item.github}</li>
                  <li className="flex items-center gap-5 justify-center">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 p-2 rounded cursor-pointer transition"
                      onClick={() => {
                        setShowUpdateForm(true);
                        setSelectedProject(item);
                      }}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 p-2 rounded cursor-pointer transition"
                      onClick={() => deleteProject(item.id)}
                    >
                      <MdDelete />
                    </button>
                  </li>
                </ul>
                {index !== projects.length - 1 && (
                  <hr className="h-px my-8 border-0 bg-gray-700" />
                )}
              </div>
            );
          })
        )}
      </section>
      {showUpdateForm && selectedProject && (
        <UpdateForm
          setShowUpdateForm={setShowUpdateForm}
          project={selectedProject}
          onProjectUpdated={handleProjectUpdate}
        />
      )}
      {showDeleteConfirmation && confirmationPromise && (
        <DeleteConfirmation
          onConfirm={(confirmed) => {
            setShowDeleteConfirmation(false);
            confirmationPromise(confirmed);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
