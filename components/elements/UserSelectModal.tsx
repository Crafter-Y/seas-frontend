import { Pressable, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Button from "./Button";
import tw from "@/tailwind";
import Input from "./Input";
import { FlashList } from "@shopify/flash-list";
import ExpoCheckbox from "expo-checkbox";

type Props = {
  closeModal?: () => void;
  initialSelectedUserId: number | null;
  onUserSet: (userId: number | null) => void;
  allUsers: { firstname: string; lastname: string; id: number }[];
};

export default function UserSelectModal({
  closeModal,
  initialSelectedUserId,
  onUserSet,
  allUsers,
}: Props) {
  const [renderedItems, setRenderedItems] = useState<
    (ArrayElement<typeof allUsers> | null)[]
  >([]);

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<number>(
    initialSelectedUserId ?? -1
  );

  const includeEmptySelection = () => {
    const renderItems: typeof renderedItems = Array.from(allUsers);
    renderItems.push(null);
    renderItems.sort((a) => (a != null ? 1 : -1));
    setRenderedItems(renderItems);
  };

  useEffect(() => {
    if (allUsers.length) {
      includeEmptySelection();
    }
  }, [allUsers]);

  useEffect(() => {
    if (search.length && search.trim().length && allUsers.length) {
      const searchTerms = search
        .split(" ")
        .map((el) => el.toLowerCase())
        .filter((el) => el.length);

      const res: (typeof allUsers)[] = [];

      allUsers.forEach((user) => {
        const searchableTokens = [user.firstname, user.lastname].map((el) =>
          el.toLowerCase()
        );

        let matches = 0;

        searchTerms.forEach((term) => {
          searchableTokens.forEach((token) => {
            if (term == token) {
              matches += 5;
            } else if (token.includes(term)) {
              matches += 3;
            } else if (term.includes(token)) matches++;
          });
        });

        if (res[matches] == undefined) {
          res[matches] = [user];
        } else {
          res[matches].push(user);
        }
      });
      res[0] = [];
      setRenderedItems(res.flat().reverse());
    } else {
      includeEmptySelection();
    }
  }, [search]);

  return (
    <View>
      <Input
        placeholder="Suchen ..."
        onChangeText={(text) => setSearch(text)}
        style={tw`mx-2`}
      />

      <View style={{ height: 256, paddingTop: 8 }}>
        <FlashList
          data={renderedItems}
          extraData={selectedUser}
          estimatedItemSize={20}
          ListEmptyComponent={() => {
            return <Text style={tw`mx-2`}>Keine Treffer gefunden</Text>;
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={item?.id ?? -1}
              style={tw`h-12 flex-row items-center bg-gray-200 px-2 gap-2 ${
                index % 2 == 0 ? "bg-gray-100" : ""
              }`}
              onPress={() => setSelectedUser(item?.id ?? -1)}
              activeOpacity={0.5}
            >
              <Pressable onPress={() => setSelectedUser(item?.id ?? -1)}>
                <ExpoCheckbox
                  key={(selectedUser == item?.id ?? -1) + ""}
                  value={selectedUser == (item?.id ?? -1)}
                  onValueChange={() => setSelectedUser(item?.id ?? -1)}
                />
              </Pressable>

              {item && (
                <Text>
                  {item.firstname} {item.lastname}
                </Text>
              )}
              {!item && <Text>---</Text>}
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={tw`flex-row justify-center my-2`}>
        <Button
          onPress={() => {
            onUserSet(selectedUser == -1 ? null : selectedUser);
            closeModal?.();
          }}
        >
          Fertig
        </Button>
      </View>
    </View>
  );
}
