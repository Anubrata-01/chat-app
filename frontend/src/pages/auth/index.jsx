import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input"

export default function Auth() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="h-[80vh] bg-white border-2 border-white shadow-2xl text-opacity-90 w-[90vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center p-8">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold md:text-5xl text-gray-800">Welcome</h1>
            <p className="mt-4 font-medium text-center text-gray-600">
              Fill in the details to get started with the world best chat app!
            </p>
          </div>
          <div className="w-[70%] md:w-[70%] lg:w-[80%] flex items-center justify-center ">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="flex justify-center space-x-4 p-2 rounded-lg bg-gray-200">
                <TabsTrigger
                  value="login"
                  className="px-4 py-2 font-medium text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="px-4 py-2 font-medium text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-3 flex flex-col gap-5">
                <Input type="email" placeholder="Email" className="p-3 border rounded-lg w-full" />
                <Input type="password" placeholder="Password" className="p-3 border rounded-lg w-full" />
              </TabsContent>
              <TabsContent value="signup" className="mt-3 flex flex-col gap-5">
                <Input type="email" placeholder="Email" className="p-3 border rounded-lg w-full" />
                <Input type="password" placeholder="Password" className="p-3 border rounded-lg w-full" />
                <Input type="password" placeholder="Confirm Password" className="p-3 border rounded-lg w-full" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}