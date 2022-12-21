import { ActivityIndicator, FlatList, StyleSheet, Text, View, Image, TextInput, Button, SafeAreaView } from 'react-native';
import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'left',
        justifyContent: 'center',
    },
});

const BlogPostPreview = ({ id, title, content, imageUrl, navigation }) => {

    console.log("Title is " + title);

    return (
        <View onClick={() => {
            navigation.navigate('Details', {
                id: id,
                title: title,
                content: content,
                imageUrl: imageUrl,
            });
        }}>
            <Text style={{ fontSize: "2em" }}>{title}</Text>
            <Text>{content}</Text>
            <Image
                style={{ width: 100, height: 100 }}
                source={{
                    uri: imageUrl
                }}
            />
        </View>
    );
};



export function Headr() {
    return (
        <div style={{ backgroundColor: 'grey', alignItems: 'center' }} className="headr">
            <h1>BLOGI</h1>
        </div>
    )
}






const BlogListScreen = ({ navigation }) => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const getBlogPostsFromApi = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/AleksanderDalton0511/blog-posts.json/main/blog-posts.json');
            const json = await response.json();
            setData(json.posts);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getBlogPostsFromApi();
    }, []);

    if (isLoading) {
        return <View style={styles.container}><ActivityIndicator /></View>
    }

    return (

        <View style={styles.container}>
            <Headr />
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    console.log(item)
                    return <BlogPostPreview
                        id={item.id}
                        title={item.title}
                        content={item.content}
                        imageUrl={item.imageUrl}
                        navigation={navigation}
                    />
                }}
            />
        </View>
    );
}





const BlogPostCommentPreview = ({ name, comment }) => {
    return (
        <View>
            <Text style={{ fontSize: "2em" }}>{name}</Text>
            <Text>{comment}</Text>

        </View>
    );
};


const BlogPostDetails = ({ id, title, content, imageUrl }) => {
    const navigation = useNavigation();
    console.log(id);
    console.log('http://localhost:3000/post/' + id + '/comments');
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [name, onChangeName] = useState("");
    const [comment, onChangeComment] = useState("");

    console.log(title);
    const getBlogPostCommentsFromApi = async () => {
        try {
            const response = await fetch('http://localhost:3000/post/' + id + '/comments');
            const json = await response.json();
            setData(json);
            console.log("printing" + response);
            console.log(response);
            console.log(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getBlogPostCommentsFromApi();
    }, []);

    if (isLoading) {
        return <View style={styles.container}><ActivityIndicator /></View>
    }



    const sendComment = () => {
        fetch('http://localhost:3000/add-comment', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                comment: comment,
                postId: id
            })
        });
        getBlogPostCommentsFromApi();
        onChangeComment("");
        onChangeName("");
    }

    return (
        <SafeAreaView>
            <Text style={{ fontSize: "2em" }}>{title}</Text>
            <Text>{content}</Text>
            <Image
                style={{ width: 300, height: 300 }}
                source={{
                    uri: imageUrl
                }}
            />
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    console.log(item)
                    return <BlogPostCommentPreview
                        name={item.name}
                        comment={item.comment}
                    />
                }}
            />
            <Text>   </Text>
            <Text>Add comments here</Text>
            <Text>Name:</Text>
            <TextInput style={{ border: "thin solid black" }} value={name} onChangeText={onChangeName} />
            <Text>Comment:</Text>
            <TextInput style={{ border: "thin solid black" }} value={comment} onChangeText={onChangeComment} />
            <Button onPress={() => sendComment()} title="Send comment " />
            <Button
        title="Go home"
        onPress={() => navigation.navigate('Home')}
      />
        </SafeAreaView>
    );
};


const BlogDetailsScreen = (navigation) => {

    const { id, title, content, imageUrl } = navigation.route.params;

    console.log(title);

    return (
        <View style={styles.container}>
            <BlogPostDetails
                id={id}
                title={title}
                content={content}
                imageUrl={imageUrl}
            />
        </View>
    );
}




const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={BlogListScreen}
                />
                <Stack.Screen name="Details" component={BlogDetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
