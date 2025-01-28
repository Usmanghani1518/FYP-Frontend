import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Search, Menu } from "lucide-react"
import {Link} from "react-router-dom"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto px-4 py-3 flex items-center justify-between">
        {/* Mobile Header */}
        <div className="flex items-center justify-between w-full md:hidden">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Menu className="h-6 w-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerDescription>Browse our categories and more</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-4">
                <Input
                  type="search"
                  placeholder="Search for anything"
                  className="w-full pl-10 pr-4 py-2 rounded-3xl border border-black"
                />
                <nav>
                  <ul className="space-y-2">
                    <li>
                      <Link to="#" className="block py-2 hover:bg-gray-100 rounded">
                        Categories
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="block py-2 hover:bg-gray-100 rounded">
                        Udemy Business
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="block py-2 hover:bg-gray-100 rounded">
                        Teach on Udemy
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <DrawerFooter>
                <Button className="w-full">Sign up</Button>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Link to="/" className="text-2xl font-bold">
            Edu
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-3xl font-bold">
            Edu
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="#" className="text-sm">
                  Categories
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-grow mx-4 hidden md:block">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search for anything"
              className="w-full pl-10 pr-4 py-2 rounded-3xl border border-black"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link to="#" className="text-sm">
            Udemy Business
          </Link>
          <Link to="#" className="text-sm">
            Teach on Udemy
          </Link>
          <Link to="#" className="text-xl">
            <ShoppingCart />
          </Link>
          <Button variant="outline">Log in</Button>
          <Button>Sign up</Button>
        </div>
      </div>
    </header>
  )
}