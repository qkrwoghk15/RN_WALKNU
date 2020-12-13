import React from 'react';
import { View, Text, StyleSheet,Dimensions, Linking, ImageBackground } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

export default class Cite extends React.PureComponent {
  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  render() {
    return (
      <View style={styles.container}>
        <Menu
          ref={this.setMenuRef}
          button={<Text onPress={this.showMenu} style={styles.menutext}>◁ 사이트</Text>}
        >
          <MenuItem onPress={this.hideMenu} style={styles.menubtn}>
            <Text onPress={() => Linking.openURL('http://knu.ac.kr')}>경북대학교 홈페이지</Text>
          </MenuItem>
          <MenuItem onPress={this.hideMenu} style={styles.menubtn}>
            <Text onPress={() => Linking.openURL('http://computer.knu.ac.kr')}>경북대학교 컴퓨터학부</Text>
          </MenuItem>
          <MenuItem onPress={this.hideMenu} style={styles.menubtn}>
            <Text onPress={() => Linking.openURL('http://yes.knu.ac.kr')}>경북대학교 yes통합시스템</Text>
          </MenuItem>
        </Menu>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {width: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 10,},
  menutext: {fontSize: 15, color: 'white', padding: 5},
  menubtn: {height: 40,}
})