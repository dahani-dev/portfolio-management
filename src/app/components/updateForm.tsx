import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoIosCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";
import { z } from "zod/v4";

// create schema of update project
const updateSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(500),
  image: z.any(),
  category: z.string(),
  link: z.string().url(),
  github: z.string().url(),
});

// create a type for useForm
// z.infer<typeof loginSchema> is a utility from Zod that automatically creates a TypeScript type based on your schema.
type UpdateProject = z.infer<typeof updateSchema>;

// type of CurrentValuesOfSingleProduct
type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  link: string;
  github: string;
};
// type of UpdateFormProps props
type UpdateFormProps = {
  setShowUpdateForm: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project;
  onProjectUpdated: (updatedProject: Project) => void;
};

const UpdateForm = ({
  setShowUpdateForm,
  project,
  onProjectUpdated,
}: UpdateFormProps) => {
  const router = useRouter();

  // react use form hook:
  // register: thats save the value from inputs
  // handleSubmit: thats do the same functionality of native handleSubmit on react
  // reset: thats will be clear all inputs
  // formState: thats return the state of form like isSubmitting or errors ...
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UpdateProject>({
    resolver: zodResolver(updateSchema),
  });

  //   update the project
  const updateProject: SubmitHandler<UpdateProject> = async (data) => {
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
      }
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/projects/${project.id}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success(response.data.message);
      reset();
      setShowUpdateForm(false);
      // send the updated project to dashbord
      onProjectUpdated(response.data.updatedProject);
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
    <section className="flex justify-center items-center bg-black/50 w-full h-full z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="rounded-lg shadow bg-gray-800 border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
              Update project
            </h1>
            <button
              className="text-2xl cursor-pointer hover:text-red-600 transition"
              onClick={() => {
                setShowUpdateForm(false);
              }}
            >
              <IoIosCloseCircle />
            </button>
          </div>
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleSubmit(updateProject)}
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
                    defaultValue={project.title}
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
                    defaultValue={project.description}
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
                    defaultValue={project.link}
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
                    defaultValue={project.github}
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
              {isSubmitting ? "Loading..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateForm;
