import React from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/Tabs";
import GroupsPage from "./GroupsPage";
import UsersPage from "./UsersPage";
import { Bell } from "lucide-react";
import { useToast } from "./ui/Toast";
import { Group } from ".";
const server = import.meta.env.VITE_SERVER_URL;

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<"groups" | "users">(
    "groups"
  );
  const { toast } = useToast();
  const didRunRef = React.useRef(false);

  React.useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const checkNewGroups = async () => {
      try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const response = await fetch(
          `${server}/admin/new-groups?since=${twoDaysAgo.toISOString()}`,
          { credentials: "include" }
        );
        const newGroups = await response.json();

        newGroups.forEach((group: Group) => {
          toast({
            title: "New group created",
            description: `Group "${group.groupName}" has been created`,
            duration: 60000,
          });
        });
      } catch (error) {
        console.error("Failed to check new groups:", error);
      }
    };

    checkNewGroups();
  }, [toast]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Admin
          </h1>
          <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "groups" | "users")}
          className="mt-2"
        >
          <TabsList>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <main className="flex-1 overflow-hidden">
        {activeTab === "groups" ? <GroupsPage /> : <UsersPage />}
      </main>
    </div>
  );
};

export default AdminPage;
