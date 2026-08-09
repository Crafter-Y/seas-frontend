import { use, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import MyBoardList from "@/components/board/BoardList";
import { AppContext } from "@/helpers/appContext";
import { formatDate } from "@/helpers/format";

import type { Meta, StoryObj } from "@storybook/react-native-web-vite";

type Props = {
  children: React.ReactNode;
};

const mockPages: APIResponsePage[] = [
  {
    id: 1,
    name: "Page 1",
    moderatorUserId: 0,
  },
];

const mockColumns: APIResponseColumn[] = [
  {
    id: 0,
    name: "Column1",
    type: "POSITION",
    pages: [1],
  },
  {
    id: 1,
    name: "Comments",
    type: "COMMENT",
    pages: [1],
  },
];

const mockUsers: APIResponseUser[] = [
  {
    id: 0,
    firstname: "Testing",
    lastname: "User",
    deleted: false,
  },
  {
    id: 1,
    firstname: "Another",
    lastname: "User",
    deleted: false,
  },
];

const mockUser: User = {
  id: 0,
  firstname: "Testing",
  lastname: "User",
  email: "testuser@mail.com",
  role: "USER",
};

const DataWrapper = ({ children }: Props) => {
  const parentContext = use(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [allPages, setAllPages] = useState(mockPages);
  const [allColumns, setAllColumns] = useState(mockColumns);
  const [allExistingUsers, setAllExistingUsers] = useState(mockUsers);
  const [user, setUser] = useState<User | null>(mockUser);
  const [selectedRow, setSelectedRow] = useState<BoardRow>();
  const [board, setBoard] = useState<BoardRow[]>([]);

  return (
    <AppContext
      value={{
        ...parentContext,
        currentPage,
        setCurrentPage,
        allPages,
        setAllPages,
        allColumns,
        setAllColumns,
        allExistingUsers,
        setAllExistingUsers,
        user,
        setUser,
        selectedRow,
        setSelectedRow,
        board,
        setBoard,
      }}
    >
      <View>{children}</View>
    </AppContext>
  );
};

const meta = {
  component: MyBoardList,
  title: "Components/BoardList",
  argTypes: {
    fetchData: { action: "requested data" },
  },
  args: {
    rows: [],
  },
  decorators: [
    (Story) => (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DataWrapper>
          <Story />
        </DataWrapper>
      </GestureHandlerRootView>
    ),
  ],
} satisfies Meta<typeof MyBoardList>;

export default meta;

type Story = StoryObj<typeof MyBoardList>;

export const Empty: Story = {};

export const RowsInFuture: Story = {
  args: {
    rows: [
      {
        date: formatDate(new Date()),
        comments: [],
        assignments: [],
      },
      {
        date: formatDate(new Date(`${new Date().getFullYear() + 1}-01-01`)),
        comments: [],
        assignments: [],
      },
      {
        date: formatDate(new Date(`${new Date().getFullYear() + 2}-01-01`)),
        comments: [],
        assignments: [],
      },
      {
        date: formatDate(new Date(`${new Date().getFullYear() + 3}-01-01`)),
        comments: [],
        assignments: [],
      },
    ],
  },
};

export const Filled: Story = {
  args: {
    rows: [
      {
        date: formatDate(new Date()),
        comments: [],
        assignments: [
          {
            id: 0,
            userId: 0,
            boardColumnId: 0,
          },
        ],
      },
      {
        date: formatDate(new Date(`${new Date().getFullYear() + 1}-01-01`)),
        comments: [],
        assignments: [
          {
            id: 1,
            userId: 1,
            boardColumnId: 0,
          },
        ],
      },
      {
        date: formatDate(new Date(`${new Date().getFullYear() + 2}-01-01`)),
        comments: [
          {
            id: 1,
            boardColumnId: 1,
            text: "This is a short comment",
          },
        ],
        assignments: [],
      },
      {
        date: formatDate(new Date(`${new Date().getFullYear() + 3}-01-01`)),
        comments: [
          {
            id: 0,
            boardColumnId: 1,
            text: "This is a longer comment that will certanly span over multiple columns to demonstrate, that fields will expand",
          },
        ],
        assignments: [],
      },
    ],
  },
};

export const WithPast: Story = {
  args: {
    rows: [
      {
        date: formatDate(new Date("2020-01-01")),
        comments: [
          {
            id: 0,
            boardColumnId: 1,
            text: "This is in the past",
          },
        ],
        assignments: [],
      },
      {
        date: formatDate(new Date("2020-01-02")),
        comments: [
          {
            id: 1,
            boardColumnId: 1,
            text: "This is also in the past",
          },
        ],
        assignments: [],
      },
      {
        date: formatDate(new Date()),
        comments: [
          {
            id: 4,
            boardColumnId: 1,
            text: "This is today",
          },
        ],
        assignments: [],
      },
      {
        date: formatDate(new Date(`${new Date().getFullYear() + 2}-01-01`)),
        comments: [
          {
            id: 2,
            boardColumnId: 1,
            text: "This is in the future",
          },
        ],
        assignments: [],
      },
      {
        date: formatDate(new Date(`${new Date().getFullYear() + 3}-01-01`)),
        comments: [
          {
            id: 3,
            boardColumnId: 1,
            text: "This will be in 3 years",
          },
        ],
        assignments: [],
      },
    ],
  },
};
