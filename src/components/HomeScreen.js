import React, { useState, useEffect } from 'react';
import { View, Text ,TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


const HomeScreen = () => {

    const navigation = useNavigation();
    const auth = getAuth();

    const navigateToLogin = () => {
        navigation.navigate('Index');
    };
    

    async function LogoutGoogle() {
        try {
          await signOut(auth);
          await GoogleSignin.signOut(); // Cierra la sesión de Google
          navigateToLogin();
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
          navigateToLogin();
        }
      }
    const [userData, setUserData] = useState(null); // Esto es para almacenar la información del usuario

    useEffect(() => {
    // Obtener la información del usuario desde la base de datos en tiempo real
    const db = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(db, 'usuarios/' + user.uid);
      // Esto es lo que hace que se actualize en tiempo real
      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserData(userData);
        } else {
          console.log('El usuario no existe en la base de datos.');
        }
      });
    }
    }, []);

    return (
        <View style={styles.container}>
          <Text style={styles.welcomeText}>¡Bienvenido, aquí encontraras toda tu información!</Text>
          <Text style={styles.infoText}>Nombre: {userData ? userData.nombre : 'Cargando...'}</Text>
          <Text style={styles.infoText}>Email: {userData ? userData.email : 'Cargando...'}</Text>
          <Text style={styles.infoText}>Cedula: {userData ? userData.cedula : 'Cargando...'}</Text>
          <Text style={styles.infoText}>Altura: {userData ? userData.altura : 'Cargando...'}</Text>
          <Text style={styles.infoText}>Peso: {userData ? userData.peso : 'Cargando...'}</Text>
          <Text style={styles.infoText}>Propósito: {userData ? userData.proposito : 'Cargando...'}</Text>
          <Text style={styles.infoText}>Rutina asignada: {userData ? userData.rutina : 'Cargando...'}</Text>
          <TouchableOpacity onPress={LogoutGoogle} style={styles.button}>
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign:'center'
    },
    infoText: {
      fontSize: 16,
      marginBottom: 10,
    },
    button: {
      padding: 10,
      margin: 10,
      borderWidth: 1,
      borderColor: 'blue',
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 16,
      color: 'blue',
    },
  });
  

export default HomeScreen;
