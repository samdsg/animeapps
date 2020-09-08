import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { Feather as Icon } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { SharedElement } from "react-navigation-shared-element";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  useCode,
  block,
  cond,
  call,
  not,
  eq,
  and,
  set,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useMemoOne, useCallbackOne } from "use-memo-one";

import { Description } from "./components";
import { Listing as ListingModel } from "./components/Listing";
import {
  onGestureEvent,
  useValues,
  snapPoint,
  timing,
} from "react-native-redash";

const { width, height } = Dimensions.get("window");
const SNAP_BACK = height / 2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
  },
  image: {
    width,
    height: width,
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
  },
});
const Listing = () => {
  const { goBack, getParam } = useNavigation();
  const listing: ListingModel = getParam("listing");

  const [
    translationX,
    translationY,
    velocityY,
    translateX,
    translateY,
    shouldSnapBack,
    state,
  ] = useValues<number>(0, 0, 0, 0, 0, 0, State.UNDETERMINED);

  /* To determine the position for snapping back */
  const snapTo = snapPoint(translationY, velocityY, [0, SNAP_BACK]);

  /* This is just for going backward */
  useCode(
    () =>
      block([
        cond(
          shouldSnapBack,
          call([], () => goBack()),
          cond(
            eq(state, State.END),
            [
              set(translateX, timing({ from: translateX, to: 0 })),
              set(translateY, timing({ from: translateY, to: 0 })),
            ],
            [(set(translateX, translationX), set(translateY, translationY))]
          )
        ),
        cond(
          and(not(shouldSnapBack), eq(snapTo, SNAP_BACK), eq(state, State.END)),
          set(shouldSnapBack, 1)
        ),
      ]),
    []
  );

  const gestureHandler = useMemoOne(
    () =>
      onGestureEvent({
        translationX,
        translationY,
        velocityY,
        state,
      }),
    [state, translateX, translateY, velocityY]
  );

  const scale = interpolate(translateY, {
    inputRange: [0, SNAP_BACK],
    outputRange: [1, 0.8],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX }, { translateY }, { scale }],
            backgroundColor: 'white'
          }}
        >
          <View>
            <SharedElement id={listing.id}>
              <Image
                style={styles.image}
                resizeMode="cover"
                source={listing.picture}
              />
            </SharedElement>
            <SafeAreaView style={styles.thumbnailOverlay}>
              <Icon.Button
                name="x"
                backgroundColor="transparent"
                underlayColor="transparent"
                onPress={() => goBack()}
              />
            </SafeAreaView>
          </View>
          <Description />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

Listing.sharedElements = (navigation: ReturnType<typeof useNavigation>) => {
  const listing = navigation.getParam("listing");
  return [listing.id];
};

export default Listing;
