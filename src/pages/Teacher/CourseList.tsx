import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Pencil,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { backendRequest } from "@/Helper/backendRequest"

// Define the data type based on your backend response
type Course = {
  _id: string
  title: string
  description: string
  teacher: {
    _id: string
    name: string
  }
  level: "beginner" | "intermediate" | "advanced"
  thumbnail: string
  language: string
  price: number
  category: string
  createdAt: string
  averageRating: number
  videoCount?: number 
}

// Dummy data array
const dummyData: Course[] = [
  {
    _id: "67e1aba26ce0cbc0e3397a97",
    title: "React Masterclass: From Zero to Hero in 30 Days",
    description: "Learn React from scratch with modern best practices and build real-world applications.",
    teacher: {
      _id: "67c49bd0fad2ec2c115a9748",
      name: "John Doe"
    },
    level: "beginner",
    thumbnail: "https://res.cloudinary.com/saadnaem/image/upload/v1742844358/uploads/r6lwyxmuywod78xlv79o.jpg",
    language: "English",
    price: 125,
    category: "Development",
    createdAt: "2025-03-24T18:59:46.088Z",
    averageRating: 4.5,
    videoCount: 12
  },
  {
    _id: "67e1aba26ce0cbc0e3397a98",
    title: "Advanced Node.js Patterns and Performance Optimization",
    description: "Deep dive into Node.js architecture and performance optimization techniques.",
    teacher: {
      _id: "67c49bd0fad2ec2c115a9749",
      name: "Jane Smith"
    },
    level: "advanced",
    thumbnail: "https://res.cloudinary.com/saadnaem/image/upload/v1742844358/uploads/r6lwyxmuywod78xlv79o.jpg",
    language: "English",
    price: 199,
    category: "Backend",
    createdAt: "2025-03-23T12:30:15.088Z",
    averageRating: 4.8,
    videoCount: 8
  },
  {
    _id: "67e1aba26ce0cbc0e3397a99",
    title: "UI/UX Fundamentals: Design Thinking in Practice",
    description: "Master the principles of user interface and experience design with practical examples.",
    teacher: {
      _id: "67c49bd0fad2ec2c115a9750",
      name: "Alex Johnson"
    },
    level: "intermediate",
    thumbnail: "https://res.cloudinary.com/saadnaem/image/upload/v1742844358/uploads/r6lwyxmuywod78xlv79o.jpg",
    language: "English",
    price: 89,
    category: "Design",
    createdAt: "2025-03-22T09:15:33.088Z",
    averageRating: 4.2,
    videoCount: 10
  },
  {
    _id: "67e1aba26ce0cbc0e3397a9a",
    title: "Python for Data Science: Complete Bootcamp 2025",
    description: "Learn how to use Python for data analysis, visualization, and machine learning.",
    teacher: {
      _id: "67c49bd0fad2ec2c115a9751",
      name: "Maria Garcia"
    },
    level: "beginner",
    thumbnail: "https://res.cloudinary.com/saadnaem/image/upload/v1742844358/uploads/r6lwyxmuywod78xlv79o.jpg",
    language: "English",
    price: 149,
    category: "Data Science",
    createdAt: "2025-03-21T14:20:10.088Z",
    averageRating: 4.7,
    videoCount: 15
  },
  {
    _id: "67e1aba26ce0cbc0e3397a9b",
    title: "Mobile App Development with Flutter: Cross-Platform Solutions",
    description: "Build cross-platform mobile applications using Flutter framework.",
    teacher: {
      _id: "67c49bd0fad2ec2c115a9752",
      name: "David Wilson"
    },
    level: "intermediate",
    thumbnail: "https://res.cloudinary.com/saadnaem/image/upload/v1742844358/uploads/r6lwyxmuywod78xlv79o.jpg",
    language: "English",
    price: 179,
    category: "Mobile",
    createdAt: "2025-03-20T11:05:27.088Z",
    averageRating: 4.3,
    videoCount: 14
  }
]

export function CoursesTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [data, setData] = useState<Course[]>(dummyData)
  const navigate = useNavigate()

  const handleFetchCourses = async () => {    
    try {
      const response = await backendRequest("GET", "/course/courses");
      if(response.success){
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleFetchCourses();
  }, [])

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-md">
            <AvatarImage src={row.original.thumbnail} alt={row.original.title} />
            <AvatarFallback className="rounded-md">
              {row.original.title.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p 
                    className="font-medium text-white hover:text-primary cursor-pointer transition-colors"
                    onClick={() => navigate(`/teacher/all-courses/${row.original._id}`)}
                  >
                    {row.original.title.length > 20
                      ? `${row.original.title.substring(0, 20)}...`
                      : row.original.title}
                  </p>
                </TooltipTrigger>
                {row.original.title.length > 20 && (
                  <TooltipContent className="bg-gray-800 border-gray-700">
                    <p className="text-white">{row.original.title}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <p className="text-xss text-gray-300">
              by {row.original.teacher.name}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[200px] truncate text-gray-300">
                {row.original.description.length > 60
                  ? `${row.original.description.substring(0, 60)}...`
                  : row.original.description}
              </div>
            </TooltipTrigger>
            {row.original.description.length > 60 && (
              <TooltipContent className="max-w-[300px] bg-gray-800 border-gray-700">
                <p className="text-white">{row.original.description}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge 
          variant="outline" 
          className="capitalize text-gray-100 bg-primary/10 hover:bg-primary/20 border-gray-700"
        >
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.level === "beginner"
              ? "secondary"
              : row.original.level === "intermediate"
              ? "default"
              : "destructive"
          }
          className="capitalize"
        >
          {row.original.level}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span className="font-medium text-white">${row.original.price}</span>
          <span className="text-xs text-gray-400">USD</span>
        </div>
      ),
    },
    {
      accessorKey: "videoCount",
      header: "Videos",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span className="text-gray-400">
            {row.original.videoCount || 0}
          </span>
          <svg
            className="w-4 h-4 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
      ),
    },
  
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-blue-900/30 hover:text-blue-400 border-gray-700"
                  onClick={() => navigate(`/teacher/all-courses/${row.original._id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 border-gray-700">
                <p className="text-white">View Course</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-green-900/30 hover:text-green-400 border-gray-700"
                  onClick={() => navigate(`/teacher/all-courses/${row.original._id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 border-gray-700">
                <p className="text-white">Edit Course</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-4 text-white bg-gray-800 py-4 ps-3 rounded-lg border border-gray-700">
          All Courses
        </h2>
      </div>
      <div className="rounded-lg border bg-gray-900 border-gray-700 shadow-sm">
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <Input
            placeholder="Search courses..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm focus-visible:ring-primary focus-visible:ring-offset-0 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="hover:bg-gray-700 hover:text-white border-gray-700"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="hover:bg-gray-700 hover:text-white border-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="hover:bg-gray-700 hover:text-white border-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="hover:bg-gray-700 hover:text-white border-gray-700"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader className="bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-gray-800">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id} 
                      className="font-semibold text-gray-300 border-gray-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-800/50 transition-colors border-gray-700"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-gray-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-24 text-center text-gray-400 border-gray-700"
                >
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}