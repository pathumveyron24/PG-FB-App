import React from 'react';
import { Text, ScrollView, Image, View } from 'react-native';
import  TextBox  from '../components/TextBox';
import  MyButton  from '../components/MyButton';
import firebase from 'firebase';

export default class RegisterPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {name:'', contact:'', email:'', password:''};
        this.register = this.register.bind(this);
        }

        componentDidMount(){
             // Initialize Firebase
            var config = {
                apiKey: "AIzaSyCcFQkZ7HIMoLhQTZ2bh02GIgxin6w0LFM",
                authDomain: "fb-app-pathum.firebaseapp.com",
                databaseURL: "https://fb-app-pathum.firebaseio.com",
                projectId: "fb-app-pathum",
                storageBucket: "fb-app-pathum.appspot.com",
                messagingSenderId: "304984233116"
            };
            if(!firebase.apps.length){
                firebase.initializeApp(config);
            }
            
        }

    render(){
        return (
            <ScrollView>
                <Image style={{width:'100%' ,height:100}} source={require('../assests/fb.png')}/>
                <Text>Register Page</Text>
                <TextBox onChangeText={(text) => this.setState({name:text})} label="Name" name="name" value={this.state.name} hint="John Cena"/>
                <TextBox onChangeText={(text) => this.setState({contact:text})} label="Contact" name="contact" value={this.state.contact} hint="095358358345"/>
                <TextBox onChangeText={(text) => this.setState({email:text})} label="Email" name="email" value={this.state.email} hint="john@example.com"/>
                <TextBox onChangeText={(text) => this.setState({password:text})} label="Password" name="password" value={this.state.password} hint="password"/>
                <MyButton onPress={this.register} title="REGISTER"/>
            </ScrollView>
        );
    }
    login(){

    }
    register(){
        let name = this.state.name;
        let email = this.state.email;
        let contact = this.state.contact;
        let password = this.state.password;
        const { navigate } = this.props.navigation;

        firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(function(data) {
            data.user.updateProfile({
                displayName: name,
                phoneNumber: contact
            }).then(
                function(){
                    console.log("Updated...");
                },
                function(error){
                    console.log("Error Updating User Data..."+error);
                }
            );
                //console.log("UID = "+user.user.uid);
                firebase.database().ref('member/' +data.user.uid).set({
                   name:name,
                  email:email,
                  contact:contact,
                  password:password
                });
                alert("Success!");
                navigate('Login');
        }).catch(function(error){
            var errorMessage = error.message;
            console.log("Error = "+errorMessage);
            alert(errorMessage);
        });

    }
}