import React from 'react';
import { Text, View, Image, Alert, StyleSheet, Button } from 'react-native';
import  TextBox  from '../components/TextBox';
import  MyButton from '../components/MyButton';
import firebase from 'firebase';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

export default class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {text:'', mid:'',url:'',photo:null, posts:[]};
        this.post=this.post.bind(this);
    }
   componentDidMount(){
       let user = firebase.auth().currentUser;
       this.state.mid = user.uid;
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
    console.log("Database Initialized...");
    
    var ref = firebase.database().ref('posts');
    ref.on('value',(data) => {
        post_array = [];
        var objects = data.toJSON();
        for(const pid in objects){
           var object=objects[pid];
           var mid= object.mid;
           var text= object.post;
           var likes=object.likes;
           var photo=object.photo;

           var refM = firebase.database().ref('member/'+mid);
           refM.on('value',(data)=>{
               post_array.push({
                   id:pid,
                   mid:mid,
                   post:text,
                   likes:likes,
                   photo:photo,
                   name: data.toJSON().name
               });
               this.setState({
                   posts:post_array,
               })
           });
        }
    });
   }

    render(){
        const {photo} = this.state;
        return (
            <View>
                <ScrollView scrollEnabled={true}>
                <Image style={{width:'100%' ,height:100}} source={require('../assests/fb.png')}/>
                <Text>Home Page</Text>
                <TextBox onChangeText={(text) => this.setState({text: text})}
                label="Write a Post" name="text" value={this.state.text}
                hint="What's on Your Mind?"/>
                <Button
                title="Choose a Photo"
                onPress={this.handlePhoto}/>
                {photo && (
                    <Image
                    source={{uri:photo.url}}
                    style={{width:80,height:80, borderWidth: 1, borderColor: '#5998C5'}}
                    />
                )}
                <MyButton onPress={this.post} title="Post"/>
                <View>
                    <FlatList 
                    data={this.state.posts}
                    renderItem={
                        ({item,index})=> {
                            return(
                                <View style={styles.postbox}>
                                <View style={{flex:1}}>
                                <Image 
                                source={require('../assests/profile.png')}
                                style={{width:40,height:40,borderRadius:40/2}}/>
                                <Text>{item.name}</Text>
                                </View>
                                <Text>{item.post}</Text>
                                <Image
                                    source={{uri:item.photo}}
                                    style={{width:'100%',height:250}}/>
                                <View style={{width:'100%',flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                                <Text> {item.likes} Likes </Text>
                                <Button onPress={()=>{
                                    var ref = firebase.database().ref('posts/'+item.id+"/likes");
                                    ref.transaction(function(likeCount){
                                        return (likeCount || 0) + 1;
                                    });
                                }} title="LIKE"/>
                                </View>
                                </View>
                            );
                        }
                    }
                    key={
                        (item) => item.toString()
                    }

                    >

                    </FlatList>

                </View>
                </ScrollView>
            </View>
        );
    }
    post(){
        let text = this.state.text;
        let mid= this.state.mid;
        let url= this.state.url;
        fetch(
            'https://fb-app-pathum.firebaseio.com/posts.json',
            {
                method: 'POST',
                body: JSON.stringify(
                    {
                        post:text,
                        mid:mid,
                        photo:url,
                    }
                )
            }
        ).then(
            res => {
                console.log(res);
                alert("Posted");
                this.setState({text:''});
            }
        ).catch(
            err => console.log(err)
        );
        
    }

    handlePhoto = ()=>{
        const options = {
        };
        ImagePicker.launchImageLibrary(options, response =>{
            console.log("Response = "+JSON.stringify(response));
            if(response.uri){
                this.setState({
                    photo: response
                });

                let name = response.uri.split('/');
                name = name[name.length - 1];
                const image = response.uri
 
    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob
 
   
    let uploadBlob = null
    const imageRef = firebase.storage().ref('posts').child(name)
    let mime = 'image/jpg'
    fs.readFile(image, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
    })
    .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        // URL of the image uploaded on Firebase storage
        console.log(url);
        this.setState({
            url: url
        });
      })
      .catch((error) => {
        console.log(error);
 
      })  ;
 
    
            }
        });
    }
}

const styles = StyleSheet.create({
    postbox: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#5998C5',
        alignItems: 'center',
        justifyContent:'center',
        padding:30,
    },
});