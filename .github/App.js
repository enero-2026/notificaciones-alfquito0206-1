import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { PaperProvider, Button } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    cargarContador();
  }, []);

  useEffect(() => {
    guardarContador(contador);
  }, [contador]);

  const incrementar = () => {
    setContador(contador + 1);
  };

  const guardarContador = async (valor) => {
    try {
      await AsyncStorage.setItem("contador", JSON.stringify(valor));
    } catch (e) {
      console.log("Error guardando");
    }
  };

  const cargarContador = async () => {
    try {
      const data = await AsyncStorage.getItem("contador");
      if (data !== null) {
        setContador(JSON.parse(data));
      }
    } catch (e) {
      console.log("Error cargando");
    }
  };

  const pedirPermiso = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Error', '¡No se obtuvieron permisos para notificaciones!');
      return;
    }
    Alert.alert('Éxito', 'Permisos concedidos');
  };

  const enviarNotificacion = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Valor del contador",
        body: `El contador está en: ${contador}`,
      },
      trigger: null,
    });
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={{ marginTop: 50 }}>
          <Text style={styles.title}>Notificaciones</Text>

          <Text style={styles.contador}>Contador: {contador}</Text>

          <Button
            mode="contained"
            onPress={incrementar}
            style={styles.button}
          >
            Incrementar
          </Button>

          <Button
            mode="contained"
            onPress={pedirPermiso}
            style={styles.button}
          >
            Pedir permiso
          </Button>

          <Button
            mode="outlined"
            onPress={enviarNotificacion}
            style={styles.button}
          >
            Enviar notificación con contador
          </Button>
        </View>
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  contador: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
  },
});
