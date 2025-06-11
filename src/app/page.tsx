import React from "react";

const page = () => {
  return (
    <section className="w-full h-[100vh] flex justify-center items-center px-10">
      <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
            Sign in
          </h1>
          <form className="space-y-4 md:space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-white"
              >
                Your username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="bg-gray-700 border rounded-lg w-full p-2.5 outline-none border-none"
                placeholder="ex: carl_johnson"
                required
              />
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
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-700 border rounded-lg w-full p-2.5 outline-none border-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-600 cursor-pointer hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default page;
