import React from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';

export default class TextBox extends React.Component{
    render(){
        return (
            <View style={styles.box}>
                <Text>{this.props.label}</Text>
                <TextInput 
                name={this.props.name}
                value={this.props.value}
                onChangeText={this.props.onChangeText}
                placeholder={this.props.hint}
                ></TextInput>
            </View>
        );
    }
}
const styles=StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        padding:30,
    },
    box:{
    width:'90%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#5998C5',
    padding:10,
    margin:10,
}
    });
