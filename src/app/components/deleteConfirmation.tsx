type DeleteConfirmationFormProps = {
  onConfirm: (confirmed: boolean) => void;
};

const DeleteConfirmation = ({ onConfirm }: DeleteConfirmationFormProps) => {
  return (
    <div className="flex justify-center items-center bg-black/50 w-full h-full z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="rounded-lg shadow min-w-3xs bg-gray-800 border-gray-700 py-5 px-6 text-center">
        <h3 className="mb-5">Are you sure ?</h3>
        <div className="flex items-center gap-7 justify-center">
          <button
            onClick={() => onConfirm(true)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded cursor-pointer transition"
          >
            Yes
          </button>
          <button
            onClick={() => onConfirm(false)}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded cursor-pointer transition"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
