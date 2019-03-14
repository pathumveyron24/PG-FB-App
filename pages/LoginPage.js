import React from 'react';
import { Text, View, Image } from 'react-native';
import  TextBox  from '../components/TextBox';
import  MyButton  from '../components/MyButton';
import firebase from 'firebase';


export default class LoginPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {email:'', password:''};
        this.login = this.login.bind(this);
    }
    componentWillMount(){
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
        const { navigate } = this.props.navigation;
        firebase.auth().onAuthStateChanged((user)=>{
          console.log("LOGIN="+JSON.stringify(user));
          if(user){
              navigate('Home');
          }
        });
        
    
   
    }
    
    render(){
        const { navigate } = this.props.navigation;
        return (
            <View>
                <Image style={{width:'100%',height:100}}
                source={require('../assests/fb.png')}/>
                <Text>Login Page</Text>
                <TextBox onChangeText={(text) => this.setState({email:text})} label="Email" name="email" value={this.state.email} hint="john@example.com"/>
                <TextBox onChangeText={(text) => this.setState({password:text})} label="Password" name="password" value={this.state.password} hint="password"/>
                <MyButton onPress={this.login} title="LOGIN"/>
                <View style={{height:25}}>
                    <Text>No I Dont Have an Account.</Text>
                </View>
                <MyButton onPress={() => navigate('Register')} title="REGISTER"/>
            </View>
        );
    }
    login(){
        let email = this.state.email;
        let password = this.state.password;
        const { navigate } = this.props.navigation;
        
        firebase.auth().signInWithEmailAndPassword(email,password)
        .then(function(data) {
                navigate('Home', { uid: data.user.uid });

    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if(errorCode == 'auth/wrong-password'){
            alert('Wrong Password');
        }else{
            alert(errorMessage.toString());
        }
    });
}
    
}