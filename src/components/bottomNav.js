import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import MainPage from './mainPage'
import Library from './library'


const SearchRoute = () => <MainPage/>;

const LibraryRoute = () => <Library/>;


const MyComponent = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'search', title: 'Search books', icon: 'magnify' },
    { key: 'library', title: 'My library', icon: 'book-multiple' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    search: SearchRoute,
    library: LibraryRoute,
  });

  return (
    <BottomNavigation 
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
     
      barStyle={{backgroundColor:'#0063cc'}}
    />
  );
};



export default MyComponent;