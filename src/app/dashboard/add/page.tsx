"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { toast } from "react-toastify";
import { z } from "zod/v4";

// schema of add project
const projectSchema = z.object({
  title: z.string().max(100).nonempty(),
  description: z.string().max(500).nonempty(),
  image: z.any(),
  category: z.string().nonempty(),
  link: z.string().url().nonempty(),
  github: z.string().url().nonempty(),
});

// create a type for useForm
type AddProject = z.infer<typeof projectSchema>;

const AddNewProject = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<AddProject>({
    resolver: zodResolver(projectSchema),
  });

  // add a project
  const addProject: SubmitHandler<AddProject> = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please Login");
      router.push("/");
      return;
    }
    try {
      // using FormData() to get all values from inputs
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("link", data.link);
      formData.append("github", data.github);
      // handle the image file
      const image = (data.image as FileList)?.[0];
      if (image) {
        formData.append("image", image);
      } else {
        toast.error("image file is required !");
        return;
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/projects`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success(response.data.message);
      reset();
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Please Login");
          router.push("/");
        }
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // category options
  const categoryOptions = ["Web Development", "Mobile App"];
  return (
    <div className="p-10">
      <Link
        href={`/dashboard`}
        className="flex items-center gap-4 bg-orange-600 px-2 py-2 rounded cursor-pointer transition hover:bg-orange-700 max-w-fit"
      >
        List Of Projects
        <MdFormatListBulletedAdd className="text-lg" />
      </Link>
      <div className="">
        <h1 className="mt-10 mb-8 text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
          Add New Project
        </h1>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(addProject)}
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
                  {...register("title")}
                />
                <p className="mb-1 text-red-500 text-sm">
                  {errors.title?.message}
                </p>
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
                  {...register("description")}
                ></textarea>
                <p className="mb-1 text-red-500 text-sm">
                  {errors.description?.message}
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
                  {...register("image")}
                />
                <p className="mb-1 text-red-500 text-sm">
                  {typeof errors.image?.message === "string" &&
                    errors.image.message}
                </p>
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="bg-gray-700 border rounded-lg w-full p-2.5 outline-none border-none text-white"
                  {...register("category")}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="mb-1 text-red-500 text-sm">
                  {errors.category?.message}
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
                  {...register("link")}
                />
                <p className="mb-1 text-red-500 text-sm">
                  {errors.link?.message}
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
                  {...register("github")}
                />
                <p className="mb-1 text-red-500 text-sm">
                  {errors.github?.message}
                </p>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-600 cursor-pointer hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewProject;
