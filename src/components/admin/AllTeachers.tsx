import { backendRequest } from "@/Helper/backendRequest";
import { useEffect, useState } from "react";

const AllTeachers = () => {
  const [teachers, setTeachers] = useState([])

  const fetchTeacher = async() => {
    try {
        const res= await backendRequest("GET", "/all-teachers")
        setTeachers(res)
    } catch (error) {
        console.log(error);
    }
  }
  useEffect(()=>{
    fetchTeacher()
  },[])

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {teachers.map((teacher, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.message}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.status === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {teacher.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllTeachers;