import { View, Text, Pressable } from "react-native";
import React, { useEffect, useRef } from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";

type Props = {
  dateStart: Date;
  dateEnd: Date;
};
const BoardList = ({ dateStart, dateEnd }: Props) => {
  const { isSm } = useMediaQueries();

  const lastRequest = useRef(new Date());

  useEffect(() => {
    lastRequest.current = new Date();
    setTimeout(() => {
      if (new Date().getTime() - lastRequest.current.getTime() < 1000) return;
      fetchData(dateStart, dateEnd);
    }, 1000);
  }, [dateStart, dateEnd]);

  const fetchData = (start: Date, end: Date) => {
    console.log("query", start, end);
  };

  return (
    <View
      style={tw.style({
        "px-0": !isSm,
        "px-6": isSm,
      })}
    >
      <Text>
        BoardList: {dateStart.toDateString()} - {dateEnd.toDateString()}
      </Text>
      <Pressable style={tw`flex flex-row w-full`}>
        <View style={tw`bg-red-400 flex-grow flex-shrink basis-full`}>
          <Text>
            Hello Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Debitis nulla necessitatibus esse ipsum illum aspernatur sunt
            dolores quaerat porro, nobis nam! Quod, eaque dolor aliquam ipsam id
            quis. Ducimus laudantium eius quae, magnam nostrum molestias cumque
            laborum aperiam assumenda cum aut rerum iusto ut ullam non adipisci
            quis? Quam, nesciunt adipisci modi nobis tenetur repellendus amet
            blanditiis quisquam nemo earum numquam odit at perferendis ipsum
            esse. Animi voluptatum delectus aspernatur excepturi, vitae aut
            saepe nisi, cumque magnam corrupti quis corporis asperiores soluta
            alias. Quia suscipit eos expedita, commodi nihil, nobis rem quod
            voluptatem dolore ab aliquid quibusdam,eius assumenda esse? Quia
            suscipit eos expedita, commodi nihil, nobis rem quod voluptatem
            dolore ab aliquid quibusdam, eius assumenda esse?Quia suscipit eos
            expedita, commodi nihil, nobis rem quod voluptatem dolore ab aliquid
            quibusdam, eius assumenda esse?Quia suscipit eos expedita, commodi
            nihil, nobis rem quod voluptatem dolore ab aliquid quibusdam, eius
            assumenda esse?Quia suscipit eos expedita, commodi nihil, nobis rem
            quod voluptatem dolore ab aliquid quibusdam, eius assumenda esse?
          </Text>
        </View>
        <View
          style={tw`bg-green-400 flex-grow flex-grow flex-shrink basis-full`}
        >
          <Text>World</Text>
        </View>
        <View
          style={tw`bg-gray-400 flex-grow flex-grow flex-shrink basis-full`}
        >
          <Text>e</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default BoardList;
