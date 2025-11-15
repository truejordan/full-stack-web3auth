// import { Tabs } from "expo-router";
import React from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Text } from "react-native-gesture-handler";
import { useResolveClassNames, withUniwind } from 'uniwind';
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
} from "expo-router/ui";
import { Pressable } from "react-native";
import { BlurView } from "expo-blur";

export default function TabLayout() {
  const activeStyles = useResolveClassNames('text-foreground');
  const inactiveStyles = useResolveClassNames('text-muted/40');
  const activeBackgroundColor = useResolveClassNames('bg-field-background/40');

  const TabButton = ({
    icon,
    children,
    isFocused,
    ...props
  }: TabTriggerSlotProps & {
    icon: string;
    children?: React.ReactNode;
  }) => (
    <Pressable
      {...props}
      className="flex-col items-center justify-center gap-1 p-2"
      style={{ display: "flex" }}
    >
      <IconSymbol
        size={28}
        name={icon as any}
        color={isFocused ? activeStyles.color as string : inactiveStyles.color as string}
      />
      {children && (
        <Text
          className={`text-sm ${isFocused ? "text-foreground" : "text-muted/40"}`}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );

  return (
    <Tabs className="flex-1 ">
      <TabSlot />
      <TabList
        asChild
        className="mb-4 px-4 items-center absolute bottom-0 left-0 right-0"
        style={{
          justifyContent: "space-around",
          shadowColor: "black",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        <BlurView
          intensity={30}
          className="mx-8 px-8 p-2 overflow-hidden rounded-full"
          style={{
            backgroundColor: activeBackgroundColor.backgroundColor as string,
          }}
        >
          <TabTrigger name="home" href="/(tabs)" asChild>
            <TabButton icon="house.fill">Home</TabButton>
          </TabTrigger>
          {/* <TabTrigger name="activity" href="/(tabs)/activity" asChild>
            <TabButton icon="arrow.up.arrow.down.square.fill">
              Activity
            </TabButton>
          </TabTrigger> */}

          <TabTrigger name="explore" href="/(tabs)/explore" asChild>
            <TabButton icon="paperplane.fill">Explore</TabButton>
          </TabTrigger>
        </BlurView>
      </TabList>
    </Tabs>
  );
}
