import * as React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

export default function MyTabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row', height: SCREEN_HEIGHT*0.08}}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          // if (!isFocused && !event.defaultPrevented) {
          //   navigation.navigate(route.name);
          // }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 , backgroundColor: isFocused? '#F0EDE4' : 'white'}}
          >
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image source={label == "시간표"? require('../images/table.png'):require('../images/timeMap.png')} 
                    style={{resizeMode: 'contain', width: '90%', height: '70%'}}></Image>
              <Text>{label}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}