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
  // server of backen
  const server: string = "http://localhost:3000";

  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [username, setUsername] = useState<string>("");
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(true);

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
      .get(`${server}/projects`)
      .then((response) => {
        setProjects(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [router]);

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
    try {
      const response = await axios.delete(`${server}/projects/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      toast.success(response.data.message);
      // get all projects but dont get the one who i delete
      setProjects((prevProjects) =>
        prevProjects.filter((item) => item.id !== id)
      );
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="p-10">
      <section>
        <div className="flex items-center justify-between flex-wrap gap-10">
          <h2 className="flex items-center gap-4 bg-orange-600 px-2 py-2 rounded">
            Projects Dashboard
            <FaClipboardList className="text-lg" />
          </h2>
          <div className="flex">
            <input
              type="text"
              className="bg-gray-700 border rounded-bl-[8px] rounded-tl-[8px] p-2.5 outline-none border-none"
              placeholder="Search for project"
            />
            <button className="bg-orange-600 hover:bg-orange-700 px-6 py-2.5 rounded-br-[8px] rounded-tr-[8px] cursor-pointer">
              Search
            </button>
          </div>
          <div className="flex gap-10">
            <div className="flex items-center gap-2">
              <FaUser className="text-blue-600 text-lg" /> {username}
            </div>
            <button
              className="bg-red-600 hover:bg-red-700 py-2 px-2 rounded cursor-pointer flex items-center justify-evenly gap-2"
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
                  <li className="">{item.title}</li>
                  <li className="">{item.description}</li>
                  <li className="flex justify-center items-center">
                    <Image
                      src={`${server}/uploads/${item.image}`}
                      alt={item.title}
                      width={100}
                      height={100}
                      className="object-cover rounded"
                    />
                  </li>
                  <li>{item.category}</li>
                  <li>{item.link}</li>
                  <li>{item.github}</li>
                  <li className="flex items-center gap-5 justify-center">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 p-2 rounded cursor-pointer"
                      onClick={() => {
                        setShowUpdateForm(true);
                      }}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 p-2 rounded cursor-pointer"
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
      {showUpdateForm && (
        <section className="flex justify-center items-center px-10">
          <div className="w-full rounded-lg shadow bg-gray-800 border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                Update project
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                // onSubmit={handleSubmit(submitForm)}
              >
                <div className="grid grid-cols-2 gap-5 h-[400px]">
                  <div className="flex flex-col gap-5 h-full">
                    <div>
                      <label
                        htmlFor="title"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        className="bg-gray-700 border rounded-lg w-full p-2.5 outline-none border-none"
                        placeholder="ex: Snacly"
                      />
                    </div>

                    <div className="flex flex-col flex-1">
                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        placeholder="Sackly is a food delivery ..."
                        className="bg-gray-700 border rounded-lg w-full h-full p-2.5 outline-none border-none"
                        // {...register("password")}
                      ></textarea>
                      <p className="mb-1 text-red-500 text-sm">
                        {/* {errors.password?.message} */}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label
                        htmlFor="image"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Image
                      </label>
                      <input
                        type="file"
                        id="image"
                        placeholder="Image of project"
                        className="bg-gray-700 border rounded-lg w-full p-2.5 outline-none border-none"
                        // {...register("password")}
                      />
                      <p className="mb-1 text-red-500 text-sm">
                        {/* {errors.password?.message} */}
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="category"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Category
                      </label>
                      <input
                        type="text"
                        id="category"
                        placeholder="Category of project"
                        className="bg-gray-700 border rounded-lg w-full p-2.5 outline-none border-none"
                        // {...register("password")}
                      />
                      <p className="mb-1 text-red-500 text-sm">
                        {/* {errors.password?.message} */}
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="link"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Link
                      </label>
                      <input
                        type="text"
                        id="link"
                        placeholder="Link of project"
                        className="bg-gray-700 border rounded-lg w-full p-2.5 outline-none border-none"
                        // {...register("password")}
                      />
                      <p className="mb-1 text-red-500 text-sm">
                        {/* {errors.password?.message} */}
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="github"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Github
                      </label>
                      <input
                        type="text"
                        id="github"
                        placeholder="Github repo of project"
                        className="bg-gray-700 border rounded-lg w-full p-2.5 outline-none border-none"
                        // {...register("password")}
                      />
                      <p className="mb-1 text-red-500 text-sm">
                        {/* {errors.password?.message} */}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 cursor-pointer hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  // disabled={isSubmitting}
                >
                  {/* {isSubmitting ? "Loading..." : "Sign in"} */}
                  Update
                </button>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
