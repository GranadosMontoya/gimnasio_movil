import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { getDatabase, ref, onValue, set } from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

function SuperComponent() {

    const navigation = useNavigation();
    const auth = getAuth();
    const db = getDatabase();

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [rutina, setRutina] = useState('');

    const navigateToLogin = () => {
        navigation.navigate('Index');
    };

    async function handleSignOut() {
        try {
            await signOut(auth);
            await GoogleSignin.signOut(); // Cierra la sesión de Google
            navigateToLogin();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            navigateToLogin();
        }
    }

    useEffect(() => {

        const userRef = ref(db, 'usuarios');

        const unsubscribe = onValue(userRef, (snapshot) => {
          const usersData = snapshot.val();
          if (usersData) {
              const userList = Object.keys(usersData).map((uid) => ({
              uid,
              ...usersData[uid],
              }));
              setUsers(userList);
          }
        });

        return () => {
          unsubscribe();
        };
    }, [db]);

    const handleAsignarRutina = (user) => {
        setSelectedUser(user);
    };

    const handleGuardarRutina = async () => {
        if (selectedUser) {
        const userRef = ref(db, `usuarios/${selectedUser.uid}`);
        await set(userRef, {
            ...selectedUser,
            rutina,
        });
        setSelectedUser(null);
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.headerText}>¡Bienvenido! Eres un superusuario</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <FlatList
            data={users}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
            <View style={styles.userItem}>
                <Text>
                {item.nombre} - {item.cedula}
                </Text>
                <Text>Rutina asignada: {item.rutina}</Text>
                <Button
                title="Asignar Rutina"
                onPress={() => handleAsignarRutina(item)}
                />
            </View>
            )}
        />

        {selectedUser && (
            <View style={styles.rutinaContainer}>
            <Text style={styles.rutinaText}>
                Asignar Rutina a {selectedUser.nombre}:
            </Text>
            <TextInput
                style={styles.rutinaInput}
                value={rutina}
                onChangeText={(text) => setRutina(text)}
                placeholder="Rutina"
            />
            <Button title="Guardar Rutina" onPress={handleGuardarRutina} />
            </View>
        )}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userItem: {
    marginBottom: 10,
  },
  rutinaContainer: {
    marginTop: 20,
  },
  rutinaText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rutinaInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default SuperComponent;
