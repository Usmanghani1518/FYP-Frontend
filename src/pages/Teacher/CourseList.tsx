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
    const [data,setData] = useState<Course[]>(dummyData)
    const navigate = useNavigate()

    const handleFetchCourses = async () => {    
        try {
            const response = await backendRequest("GET", "/course/courses");
            if(response.success){
                setData(response.data);
            }
            // console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleFetchCourses();
    }
    , [])
  
   
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
                      className="font-medium hover:text-primary cursor-pointer transition-colors"
                      onClick={() => navigate(`/teacher/all-courses/${row.original._id}`)}
                    >
                      {row.original.title.length > 20
                        ? `${row.original.title.substring(0, 20)}...`
                        : row.original.title}
                    </p>
                  </TooltipTrigger>
                  {row.original.title.length > 20 && (
                    <TooltipContent>
                      <p>{row.original.title}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <p className="text-sm text-muted-foreground">
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
                <div className="max-w-[200px] truncate">
                  {row.original.description.length > 60
                    ? `${row.original.description.substring(0, 60)}...`
                    : row.original.description}
                </div>
              </TooltipTrigger>
              {row.original.description.length > 60 && (
                <TooltipContent className="max-w-[300px]">
                  <p>{row.original.description}</p>
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
            className="capitalize bg-primary/10 text-primary hover:bg-primary/20"
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
            <span className="font-medium">${row.original.price}</span>
            <span className="text-xs text-muted-foreground">USD</span>
          </div>
        ),
      },
      {
        accessorKey: "videoCount",
        header: "Videos",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">
              {row.original.videoCount || 0}
            </span>
            <svg
              className="w-4 h-4 text-blue-500"
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
        accessorKey: "averageRating",
        header: "Rating",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <span className="font-medium">{row.original.averageRating.toFixed(1)}</span>
            <svg
              className="w-4 h-4 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
                    className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => navigate(`/teacher/all-courses/${row.original._id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Course</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                    onClick={() => navigate(`/teacher/all-courses/${row.original._id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Course</p>
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
            <h2 className="text-lg font-bold mb-4 text-white bg-custom_primary py-4 ps-3 rounded-lg">All Courses</h2>
        </div>
      <div className="rounded-lg border bg-background shadow-sm">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <Input
            placeholder="Search courses..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm focus-visible:ring-primary focus-visible:ring-offset-0"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold">
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
                  className="hover:bg-muted/10 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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