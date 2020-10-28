import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Headline,HelperText, 
   DefaultTheme, ActivityIndicator,
  Searchbar, Button} from 'react-native-paper'

const theme={
  ...DefaultTheme,
  colors:{
    ...DefaultTheme.colors,
    primary:'#0063cc',
    background:'#0063cc'
  },
  
}



export default function MainPage() {
  const [searchQuery, setSearchQuery]=React.useState('');
  const [searchError, setSearchError]=React.useState(false);
  const [activityLoad, setActivityLoad]=React.useState(false);


 
  const searchBooks=()=>{
    if(searchQuery.length<4){
      setSearchError(true);
      return;
    }
    setSearchError(false)
    setActivityLoad(true)
    console.log(searchQuery)
  }

  return (
    <View theme={theme} style={styles.container}>
      <Headline style={styles.heading}>Search millions of{'\n'} books online</Headline>
      <Searchbar 
        placeholder='Search any book'
        value={searchQuery}
        style={{ margin:15}}
        onIconPress={searchBooks}
        onChangeText={text=>setSearchQuery(text)}/>

        <HelperText type="error" visible={searchError}>
          Search text has to be at least 4 characters!
        </HelperText>
   
     <Button id='back-to-top'
      mode='contained'
      color='#006fe6'
      icon='book-search'
      contentStyle={{height:40}}
      labelStyle={{textTransform:'none', fontSize:16, fontWeight:"500"}}
      style={{borderRadius:20}}
     onPress={searchBooks}>Search books</Button>
     
     <ActivityIndicator 
     animating={activityLoad} size='large'
      style={{marginTop:100}} 
      color='#ff0000'/>
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems:'center',
    textAlign:'center',
    fontFamily: "arial",
    padding:'2%'
  },
  heading:{
    textAlign:'center',
     letterSpacing:1, 
     fontSize:25,
     marginTop:'30%'
  },

  pagination:{
        padding:'1%',
     }
});
