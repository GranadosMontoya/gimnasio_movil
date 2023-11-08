import React, {useState} from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';


function LoginScreen() {

  const navigation = useNavigation();

  GoogleSignin.configure({
    webClientId: '232780247572-5cm4r75jn76vdlcmv5phv4i26o0kmtkc.apps.googleusercontent.com',
  });
  const [uidLocal, setUidLocal] = useState();
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const [username, setUsername] = useState('');
  const [genero, setGenero] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [proposito, setProposito] = useState("");
  const Superusuario=false;
  const rutina = ''

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const navigateToHomeAdmin = () => {
    navigation.navigate('HomeAdmin');
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const RegistroGoogle = async () => {
    
    if (!cedula || !username) {
      Alert.alert('Por favor, completa todos los campos antes de registrarte.');
      return;
    }
    if (uidLocal) {
      const db = getDatabase();
      const userRef = ref(db, 'usuarios/' + uidLocal);
      const userData = {
        nombre: nombre,
        email: email,
        cedula: cedula,
        username: username,
        genero: genero,
        edad: edad,
        peso: peso,
        altura: altura,
        proposito: proposito,
        Superusuario : Superusuario,
        rutina : rutina
      };
      await set(userRef, userData);
      navigateToHome();
    }
  };

  const LoginGoogle = async() =>{
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const user_sing_in = auth().signInWithCredential(googleCredential);

    try {
      const userCredential = await user_sing_in;
      const user = userCredential.user;
      setUidLocal(user.uid)
      if (user) {
        const db = getDatabase();
        const userRef = ref(db, 'usuarios/' + user.uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.Superusuario === true) {
            navigateToHomeAdmin();
          } else {
            navigateToHome();
          }
        } else {
          setNombre(user.displayName || '');
          setEmail(user.email || '');
          setShowModal(true);
        }
      } else {
        Alert.alert('Error de autenticación: El usuario no se autenticó correctamente');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error al iniciar sesión: ' + error.message);
    }
  }
    
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.greetingText}>¡Bienvenido!</Text>
        <Text style={styles.descriptionText}>Power coahes
          y sus entrenadores han entrenado a cualquier tipo de persona. 
          Sin importanr sus limitaciones y posibles problemas de salud. 
          Somos fieles creyentes que todo el mundo merece el chance de estar saludable
          y nuestra meta como compañía es ayudarte a conseguir TUS metas. No importa qué nivel
          de entrenamiento tengas, nosotros nos acomodamos a ti! Power coahes diferente a los demás 
          Power coahes es diferente porque no nos consideramos ser solo una compañía de entrenamiento personal. 
          Enfocándonos en nuestros clientes nos aseguramos que todo el mundo esté recibiendo un entrenamiento 
          experto y personalizado. Ningún cliente recibe el mismo entrenamiento, pero todos reciben la misma atención
          y cariño e importancia
        </Text>
      </View>
      <TouchableOpacity onPress={LoginGoogle} style={styles.button}>
        <View style={styles.buttonContent}>
          <Image
            source={require('../images/google.png')}
            style={styles.buttonImage}
          />
          <Text>Iniciar sesión con Google</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre completo"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Correo electronico"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Cedula"
              onChangeText={setCedula}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre de usuario"
              onChangeText={setUsername}
            />
            <Text>Selecciona tu género:</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, genero === 'Masculino' && styles.selectedButton]}
                onPress={() => setGenero('Masculino')}
              >
                <Text>Masculino</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, genero === 'Femenino' && styles.selectedButton]}
                onPress={() => setGenero('Femenino')}
              >
                <Text>Femenino</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Edad"
              onChangeText={setEdad}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Peso(KG)"
              onChangeText={setPeso}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Altura(CM)"
              onChangeText={setAltura}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Proposito"
              onChangeText={setProposito}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={RegistroGoogle} style={styles.registerButton}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      elevation: 3,
    },
    greetingText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'black',
    },
    descriptionText: {
      fontSize: 16,
      marginTop: 10,
      color: 'black',
    },
    button: {
      backgroundColor: 'blue',
      marginTop: 20,
      padding: 10,
      borderRadius: 5,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonImage: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    modalInput: {
      width: '100%',
      borderWidth: 1,
      padding: 10,
      marginBottom: 10,
    },
    buttonsContainer: {
      flexDirection: 'row',
      marginTop: 10,
    },
    button: {
      padding: 10,
      margin: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    selectedButton: {
      backgroundColor: 'blue',
      borderColor: 'blue',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    closeButton: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
      flex: 1,
      marginRight: 5,
      maxWidth: '30%',
    },
    registerButton: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      flex: 1,
      marginLeft: 5,
      maxWidth: '30%',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

export default LoginScreen;