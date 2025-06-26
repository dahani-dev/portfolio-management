"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod/v4";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// create schema of fields
const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "length must be at least 3 characters long")
    .max(20, "length must be at most 20 characters long")
    .nonempty("User name is required"),
  password: z
    .string()
    .trim()
    .min(8, "length must be at least 8 characters long")
    .nonempty("Password is required"),
});

// create a type for useForm
// z.infer<typeof loginSchema> is a utility from Zod that automatically creates a TypeScript type based on your schema.
type FormFields = z.infer<typeof loginSchema>;

const Page = () => {
  const router = useRouter();

  // react use form hook:
  // register: thats save the value from inputs
  // handleSubmit: thats do the same functionality of native handleSubmit on react
  // reset: thats will be clear all inputs
  // formState: thats return the state of form like isSubmitting or errors ...
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormFields>({
    // It tells React Hook Form to validate the form using your Zod schema.
    resolver: zodResolver(loginSchema),
  });

  const submitForm: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/login`,
        {
          username: data.username,
          password: data.password,
        }
      );
      localStorage.setItem("token", response.data.accessToken);
      toast.success(response.data.message);
      reset();
      router.push("/dashboard");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <section className="w-full h-[100vh] flex justify-center items-center px-10">
      <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
            Sign in
          </h1>
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleSubmit(submitForm)}
          >
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-white"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="bg-gray-700 border rounded-lg w-full p-2.5 outline-none border-none"
                placeholder="ex: carl_johnson"
                {...register("username")}
              />
              <p className="mb-1 text-red-500 text-sm">
                {errors.username?.message}
              </p>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-700 border rounded-lg w-full p-2.5 outline-none border-none"
                {...register("password")}
              />
              <p className="mb-1 text-red-500 text-sm">
                {errors.password?.message}
              </p>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-600 cursor-pointer transition hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Page;
