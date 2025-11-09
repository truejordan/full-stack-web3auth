import { View } from "react-native";
import React from "react";
import { Image, ImageContentFit } from "expo-image";

const HuiImage = ({
  source,
  className = "",
  contentFit = "contain",
}: {
  source: string;
  className: string;
  contentFit: ImageContentFit;
}) => {
  return (
    <View className={className}>
      <Image
        source={{ uri: source }}
        style={{ width: "100%", height: "100%",  }}
        contentFit={contentFit}
      />
    </View>
  );
};

export default HuiImage;
