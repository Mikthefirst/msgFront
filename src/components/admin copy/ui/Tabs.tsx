import React from "react";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  onValueChange,
  children,
  className = "",
}) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ children }) => {
  return (
    <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
}) => {
  const context = React.useContext(TabsContext);
  const isSelected = context?.value === value;

  return (
    <button
      type="button"
      onClick={() => context?.onValueChange(value)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
        ${
          isSelected
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }
      `}
    >
      {children}
    </button>
  );
};
