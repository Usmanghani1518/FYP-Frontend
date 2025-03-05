import { backendRequest } from "@/Helper/backendRequest";
import Loader from "@/Helper/Loader";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line, RiCheckLine, RiCloseLine } from "react-icons/ri";
import ConfirmationModal from "@/components/ConfirmationModal"; // Import the ConfirmationModal component

// Define the Teacher interface
interface Teacher {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  activate: boolean; 
}

const AllTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [actionType, setActionType] = useState<"delete" | "activate" | "deactivate" | null>(null);

  // Fetch all teachers
  const fetchTeacher = async () => {
    try {
      const res = await backendRequest<{ success: boolean; teachers: Teacher[] }>("GET", "/admin/all-teachers");
      setTeachers(res.teachers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Delete a teacher
  const deleteTeacher = async (teacherId: string) => {
    try {
      await backendRequest("DELETE", `/admin/delete-teacher/${teacherId}`);
      setTeachers(teachers.filter((teacher) => teacher._id !== teacherId)); // Remove the deleted teacher from the list
    } catch (error) {
      console.error(error);
    }
  };

  // Activate a teacher
  const activateTeacher = async (teacherId: string) => {
    try {
      await backendRequest("PATCH", `/admin/activate-teacher/${teacherId}`);
      setTeachers(
        teachers.map((teacher) =>
          teacher._id === teacherId ? { ...teacher, isActive: true } : teacher
        )
      ); // Update the teacher's status
    } catch (error) {
      console.error(error);
    }
  };

  // Deactivate a teacher
  const deactivateTeacher = async (teacherId: string) => {
    try {
      await backendRequest("PATCH", `/admin/deactivate-teacher/${teacherId}`);
      setTeachers(
        teachers.map((teacher) =>
          teacher._id === teacherId ? { ...teacher, isActive: false } : teacher
        )
      ); // Update the teacher's status
    } catch (error) {
      console.error(error);
    }
  };

  // Handle confirmation modal actions
  const handleConfirm = () => {
    if (selectedTeacher && actionType) {
      switch (actionType) {
        case "delete":
          deleteTeacher(selectedTeacher._id);
          break;
        case "activate":
          activateTeacher(selectedTeacher._id);
          break;
        case "deactivate":
          deactivateTeacher(selectedTeacher._id);
          break;
        default:
          break;
      }
    }
    setIsModalOpen(false); // Close the modal
  };

  // Handle cancel action
  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Open confirmation modal for an action
  const openConfirmationModal = (teacher: Teacher, action: "delete" | "activate" | "deactivate") => {
    setSelectedTeacher(teacher);
    setActionType(action);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-6">All Teachers</h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {teachers.map((teacher, index) => (
                <tr key={teacher._id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{teacher.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{teacher.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(teacher.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {teacher.activate ? (
                      <span className="px-2 py-1 bg-green-600 text-white rounded-full">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-600 text-white rounded-full">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => openConfirmationModal(teacher, "delete")}
                        className="text-red-400 hover:text-red-500 transition-colors"
                      >
                        <RiDeleteBin6Line />
                      </button>
                      {teacher.activate ? (
                        <button
                          onClick={() => openConfirmationModal(teacher, "deactivate")}
                          className="text-yellow-400 hover:text-yellow-500 transition-colors"
                        >
                          <RiCloseLine />
                        </button>
                      ) : (
                        <button
                          onClick={() => openConfirmationModal(teacher, "activate")}
                          className="text-green-400 hover:text-green-500 transition-colors"
                        >
                          <RiCheckLine />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={`${actionType === "delete" ? "Delete Teacher" : actionType === "activate" ? "Activate Teacher" : "Deactivate Teacher"}`}
        message={`Are you sure you want to ${actionType} this teacher?`}
        confirmText={actionType === "delete" ? "Delete" : actionType === "activate" ? "Activate" : "Deactivate"}
        cancelText="Cancel"
      />
    </div>
  );
};

export default AllTeachers;