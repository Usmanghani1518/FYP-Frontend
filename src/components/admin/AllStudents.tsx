import { backendRequest } from "@/Helper/backendRequest";
import Loader from "@/Helper/Loader";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import ConfirmationModal from "@/components/ConfirmationModal"; 

interface Student {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

const AllStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = async () => {
    try {
      const res = await backendRequest<{ success: boolean; students: Student[] }>("GET", "/admin/all-students");
      setStudents(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); 
    }
  };

  const deleteStudent = async (studentId: string) => {
    try {
      await backendRequest("DELETE", `/admin/delete-student/${studentId}`);
      setStudents(students.filter((student) => student._id !== studentId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent._id);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const openConfirmationModal = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-6">All Students</h1>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {students.map((student, index) => (
                <tr key={student._id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                    <button
                      onClick={() => openConfirmationModal(student)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Delete Student"
        message="Are you sure you want to delete this student?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AllStudents;
